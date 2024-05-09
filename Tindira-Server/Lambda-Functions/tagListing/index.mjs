import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import AWS from 'aws-sdk';

const lambda = new AWS.Lambda();

const db = new DynamoDBClient({ region: 'us-east-2' }); // Connect to DynamoDB

export const handler = async (event) => {

  queryParams = event.qeuryStringParameters;
  
  if (!validateParams(queryParams, event.body)) { // Check that query params for users have been passed
    const response = {
      statusCode: 400,
      body: JSON.stringify("Query parameters haven't been set properly!")
    };
  
    return response;
  }
  
  const lambdaParams = {
    FunctionName: 'users-login-system', // Use this Lambda function to verify the token
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({
      httpMethod: "POST",
      path: "/verify",
      body: {
        token: event.body.token,
        user: {
          username: event.body.username
        }
      }
    })
  };

  try {
    const response = await lambda.invoke(lambdaParams).promise(); // Handle response from the "verify" Lambda function
    if (!response.message || response.message !== "success") {
      const res = {
        statusCode: 400,
        body: JSON.stringify("Invalid verification token!")
      };
      return res;
    }
  } catch (error) { // Handle errors
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Internal Server Error',
          error: error.message
        })
      };
  }

  try { // Query the user
    
    let command = new GetItemCommand({
      TableName: "TindiraUsers",
      Key: {
        "username": { S: queryParams.userName }
      }
    });
    
    let res = await db.send(command);
    
    if (res.Item !== undefined) { // If the user exists
      
      if (queryParams.isLike === "true") { // Check whether the user liked the listing
      
        let x = await updateListingLikes(queryParams.listingId, queryParams.userName); // Add user to the listing's liked-by array
        
        if (x === "error1") { // Check for errors
          const response = {
            statusCode: 400,
            body: JSON.stringify("Listing with provided ID does not exist!")
          };
      
          return response;
        } else if (x === "error2") {
          const response = {
            statusCode: 500,
            body: JSON.stringify("Internal server error")
          };
          
          return response;
        }
      }
      
      let x = await updateUserHistory(queryParams, res.Item); // Add the listing to the user's history
      
      if (x === "error2") {
        const response = {
          statusCode: 500,
          body: JSON.stringify("Internal server error")
        };
          
        return response;
      }
      
    } else { // User doesn't exist
      const response = {
        statusCode: 400,
        body: JSON.stringify("User with provided username does not exist!")
      };
      
      return response;
    }
    
  } catch (err) {
    const response = {
      statusCode: 500,
      body: JSON.stringify("Internal server error")
    };
  
    return response;
  }
  
  const response = { // Success, update complete
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    body: JSON.stringify("Success"),
  };
  
  return response;
  
};


/*************************************************************************************************************************************************************************************/


function validateParams(e, body) { // Validate query strings and request body
  
  if (e.userName === undefined || e.listingId === undefined || e.category === undefined || e.isLike === undefined || e.userName === "" 
  || e.listingId === "" || e.category === "" || e.isLike === "" || body === undefined) {
    return false;
  }
  
  if (e.isLike !== "true" && e.isLike !== "false" && e.category !== "rent" && e.category !== "sublet") {
    return false;
  }

  if (body.username === undefined || body.username === "" || body.token === undefined || body.token === "") {
    return false;
  }
  
  return true;
  
}


/*************************************************************************************************************************************************************************************/


async function updateListingLikes(listingId, userName) { // User liked the listing, add his username to the listing's liked-by array
  
  try {
    
    let command = new GetItemCommand({ // Query the listing
      TableName: "TindiraListings",
      Key: {
        "listingId": { S: listingId }
      }
    });
    
    let res = await db.send(command);
    
    if (res.Item !== undefined) {
      
      for (let i = 0; i < res.Item.likedBy.L.length; i++) { // Check whether the user already liked the listing in the past
        if (userName === res.Item.likedBy.L[i].S) {
          return "success";
        }
      }
      
      try {
          
        command = new UpdateItemCommand({ // Update the listing's liked-by array
          TableName: "TindiraListings",
          Key: {
            "listingId": { S: listingId }
          },
          UpdateExpression: 'SET #likedBy = list_append(if_not_exists(#likedBy, :empty_list), :param)',
          ExpressionAttributeNames: {
            '#likedBy': 'likedBy'
          },
          ExpressionAttributeValues: {
            ':param': { L: [{ S: userName }] },
            ':empty_list': { L: [] }
          },
          ReturnValues: 'ALL_NEW'
        });
            
        res = await db.send(command);
          
      } catch (err) {
          return "error2";
      }
        
    } else {
      return "error1";
    }
    
  } catch (err) {
    return "error2";
  }
  
  return "success";
  
}

/*************************************************************************************************************************************************************************************/

async function updateUserHistory(e, user) { // Add the listing to the user's history
  
  let whichArray = user.history;
  
  switch (e.category + "&" + e.isLike) { // Choose which array from the history is to be updated according to category and liked
    case ("rent&true"):
      whichArray = whichArray.M.rent.M.liked.L;
      break;
    case ("rent&false"):
      whichArray = whichArray.M.rent.M.unliked.L;
      break;
    case ("sublet&true"):
      whichArray = whichArray.M.sublet.M.liked.L;
      break;
    case ("sublet&false"):
      whichArray = whichArray.M.sublet.M.unliked.L;
      break;
  }
  
  for (var i = 0; i < whichArray.length; i++) { // Check whether the listing was already added to the history
    if (e.listingId === whichArray[i].S) {
      return "success";
    }
  }
  
  whichArray.push({S: e.listingId});
  
  switch (e.category + "&" + e.isLike) {
    case ("rent&true"):
      user.history.M.rent.M.liked.L = whichArray;
      break;
    case ("rent&false"):
      user.history.M.rent.M.unliked.L = whichArray;
      break;
    case ("sublet&true"):
      user.history.M.sublet.M.liked.L = whichArray;
      break;
    case ("sublet&false"):
      user.history.M.sublet.M.unliked.L = whichArray;
      break;
  }
  
  try {
    
    let command = new UpdateItemCommand({ // Update the user's history
      TableName: "TindiraUsers",
      Key: {
        "username": { S: e.userName }
      },
      UpdateExpression: "SET #history = :param",
      ExpressionAttributeNames: {
        "#history": "history"
      },
      ExpressionAttributeValues: {
        ":param": { 
          M: {
            rent: {
              M: {
                unliked: { L: user.history.M.rent.M.unliked.L },
                liked: { L: user.history.M.rent.M.liked.L }
              }
            },
            sublet: {
              M: {
                unliked: { L: user.history.M.sublet.M.unliked.L },
                liked: { L: user.history.M.sublet.M.liked.L }
              }
            }
          }
        },
      },
      ReturnValues: 'ALL_NEW'
    });
    
    await db.send(command); 
    
  } catch (err) {
    return "error2";
  }
  
  return "success";
  
}
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import AWS from 'aws-sdk';

const lambda = new AWS.Lambda();

const db = new DynamoDBClient({ region: 'us-east-2' }); // Connect to DynamoDB

export const handler = async (event) => {

  let queryParams = event.queryStringParameters;

  if (!validateParams2(queryParams)) { // Check that query params for users have been passed
    const response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify("Parameters haven't been set properly!")
    };
  
    return response;
  }

  /*let body = JSON.parse(event.headers);
  
  if (!validateParams(queryParams, body)) { // Check that query params for users have been passed
    const response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify("Parameters haven't been set properly!")
    };
  
    return response;
  }
  
  const lambdaParams = {
    FunctionName: 'users-login-system', // Use this Lambda function to verify the token
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({
      httpMethod: "POST",
      path: "/verify",
      body: JSON.stringify({
        token: body.token,
        user: {
          username: body.username
        }
      })
    })
  };

  try {
    const response = await lambda.invoke(lambdaParams).promise(); // Handle response from the "verify" Lambda function
    const payloadMessage = JSON.parse(JSON.parse(response.Payload).body).message
    if (!payloadMessage || payloadMessage !== "success") {
      const res = {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify("Invalid verification token!")
      };
      return res;
    }
  } catch (error) { // Handle errors
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Internal server error"
        })
      };
  }*/

  try { // Query the user
    
    let command = new GetItemCommand({
      TableName: "TindiraUsers",
      Key: {
        "username": { S: queryParams.username }
      }
    });
    
    let res = await db.send(command);
    
    if (res.Item !== undefined) { // If the user exists
      
      if (queryParams.isLike === "true") { // Check whether the user liked the listing
      
        let x = await updateListingLikes(queryParams.listingId, queryParams.username); // Add user to the listing's liked-by array
        
        if (x === "error1") { // Check for errors
          const response = {
            statusCode: 400,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify("Listing with provided ID does not exist!")
          };
      
          return response;
        } else if (x === "error2") {
          const response = {
            statusCode: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify("Internal server error")
          };
          
          return response;
        }
      }
      
      let x = await updateUserHistory(queryParams, res.Item); // Add the listing to the user's history
      
      if (x === "error2") {
        const response = {
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify("Internal server error")
        };
          
        return response;
      }
      
    } else { // User doesn't exist
      const response = {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify("User with provided username does not exist!")
      };
      
      return response;
    }
    
  } catch (err) {
    const response = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
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


function validateParams(query, body) { // Validate query strings and request body
  
  if (query.username === undefined || query.listingId === undefined || query.category === undefined || query.isLike === undefined || query.username === "" 
  || query.listingId === "" || query.category === "" || query.isLike === "" || body === undefined) {
    return false;
  }
  
  if (query.isLike !== "true" && query.isLike !== "false" && query.category !== "rent" && query.category !== "sublet") {
    return false;
  }

  if (body.username === undefined || body.username === "" || body.token === undefined || body.token === "") {
    return false;
  }
  
  return true;
  
}

function validateParams2(query) { // Validate query strings and request body
  
  if (query.username === undefined || query.listingId === undefined || query.category === undefined || query.isLike === undefined || query.username === "" 
  || query.listingId === "" || query.category === "" || query.isLike === "") {
    return false;
  }
  
  if (query.isLike !== "true" && query.isLike !== "false" && query.category !== "rent" && query.category !== "sublet") {
    return false;
  }
  
  return true;
  
}


/*************************************************************************************************************************************************************************************/


async function updateListingLikes(listingId, username) { // User liked the listing, add his username to the listing's liked-by array
  
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
        if (username === res.Item.likedBy.L[i].S) {
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
            ':param': { L: [{ S: username }] },
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

async function updateUserHistory(query, user) { // Add the listing to the user's history
  
  let whichArray = user.history;
  
  switch (query.category + "&" + query.isLike) { // Choose which array from the history is to be updated according to category and liked
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
    if (query.listingId === whichArray[i].S) {
      return "success";
    }
  }
  
  whichArray.push({S: query.listingId});
  
  switch (query.category + "&" + query.isLike) {
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
        "username": { S: query.username }
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
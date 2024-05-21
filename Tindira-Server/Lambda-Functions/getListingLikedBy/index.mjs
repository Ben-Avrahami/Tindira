import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
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

  let likedByArray = await getLikedByArray(queryParams.listingId) // Get the likedBy array of the listing according to the listingId parameter
  
  if (likedByArray === "error1") { // Check for errors returned
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
  
  if (likedByArray === "error2") {
    const response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify("Listing with provided listing-ID does not exist!")
    };
      
    return response;
  }

  let pagedUsers = await usersPaging(likedByArray, parseInt(queryParams.page, 10), parseInt(queryParams.items, 10)); // Filter the users according to the page/items params and return the result array
  
  if (pagedUsers === "error1") { // Check for errors returned
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
  
  
  const response = { // Success, return the paged users
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({users: pagedUsers, totalItems: likedByArray.length}),
  };
  
  return response;
};


/*************************************************************************************************************************************************************************************/


function validateParams(query, body) { // Validate query strings and request body
  
  if (query.listingId === undefined || query.page === undefined || query.items === undefined
    || query.listingId === "" || query.page === "" || query.items === "" || body === undefined) {
    return false;
  }

  if (body.username === undefined || body.username === "" || body.token === undefined || body.token === "") {
    return false;
  }
  
  let x1 = parseInt(query.page, 10);
  let x2 = parseInt(query.items, 10);
  
  if (isNaN(x1) || isNaN(x2)) {
    return false;
  }
  
  if (x1 <= 0 || x2 <= 0) {
    return false;
  }
  
  return true;
  
}

function validateParams2(query) { // Validate query strings and request body
  
  if (query.listingId === undefined || query.page === undefined || query.items === undefined
    || query.listingId === "" || query.page === "" || query.items === "") {
    return false;
  }
  
  let x1 = parseInt(query.page, 10);
  let x2 = parseInt(query.items, 10);
  
  if (isNaN(x1) || isNaN(x2)) {
    return false;
  }
  
  if (x1 <= 0 || x2 <= 0) {
    return false;
  }
  
  return true;
  
}


/*************************************************************************************************************************************************************************************/


async function getLikedByArray(listingId) { // Get the likedBy array of the listing
  
  let res;
  
  try {
    
    let command = new GetItemCommand({
      TableName: "TindiraListings",
      Key: {
        "listingId": { S: listingId }
      }
    });
    
    res = await db.send(command);
    
    if (res.Item === undefined) {
      return "error2";
    }
    
  } catch (err) {
    return "error1";
  }

  var marshalled = AWS.DynamoDB.Converter.unmarshall(res.Item);

  return marshalled.likedBy;
  
}


/*************************************************************************************************************************************************************************************/


async function usersPaging(users, page, items) { // Filter the users according to page/items
  
  let pagedUsers = [];
  let usersLen = users.length;
  let first = (page - 1) * items;
  
  for (let i = first; i < Math.min(first + items, usersLen); i++) {
    pagedUsers.push(users[i]);
  }
  
  let result = [];
  
  for (var i = 0; i < pagedUsers.length; i++) { // Iterate over the user-names and query their corresponding users in the db
    const params = {
      TableName: "TindiraUsers",
      Key: {
        "username": { S: pagedUsers[i] }
      }
    };
    try {
      const command = new GetItemCommand(params);
      const res = await db.send(command);
      if (res.Item !== undefined) {
        var marshalled = AWS.DynamoDB.Converter.unmarshall(res.Item);
        delete marshalled['password'];
        delete marshalled['history'];
        result.push(marshalled);
      } else {
        result.push("User with provided user-name does not exist!");
      }
    } catch (err) {
      return "error1";
    }
  }
  
  return result; // Return the users
  
}
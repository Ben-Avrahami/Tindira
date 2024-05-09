import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import AWS from 'aws-sdk';

const lambda = new AWS.Lambda();

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
  
  const db = new DynamoDBClient({ region: 'us-east-2' }); // Connect to DynamoDB
  
  queryParams.username = "[" + queryParams.username + "]";
  
  let usernames = [];
  
  usernames = queryParams.username.slice(1, -1).split(','); // Convert query param to user ID array
  
  if (usernames[0] === "") {
    usernames = [];
  }
  
  let users = [];
  
  for (var i = 0; i < usernames.length; i++) { // Iterate over the IDs and query their corresponding user in the DB 
    const params = {
      TableName: "TindiraUsers",
      Key: {
        "username": { S: usernames[i] }
      }
    };
    try {
      const command = new GetItemCommand(params);
      const res = await db.send(command);
      if (res.Item !== undefined) {
        users.push(res.Item);
      } else {
        users.push("User with provided ID does not exist!");
      }
    } catch (err) {
      const response = {
        statusCode: 500,
        body: JSON.stringify("Internal server error")
      };
  
      return response;
    }
  }
  
  const response = { // Success, return the listings
    statusCode: 200,
    body: JSON.stringify(users),
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    }
  };
  
  return response;
  
};


/*************************************************************************************************************************************************************************************/


function validateParams(e, body) { // Validate query strings and request body
  
  if (e.username === undefined || e.username === "" || body === undefined) {
    return false;
  }

  if (body.username === undefined || body.username === "" || body.token === undefined || body.token === "")
  
  return true;
  
}
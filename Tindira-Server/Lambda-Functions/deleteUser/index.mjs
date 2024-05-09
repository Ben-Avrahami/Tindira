import { DynamoDBClient, GetItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
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
  
  const params = {
    TableName: "TindiraUsers",
    Key: {
      "username": { S: queryParams.username }
    }
  };
  
  try {
    const getCommand = new GetItemCommand(params); // Check whether the user we want to delete exists
    const res = await db.send(getCommand);
    if (res.Item !== undefined) { // If exists, delete the user
      const command = new DeleteItemCommand(params);
      await db.send(command);
    } else {
      const response = {
        statusCode: 400,
        body: JSON.stringify("Attempt to delete user that doesn't exist!")
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
  
  const response = { // Deletion success
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
  
  if (e.username === undefined || e.username === "" || body === undefined) {
    return false;
  }

  if (body.username === undefined || body.username === "" || body.token === undefined || body.token === "") {
    return false;
  }
  
  return true;
  
}
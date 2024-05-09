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

  queryParams.id = "[" + queryParams.id + "]";
  
  let IDs = [];
  
  IDs = queryParams.id.slice(1, -1).split(','); // Convert query param to listing ID array
  
  if (IDs[0] === "") {
    IDs = [];
  }
  
  let listings = [];
  
  for (var i = 0; i < IDs.length; i++) { // Iterate over the IDs and query their corresponding listing in the DB 
    const params = {
      TableName: "TindiraListings",
      Key: {
        "listingId": { S: IDs[i] }
      }
    };
    try {
      const command = new GetItemCommand(params);
      const res = await db.send(command);
      if (res.Item !== undefined) {
        listings.push(res.Item);
      } else {
        listings.push("Listing with provided ID does not exist!");
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
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listings),
  };
  
  return response;
  
};


/*************************************************************************************************************************************************************************************/


function validateParams(e, body) { // Validate query strings and request body
  
  if (e.id === undefined || e.id === "" || body === undefined) {
    return false;
  }

  if (body.username === undefined || body.username === "" || body.token === undefined || body.token === "") {
    return false;
  }
  
  return true;
  
}
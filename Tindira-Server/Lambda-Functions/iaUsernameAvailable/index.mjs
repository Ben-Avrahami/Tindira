import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import AWS from 'aws-sdk';

const lambda = new AWS.Lambda();

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

  /*let body = JSON.parse(event.headers)

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

  const db = new DynamoDBClient({ region: 'us-east-2' }); // Connect to DynamoDB

  let exists = null;

  try {
    exists = await checkExistingUser(queryParams.username);
  } catch (err) {
    const response = { // Errors retrieving the user
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "X-Requested-With": "*"
      },
      body: JSON.stringify(err)
    };
  
    return response;
  }
  
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(exists)
  };
  
  return response;
  
};


/*************************************************************************************************************************************************************************************/


function validateParams(query, body) { // Validate query strings and request body
  
  if (query.username === undefined || query.username === "" || query.fields === undefined || query.fields === "" || body === undefined) {
    return false;
  }

  if (body.username === undefined || body.username === "" || body.token === undefined || body.token === "") {
    return false;
  }

  return validateFields(query.fields);
}

function validateParams2(query) { // Validate query strings and request body
  
  if (query.username === undefined || query.username === "" /*|| query.fields === undefined || query.fields === ""*/) {
    return false;
  }
  
  //return validateFields(query.fields);
  return true;
}


/*************************************************************************************************************************************************************************************/


async function checkExistingUser(username) { // Query the user, check for its existance

  const params = {
    TableName: "TindiraUsers",
    Key: {
      "username": { S: username }
    }
  };

  const command = new GetItemCommand(params);
  const res = await db.send(command);
  if (res.Item !== undefined) {
    return true;
  }

  return false;

}
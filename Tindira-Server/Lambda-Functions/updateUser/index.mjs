import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import AWS from 'aws-sdk';
import joi from "joi";
import joiDate from "@joi/date";
import { marshall } from "@aws-sdk/util-dynamodb";

const lambda = new AWS.Lambda();
const Joi = joi.extend(joiDate)
const db = new DynamoDBClient({ region: 'us-east-2' }); // Connect to DynamoDB

export const handler = async (event) => {

  let body = JSON.parse(event.body);
  let username = event.queryStringParameters.username;

  if (validateBodyHeaders(body) === false || username === undefined || username === "") { // Check that body/header params for the user have been passed correctly
    const response = {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "X-Requested-With": "*"
      },
      body: JSON.stringify("Parameters haven't been set properly!")
    };
  
    return response;
  }

  /*let headers = JSON.parse(event.headers);
  
  if (!validateParams(queryParams, headers)) { // Check that query params for users have been passed
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
        token: headers.token,
        user: {
          username: headers.username
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

  try {
    await updateUser(body, username); // Update the user
  } catch (err) {
    const response = { // Errors updating the user
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

  /*if (updated === "error") { // Old upload error format  
    const response = {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "X-Requested-With": "*"
      },
      body: JSON.stringify("Internal server error")
    };

    return response;
  }*/

  const response = { // User updated successfully
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "X-Requested-With": "*"
    },
    body: JSON.stringify("Success"),
  };
  
  return response;
};


/*************************************************************************************************************************************************************************************/


function validateBodyHeaders(body) { // Use Joi to create a schema for the validation of the request body that stores the user

  /*if (!headers || headers.username === undefined || headers.username === "" || headers.token === undefined || headers.token === "") {
    return false;
  }*/

  const userSchema = Joi.object().keys({
    email: Joi.string(),
    fullName: Joi.string(),
    phoneNumber: Joi.string(),
    profileDescription: Joi.string(),
    profilePicture: Joi.string(),
    roles: Joi.string()
  }).required().min(1);

  const { error, value } = userSchema.validate(body); // Validate the user input
  if (error) {
    return false;
  }

  return true;
}


/*************************************************************************************************************************************************************************************/


async function updateUser(body, username) {

  let bodyUpdated = body; // Add the ID property, and also isActive and likedBy properties to the listing object

  const updateExpression = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.keys(bodyUpdated).forEach(function(key) {
      updateExpression.push("#"+key+" = " +":"+key);
      expressionAttributeNames["#" + key] = key;
      expressionAttributeValues[":" + key] = bodyUpdated[key];
  });

  const params = {
    TableName: "TindiraUsers", // replace with your table name
    Key: {
        "username": { S: username } // assuming id is a string, change as necessary
    },
    UpdateExpression: `SET ${updateExpression.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: marshall(expressionAttributeValues),
    ConditionExpression: "attribute_exists(username)", // Ensures the item exists
    ReturnValues: "ALL_NEW" // returns the updated item
  };

  await db.send(new UpdateItemCommand(params));

}
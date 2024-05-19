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
  let fields = [];

  let typeFields = validateFields(queryParams.fields);
  if (typeFields === 1) {
    const response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify("Parameters haven't been set properly!")
    };
  
    return response;
  } else if (typeFields === 0) {
    fields = ['history', 'fullName', 'listings', 'phoneNumber', 'profileDescription', 'profilePicture', 'reviews', 'roles'];
  } else {
    queryParams.fields = "[" + queryParams.fields + "]";
    fields = queryParams.fields.slice(1, -1).split(',');
    if (fields[0] === "") {
      fields = [];
    }
  }
  
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
        var marshalled = AWS.DynamoDB.Converter.unmarshall(res.Item);
        users.push(parseUser(marshalled, fields))
      } else {
        users.push("User with provided ID does not exist!");
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
  }
  
  const response = { // Success, return the listings
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(users)
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

function validateFields(fields) { // Validate that all fields provided are legal

  if (fields === undefined) {
    return 0;
  } else if (fields === "") {
    return 2;
  }

  const legalFields = ['username', 'history', 'fullName', 'listings', 'phoneNumber', 'profileDescription', 'profilePicture', 'reviews', 'roles'];

  fields = "[" + fields + "]";
  let fieldsArray = [];
  fieldsArray = fields.slice(1, -1).split(','); // Convert query param to fields array

  for (var i = 0; i < fieldsArray.length; i++) {
    if (!legalFields.includes(fieldsArray[i])) {
      return 1;
    }
  }

  return 2;

}

/*************************************************************************************************************************************************************************************/


function parseUser(user, fields) { // Extract the fields required by the parameter into an object to be returned inside the array

  let obj = {};
  obj['username'] = user['username']

  for (var i = 0; i < fields.length; i++) {
    obj[fields[i]] = user[fields[i]];
  }

  return obj;

}
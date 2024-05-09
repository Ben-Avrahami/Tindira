import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
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
  
  let whichArray = await getHistory(queryParams.userName, queryParams.category, queryParams.showLikes); // Get the listing history array according to the params
  
  if (whichArray === "error1") { // Check for errors returned
    const response = {
      statusCode: 500,
      body: JSON.stringify("Internal server error")
    };
  
    return response;
  }
  
  if (whichArray === "error2") {
    const response = {
      statusCode: 400,
      body: JSON.stringify("User with provided username does not exist!")
    };
      
    return response;
  }
  
  let pagedListings = await listingPaging(whichArray, parseInt(queryParams.page, 10), parseInt(queryParams.items, 10)); // Filter the listings according to the page/items params and return the result array
  
  if (pagedListings === "error1") { // Check for errors returned
    const response = {
      statusCode: 500,
      body: JSON.stringify("Internal server error")
    };
  
    return response;
  }
  
  
  const response = { // Success, return the paged listings
    statusCode: 200,
    body: JSON.stringify(pagedListings),
  };
  
  return response;
};


/*************************************************************************************************************************************************************************************/


function validateParams(e, body) { // Validate query strings and request body
  
  if (e.userName === undefined || e.category === undefined || e.page === undefined || e.items === undefined || e.showLikes === undefined 
    || e.userName === "" || e.category === "" || e.page === "" || e.items === "" || e.showLikes === "" || body === undefined) {
    return false;
  }
  
  if (e.showLikes !== "true" && e.showLikes !== "false" && e.category !== "rent" && e.category !== "sublet") {
    return false;
  }

  if (body.username === undefined || body.username === "" || body.token === undefined || body.token === "") {
    return false;
  }
  
  let x1 = parseInt(e.page, 10);
  let x2 = parseInt(e.items, 10);
  
  if (isNaN(x1) || isNaN(x2)) {
    return false;
  }
  
  if (x1 <= 0 || x2 <= 0) {
    return false;
  }
  
  return true;
  
}


/*************************************************************************************************************************************************************************************/


async function getHistory(userName, category, showLikes) { // Get the correct history listing array according to the params
  
  let res;
  
  try {
    
    let command = new GetItemCommand({
      TableName: "TindiraUsers",
      Key: {
        "username": { S: userName }
      }
    });
    
    res = await db.send(command);
    
    if (res.Item === undefined) {
      return "error2";
    }
    
  } catch (err) {
    return "error1";
  }
  
  switch (category + "&" + showLikes) {
    case ("rent&true"):
      return res.Item.history.M.rent.M.liked.L;
    case ("rent&false"):
      return res.Item.history.M.rent.M.unliked.L;
    case ("sublet&true"):
      return res.Item.history.M.sublet.M.liked.L;
    case ("sublet&false"):
      return res.Item.history.M.sublet.M.unliked.L;
  }
  
}


/*************************************************************************************************************************************************************************************/


async function listingPaging(listings, page, items) { // Filter the listings according to page/items
  
  let pagedListingIDs = [];
  let listingsLen = listings.length;
  let first = (page - 1) * items;
  
  for (let i = first; i < Math.min(first + items, listingsLen); i++) {
    pagedListingIDs.push(listings[i]);
  }
  
  let result = [];
  
  for (var i = 0; i < pagedListingIDs.length; i++) { // Iterate over the IDs and query their corresponding listing in the DB 
    const params = {
      TableName: "TindiraListings",
      Key: {
        "listingId": { S: pagedListingIDs[i].S }
      }
    };
    try {
      const command = new GetItemCommand(params);
      const res = await db.send(command);
      if (res.Item !== undefined) {
        result.push(res.Item);
      } else {
        result.push("Listing with provided ID does not exist!");
      }
    } catch (err) {
      return "error1";
    }
  }
  
  return result; // Return the listings
  
}
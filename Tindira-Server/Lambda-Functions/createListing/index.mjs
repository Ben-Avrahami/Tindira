import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import joi from "joi";
import joiDate from "@joi/date";
import { marshall } from "@aws-sdk/util-dynamodb";

const lambda = new AWS.Lambda();
const Joi = joi.extend(joiDate)
const db = new DynamoDBClient({ region: 'us-east-2' }); // Connect to DynamoDB

export const handler = async (event) => {

  let body = JSON.parse(event.body);
  let username = event.queryStringParameters.username;

  if (validateBodyHeaders(body, username) === false) { // Check that body/header params for the listing have been passed correctly
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

  const listingId = uuidv4(); // Create a unique ID for the new listing

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

  let [pricePerMonth, pricePerWholeTime] = calcPrices(body) // Calculate the prices for month and whole period

  try {
    await createListing(body, listingId, pricePerMonth, pricePerWholeTime); // Upload the listing
  } catch (err) {
    const response = { // Errors uploading the listing
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

  /*if (uploadListing === "error") { // Old format
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

  try {
    await addListingToUser(username, listingId); // Add the listing to the user's array
  } catch (err) {
    const response = { // Errors adding the listings to the user's row in the DB
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

  const response = { // Listing created successfully
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "X-Requested-With": "*"
    },
    body: JSON.stringify({listingId: listingId}),
  };
  
  return response;
};


/*************************************************************************************************************************************************************************************/


function validateBodyHeadersQueryString(body, username) { // Use Joi to create a schema for the validation of the request body that stores the listing

  /*if (!headers || headers.username === undefined || headers.username === "" || headers.token === undefined || headers.token === "") {
    return false;
  }*/

  const usernameSchema = Joi.object().keys({
    username: Joi.string().required()
  });

  const listingSchema = Joi.object().keys({
    category: Joi.string().valid("rent", "sublet").required(),
    contractStartDate: Joi.date().format('YYYY-MM-DD').required(),
    contractEndDate: Joi.date().format('YYYY-MM-DD').required(),
    postExpireDate: Joi.date().format('YYYY-MM-DD').required(),
    postUploadDate: Joi.date().format('YYYY-MM-DD').required(),
    description: Joi.string().required(),
    isAnimalFriendly: Joi.boolean().required(),
    ownerId: Joi.string().required(),
    price: Joi.number().required(),
    title: Joi.string().required(),
    isWithGardenOrPorch: Joi.boolean().required(),
    parkingSpaces: Joi.number().required(),
    numberOfRooms: Joi.number().required(),
    isPricePerWholeTime: Joi.boolean().required(),
    coordinates: Joi.object({ 
      formatted_address: Joi.string().required(), 
      geometry: Joi.object({ 
        location: Joi.object({ 
          lat: Joi.number().required(), 
          lng: Joi.number().required() }), 
        viewport: Joi.object({
          east: Joi.number().required(),
          north: Joi.number().required(),
          south: Joi.number().required(),
          west: Joi.number().required() }) 
        }).required(), 
      place_id: Joi.string().required() 
    }).required()

  });

  const { error1, value1 } = listingSchema.validate(body); // Validate the listing input
  if (error1) {
    return false;
  }

  const { error2, value2 } = usernameSchema.validate(username); // Validate the username
  if (error2) {
    return false;
  }

  return true;
}


/*************************************************************************************************************************************************************************************/


async function createListing(body, ID, pricePerMonth, pricePerWholeTime) {

  let bodyUpdated = body; // Add the ID property, and also isActive and likedBy properties to the listing object
  bodyUpdated['listingId'] = ID;
  bodyUpdated['isActive'] = true;
  bodyUpdated['likedBy'] = [];
  bodyUpdated['images'] = []
  bodyUpdated['pricePerMonth'] = pricePerMonth;
  bodyUpdated['pricePerWholeTime'] = pricePerWholeTime;
  delete bodyUpdated.price;

  const params = {
    TableName: "TindiraListings",
    Item: marshall(bodyUpdated)
  };

  await db.send(new PutItemCommand(params)); // Upload the listing

  /*try { // Old format
    await db.send(new PutItemCommand(params)); // Upload the listing
  } catch (err) {
    return "error";
  }

  return "success";*/
}


/*************************************************************************************************************************************************************************************/


async function addListingToUser(username, listingId) {

  const params = {
    TableName: "TindiraUsers", // replace with your table name
    Key: {
        username: { S: username } // assuming id is a string, change as necessary
    },
    UpdateExpression: "SET #listings = list_append(if_not_exists(#listings, :empty_list), :listingId)",
    ExpressionAttributeNames: {
        "#listings": "listings"
    },
    ExpressionAttributeValues: {
        ":listingId" : { L: [{ S: listingId }] }, // adjust type if necessary
        ":empty_list": { L: [] }
    },
    ConditionExpression: "attribute_exists(username)", // Ensures the item exists
    ReturnValues: "ALL_NEW" // returns the updated item
  };

  await client.send(new UpdateItemCommand(params));
  
}


/*************************************************************************************************************************************************************************************/


function calcPrices(body) { // Calculate both prices for per month and whole period

  let price = body.price
  let durationMonths = calcDurationMonths(body.contractStartDate, body.contractEndDate);

  if (body.isPricePerWholeTime === true) {
    return [Math.floor(price / durationMonths), Math.floor(price)];
  } else {
    return [Math.floor(price), Math.floor(durationMonths * price)];
  }
  
}


/*************************************************************************************************************************************************************************************/


function calcDurationMonths(start, end) { // Receive two dates and calculate the amount of months between them

  // Parse the start and end dates
  let startDate = new Date(start);
  let endDate = new Date(end);

  // Get the year and month for start and end dates
  let startYear = startDate.getFullYear();
  let startMonth = startDate.getMonth();
  let endYear = endDate.getFullYear();
  let endMonth = endDate.getMonth();

  // Calculate the difference in months
  let monthDifference = (endYear - startYear) * 12 + (endMonth - startMonth);

  // Calculate the day of the month differences
  let startDay = startDate.getDate();
  let endDay = endDate.getDate();
  let dayDifference = (endDay - startDay) / 30; // Rough estimate of a month in days

  // Total months including the partial month
  let totalMonths = monthDifference + dayDifference;

  return totalMonths;

}
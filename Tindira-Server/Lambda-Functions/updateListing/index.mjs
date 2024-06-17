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

  if (validateBodyHeaders(body) === false) { // Check that body/header params for the listing have been passed correctly
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

  let [pricePerMonth, pricePerWholeTime] = [0, 0]

  if (body.price !== undefined && body.price !== "") {
    [pricePerMonth, pricePerWholeTime] = calcPrices(body) // Calculate the prices for month and whole period
  }

  try {
    await updateListing(body, pricePerMonth, pricePerWholeTime); // Update the listing
  } catch (err) {
    const response = { // Errors updating the listing
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

  const response = { // Listing updated successfully
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


function validateBodyHeaders(body) { // Use Joi to create a schema for the validation of the request body that stores the listing

  /*if (!headers || headers.username === undefined || headers.username === "" || headers.token === undefined || headers.token === "") {
    return false;
  }*/

  const listingSchema = Joi.object().keys({
    listingId: Joi.string().required(),
    isActive: Joi.boolean(),
    price: Joi.number(),
    category: Joi.string().valid("rent", "sublet"),
    contractStartDate: Joi.date().format('YYYY-MM-DD'),
    contractEndDate: Joi.date().format('YYYY-MM-DD'),
    postExpireDate: Joi.date().format('YYYY-MM-DD'),
    postUploadDate: Joi.date().format('YYYY-MM-DD'),
    description: Joi.string(),
    isAnimalFriendly: Joi.boolean(),
    ownerId: Joi.string(),
    title: Joi.string(),
    isWithGardenOrPorch: Joi.boolean(),
    parkingSpaces: Joi.number(),
    numberOfRooms: Joi.number(),
    isPricePerWholeTime: Joi.boolean(),
    images: Joi.array().items(Joi.string()),
    coordinates: Joi.object({ 
      formatted_address: Joi.string(), 
      geometry: Joi.object({ 
        location: Joi.object({ 
          lat: Joi.number(), 
          lng: Joi.number() }), 
        viewport: Joi.object({
          east: Joi.number(),
          north: Joi.number(),
          south: Joi.number(),
          west: Joi.number() }) 
        }), 
      place_id: Joi.string() 
    })
  }).or('price', 'isPricePerWholeTime', 'contractStartDate', 'contractEndDate')  // Check that either they are both sent or not, both are essential to updating the pricing
  .and('price', 'isPricePerWholeTime', 'contractStartDate', 'contractEndDate');

  const { error, value } = listingSchema.validate(body); // Validate the listing input
  if (error) {
    return false;
  }

  return true;
}


/*************************************************************************************************************************************************************************************/


async function updateListing(body, pricePerMonth, pricePerWholeTime) {

  let bodyUpdated = body; // Add the ID property, and also isActive and likedBy properties to the listing object
  if (body.price !== undefined && body.price !== "" & !isNaN(body.price)) {
    bodyUpdated['pricePerMonth'] = pricePerMonth;
    bodyUpdated['pricePerWholeTime'] = pricePerWholeTime;
  }
  delete bodyUpdated.price;

  const updateExpression = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.keys(bodyUpdated).forEach(function(key) {
    if (key !== 'listingId') {
      updateExpression.push("#"+key+" = " +":"+key);
      expressionAttributeNames["#" + key] = key;
      expressionAttributeValues[":" + key] = bodyUpdated[key];
    }
  });

  const params = {
    TableName: "TindiraListings", // replace with your table name
    Key: {
        listingId: { S: bodyUpdated.listingId } // assuming id is a string, change as necessary
    },
    UpdateExpression: `SET ${updateExpression.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: marshall(expressionAttributeValues),
    ConditionExpression: "attribute_exists(listingId)", // Ensures the item exists
    ReturnValues: "ALL_NEW" // returns the updated item
  };

  await db.send(new UpdateItemCommand(params));

  /*try { // Old format
    await db.send(new UpdateItemCommand(params));
  } catch (error) {
    return "error";
  }

  return "success";*/

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
import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import joi from "joi";
import joiDate from "@joi/date";
import { marshall } from "@aws-sdk/util-dynamodb";

const lambda = new AWS.Lambda();
const Joi = joi.extend(joiDate)
const db = new DynamoDBClient({ region: 'us-east-2' }); // Connect to DynamoDB

const headers = {
  'Content-Type': 'application/json',
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "X-Requested-With": "*"
}

export const handler = async (event) => {
  let body = JSON.parse(event.body);

  let username = event.queryStringParameters.username;
  
  if (username === undefined || username === "") {
    return {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({error: "Query parameter 'username' not provided"})
    };
  }
      
  const { error, validatedBody } = validateBodyHeaders(body);

  if (error) {
    return {
      statusCode: 400,
      headers: headers,
      body: error
    };
  }

  const listingId = uuidv4(); // Create a unique ID for the new listing

  try {
    const listing = await createListing(validatedBody, listingId); // Upload the listing
    await addListingToUser(username, listingId); // Add the listing to the user's array
    return { // Listing created successfully
      statusCode: 200,
      headers: headers,
      body: listing,
    };
  } catch (err) {
    return { 
      statusCode: 500,
      headers: headers,
      body: err
    };
  }
};


/*************************************************************************************************************************************************************************************/


function validateBodyHeaders(body) { // Use Joi to create a schema for the validation of the request body that stores the listing

  const listingSchema = Joi.object().keys({
    category: Joi.string().valid("rent", "sublet").required(),
    contractStartDate: Joi.date().format('YYYY-MM-DD').required(),
    contractEndDate: Joi.date().format('YYYY-MM-DD').required(),
    postExpireDate: Joi.date().format('YYYY-MM-DD').required(),
    postUploadDate: Joi.date().format('YYYY-MM-DD').required(),
    description: Joi.string().required(),
    isAnimalFriendly: Joi.boolean().required(),
    ownerId: Joi.string().required(),
    pricePerWholeTime: Joi.number(),
    pricePerMonth: Joi.number(),
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
  }).unknown(true);

  return listingSchema.validate(body);
}


/*************************************************************************************************************************************************************************************/


async function createListing(body, ID) {

  let bodyUpdated = body; // Add the ID property, and also isActive and likedBy properties to the listing object
  bodyUpdated['listingId'] = ID;
  bodyUpdated['isActive'] = true;
  bodyUpdated['likedBy'] = [];
  bodyUpdated['images'] = []

  const params = {
    TableName: "TindiraListings",
    Item: marshall(bodyUpdated)
  };

  await db.send(new PutItemCommand(params)); // Upload the listing

  return updatedBody
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
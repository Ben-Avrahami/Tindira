
const db = new DynamoDBClient({ region: 'us-east-2' }); // Connect to DynamoDB
import { DynamoDBClient, GetItemCommand, UpdateItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
//import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

//const client = new DynamoDBClient({ region: 'us-east-2' });
//const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {

    let queryParams = event.queryStringParameters;

    if (!queryParams.listingId || !queryParams.username) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify("Query string are missing!")
        };
    }

    const command = new DeleteItemCommand({
      TableName: "TindiraListings",
      Key: {
        "listingId": { S: queryParams.listingId },
      },
    });

    let res = null;
  
    try {
      await db.send(command);
      await deleteFromUser(queryParams.username, queryParams.listingId);
    } catch (err) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "X-Requested-With": "*"
        },
        body: JSON.stringify(err)
      }
    }


  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "X-Requested-With": "*"
    },
    body: JSON.stringify("Success")
  };
  
  return response;
};





async function deleteFromUser(username, listingId) {

  /*const updateExpression = `REMOVE ${arrayAttributeName}[${arrayAttributeName}.indexOf(:val)]`;
  const expressionAttributeValues = {
      ":val": { S: listingId },
  };

  // Create the UpdateItemCommand
  const command = new UpdateItemCommand({
      TableName: "TindiraUsers",
      Key: {"username": { S: username }},
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
  });

  // Send the command to DynamoDB
  const response = await docClient.send(command);*/


  

const tableName = "TindiraUsers";
const primaryKey = {
  "username": { S: username } // Adjust primary key attribute
};

const valueToRemove = listingId;


  
 
    // Get the current item
    const getItemCommand = new GetItemCommand({
      TableName: tableName,
      Key: primaryKey
    });
    const item = await db.send(getItemCommand);
    
    if (!item.Item || !item.Item.listings || !item.Item.listings.L) {
      throw new Error('Item or listings attribute not found');
    }

    // Convert the DynamoDB array to a JavaScript array
    const listingsArray = item.Item.listings.L.map(entry => entry.S);

    // Filter out the value to remove
    const updatedListingsArray = listingsArray.filter(entry => entry !== valueToRemove);

    // Convert back to the format DynamoDB expects
    const updatedListingsDynamoDB = updatedListingsArray.map(entry => ({ S: entry }));

    // Update the item with the new listings array
    const params = {
      TableName: tableName,
      Key: primaryKey,
      UpdateExpression: "SET listings = :updatedListings",
      ExpressionAttributeValues: {
        ":updatedListings": { L: updatedListingsDynamoDB }
      }
    };

    const command = new UpdateItemCommand(params);
    await db.send(command);
    
  

  

}


const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function queryListings(category, filters) {
  const params = {
    TableName: "TindiraListings",
    FilterExpression: "#category = :category and #isActive = :isActive",
    ExpressionAttributeNames: {
      "#category": "category",
      "#isActive": "isActive",
      "#listingId": "listingId",
    },
    ExpressionAttributeValues: {
      ":category": category.toLowerCase(),
      ":isActive": true,
    },
  };

  // Add additional filter expressions based on filters provided
  for (const key in filters) {
    params.FilterExpression += ` and #${key} = :${key}`;
    params.ExpressionAttributeNames[`#${key}`] = key.toLowerCase();
    params.ExpressionAttributeValues[`:${key}`] = filters[key];
  }

  // Add a condition to filter by listingId if provided
  if (listingId) {
    params.FilterExpression += " and #listingId <> :listingId";
    params.ExpressionAttributeValues[":listingId"] = listingId;
  }

  try {
    const data = await dynamodb.scan(params).promise();
    return data.Items;
  } catch (error) {
    console.error("Error querying listings:", error);
    throw error;
  }
}

async function getUserHistory(username) {
  const params = {
    TableName: "TindiraUsers",
    Key: {
      username: username.toLowerCase(),
    },
  };

  try {
    const data = await dynamodb.get(params).promise();
    return data.Item.history || {};
  } catch (error) {
    console.error("Error fetching user history:", error);
    throw error;
  }
}

function filterListingsByUserHistory(listings, userHistory) {
  const likedListings = Object.values(userHistory).reduce(
    (acc, categoryHistory) => {
      return acc.concat(categoryHistory.liked);
    },
    []
  );

  return listings.filter(
    (listing) => !likedListings.includes(listing.listingId)
  );
}

function convertFiltersToLowercase(filters) {
  if (typeof filters === "object") {
    for (const key in filters) {
      if (typeof filters[key] === "string") {
        filters[key] = filters[key].toLowerCase();
      } else if (typeof filters[key] === "object") {
        filters[key] = convertFiltersToLowercase(filters[key]);
      }
    }
  }
  return filters;
}

module.exports = {
  queryListings,
  getUserHistory,
  filterListingsByUserHistory,
  convertFiltersToLowercase,
};

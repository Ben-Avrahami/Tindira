const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * Query listings from DynamoDB based on category and filters.
 */
async function queryListings(category, filters, listingIds) {
  const params = {
    TableName: "TindiraListings",
    FilterExpression: "#category = :category and #isActive = :isActive",
    ExpressionAttributeNames: {
      "#category": "category",
      "#isActive": "isActive",
    },
    ExpressionAttributeValues: {
      ":category": category.toLowerCase(),
      ":isActive": true,
    },
  };

  console.log("Initial Params:", params);

  // Add additional filter expressions based on filters provided
  if (filters.city) {
    params.FilterExpression += " and #city = :city";
    params.ExpressionAttributeNames["#city"] = "city";
    params.ExpressionAttributeValues[":city"] = filters.city;
  }
  if (filters.dates && filters.dates.length === 2) {
    params.FilterExpression += " and #date between :startDate and :endDate";
    params.ExpressionAttributeNames["#date"] = "date";
    params.ExpressionAttributeValues[":startDate"] = filters.dates[0];
    params.ExpressionAttributeValues[":endDate"] = filters.dates[1];
  }
  if (filters.maxPrice) {
    params.FilterExpression += " and #price <= :maxPrice";
    params.ExpressionAttributeNames["#price"] = "price";
    params.ExpressionAttributeValues[":maxPrice"] = filters.maxPrice;
  }
  if (filters.minNumberOfParkings !== undefined) {
    params.FilterExpression += " and #parking >= :minNumberOfParkings";
    params.ExpressionAttributeNames["#parking"] = "parking";
    params.ExpressionAttributeValues[":minNumberOfParkings"] = filters.minNumberOfParkings;
  }
  if (filters.minNumberOfRooms !== undefined) {
    params.FilterExpression += " and #numberOfRooms >= :minNumberOfRooms";
    params.ExpressionAttributeNames["#numberOfRooms"] = "numberOfRooms";
    params.ExpressionAttributeValues[":minNumberOfRooms"] = filters.minNumberOfRooms;
  }
  if (filters.isAnimalFriendly !== undefined) {
    params.FilterExpression += " and #isAnimalFriendly = :isAnimalFriendly";
    params.ExpressionAttributeNames["#isAnimalFriendly"] = "isAnimalFriendly";
    params.ExpressionAttributeValues[":isAnimalFriendly"] = filters.isAnimalFriendly;
  }
  if (filters.isWithGardenOrPorch !== undefined) {
    params.FilterExpression += " and #isWithGardenOrPorch = :isWithGardenOrPorch";
    params.ExpressionAttributeNames["#isWithGardenOrPorch"] = "isWithGardenOrPorch";
    params.ExpressionAttributeValues[":isWithGardenOrPorch"] = filters.isWithGardenOrPorch;
  }
  if (filters.location && filters.radiusInKm) {
    // Add geolocation filter logic if necessary
    // This is a placeholder as DynamoDB doesn't support geospatial queries natively
    console.log("Location filters are not directly supported by DynamoDB.");
  }

  // Add conditions to filter out multiple listingIds if provided and not '0'
  if (listingIds && listingIds.length > 0) {
    const placeholderKeys = listingIds.map((id, index) => `:listingId${index}`);
    const filterExpression = placeholderKeys.map(key => `#listingId <> ${key}`).join(" and ");

    params.FilterExpression += ` and ${filterExpression}`;
    listingIds.forEach((id, index) => {
      params.ExpressionAttributeNames[`#listingId`] = "listingId";
      params.ExpressionAttributeValues[`:listingId${index}`] = id;
    });
  }

  console.log("Final Params:", JSON.stringify(params, null, 2));

  try {
    const data = await dynamodb.scan(params).promise();
    console.log("DynamoDB Scan Data:", data);
    return data.Items;
  } catch (error) {
    console.error("Error querying listings:", error);
    throw error;
  }
}

/**
 * Fetch user history from DynamoDB based on username.
 */
async function getUserHistory(username) {
  const params = {
    TableName: "TindiraUsers",
    Key: {
      username: username.toLowerCase(),
    },
  };

  try {
    const data = await dynamodb.get(params).promise();
    console.log("User History Data:", data);
    return data.Item.history || {};
  } catch (error) {
    console.error("Error fetching user history:", error);
    throw error;
  }
}

/**
 * Filter listings based on user's history to remove already seen listings.
 */
function filterListingsByUserHistory(listings, userHistory) {
  const likedListings = Object.values(userHistory).reduce(
    (acc, categoryHistory) => {
      return acc.concat(categoryHistory.liked);
    },
    []
  );

  console.log("Liked Listings:", likedListings);

  return listings.filter(
    (listing) => !likedListings.includes(listing.listingId)
  );
}

/**
 * Convert filter keys and values to lowercase.
 */
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

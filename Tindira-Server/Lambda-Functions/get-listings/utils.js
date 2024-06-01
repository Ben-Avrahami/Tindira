const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * Query listings from DynamoDB based on filters.
 */
async function queryListings(filters, listingIds) {
  const params = {
    TableName: "TindiraListings",
    FilterExpression: "#isActive = :isActive",
    ExpressionAttributeNames: {
      "#isActive": "isActive",
    },
    ExpressionAttributeValues: {
      ":isActive": true,
    },
  };

  console.log("Initial Params:", params);

  // Add additional filter expressions based on filters provided
  if (filters.category) {
    params.FilterExpression += " and #category = :category";
    params.ExpressionAttributeNames["#category"] = "category";
    params.ExpressionAttributeValues[":category"] = filters.category.toLowerCase();
  }

  // Handle date filters based on the category
  if (filters.category === 'rent' && filters.dates && filters.dates.length > 0) {
    const startDate = new Date(filters.dates[0]).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    params.FilterExpression += " and #contractStartingDate >= :startDate";
    params.ExpressionAttributeNames["#contractStartingDate"] = "contractStartingDate";
    params.ExpressionAttributeValues[":startDate"] = startDate;
  }

  if (filters.category === 'sublet' && filters.dates && filters.dates.length === 2) {
    const startDate = new Date(filters.dates[0]).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    const endDate = new Date(filters.dates[1]).toISOString().split('T')[0];   // Format date as YYYY-MM-DD
    params.ExpressionAttributeNames["#contractStartingDate"] = "contractStartingDate";
    params.ExpressionAttributeNames["#contractEndDate"] = "contractEndDate";

    if (filters.isWholeDateRangeOnly) {
      params.FilterExpression += " and #contractStartingDate <= :startDate and #contractEndDate >= :endDate";
      params.ExpressionAttributeValues[":startDate"] = startDate;
      params.ExpressionAttributeValues[":endDate"] = endDate;
    } else {
      params.FilterExpression += " and #contractEndDate > :startDate and #contractStartingDate < :endDate";
      params.ExpressionAttributeValues[":startDate"] = startDate;
      params.ExpressionAttributeValues[":endDate"] = endDate;
    }
  }

  // Handle price filtering
  // i think PricePerWholeTime attribute doesnt exist in the database
  if (filters.maxPrice) {
    if (filters.isPricePerWholeTime && filters.category === 'sublet') {
      params.FilterExpression += " and #pricePerWholeTime <= :maxPrice";
      params.ExpressionAttributeNames["#pricePerWholeTime"] = "pricePerWholeTime";
      params.ExpressionAttributeValues[":maxPrice"] = filters.maxPrice;
    } else {
      params.FilterExpression += " and #price <= :maxPrice";
      params.ExpressionAttributeNames["#price"] = "price";
      params.ExpressionAttributeValues[":maxPrice"] = filters.maxPrice;
    }
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
  // false or none att all will give back all the listings
  if (filters.isAnimalFriendly) {
    params.FilterExpression += " and #isAnimalFriendly = :isAnimalFriendly";
    params.ExpressionAttributeNames["#isAnimalFriendly"] = "isAnimalFriendly";
    params.ExpressionAttributeValues[":isAnimalFriendly"] = filters.isAnimalFriendly;
  }
  // i think it doesnt exist in the database
  if (filters.isWithGardenOrPorch) {
    params.FilterExpression += " and #isWithGardenOrPorch = :isWithGardenOrPorch";
    params.ExpressionAttributeNames["#isWithGardenOrPorch"] = "isWithGardenOrPorch";
    params.ExpressionAttributeValues[":isWithGardenOrPorch"] = filters.isWithGardenOrPorch;
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

/**
 * Calculate the distance between two points (latitude, longitude) in kilometers using the Haversine formula.
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = Math.abs(lat2 - lat1) * Math.PI / 180;
  const dLng = Math.abs(lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  // console.log(`Given lat & lng: ${lat1} ${lng1}`);
  // console.log(`Listing lat & lng: ${lat2} ${lng2}`);
  // console.log(`Calculated distance: ${distance} km`);
  return distance;
}

module.exports = {
  queryListings,
  getUserHistory,
  filterListingsByUserHistory,
  convertFiltersToLowercase,
  calculateDistance,
};

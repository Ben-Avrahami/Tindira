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

  // Add additional filter expressions based on filters provided
  if (filters.category) {
    params.FilterExpression += " and #category = :category";
    params.ExpressionAttributeNames["#category"] = "category";
    params.ExpressionAttributeValues[":category"] = filters.category.toLowerCase();
  }

  // Handle date filters based on the category
  if (filters.category === 'rent' && filters.dates && filters.dates.length > 0) {
    const startDateObj = new Date(filters.dates[0]);
    startDateObj.setDate(startDateObj.getDate() + 1); // Add one day to the start date
    const startDate = startDateObj.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    params.FilterExpression += " and #contractStartDate >= :startDate";
    params.ExpressionAttributeNames["#contractStartDate"] = "contractStartDate";
    params.ExpressionAttributeValues[":startDate"] = startDate;
  }

  if (filters.category === 'sublet' && filters.dates && filters.dates.length === 2) {
    const startDateObj = new Date(filters.dates[0]);
    const endDateObj = new Date(filters.dates[1]);
    startDateObj.setDate(startDateObj.getDate() + 1); // Add one day to the start date
    endDateObj.setDate(endDateObj.getDate() + 1); // Add one day to the end date
    const startDate = startDateObj.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    const endDate = endDateObj.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    params.ExpressionAttributeNames["#contractStartDate"] = "contractStartDate";
    params.ExpressionAttributeNames["#contractEndDate"] = "contractEndDate";

    if (filters.isWholeDateRangeOnly) {
      params.FilterExpression += " and #contractStartDate <= :startDate and #contractEndDate >= :endDate";
      params.ExpressionAttributeValues[":startDate"] = startDate;
      params.ExpressionAttributeValues[":endDate"] = endDate;
    } else {
      params.FilterExpression += " and #contractEndDate > :startDate and #contractStartDate < :endDate";
      params.ExpressionAttributeValues[":startDate"] = startDate;
      params.ExpressionAttributeValues[":endDate"] = endDate;
    }
  }

  // Handle price filtering
  if (filters.maxPrice) {
    if (filters.isPricePerWholeTime && filters.category === 'sublet') {
      // This condition is kept to allow further processing after fetching listings
    } else {
      params.FilterExpression += " and #pricePerMonth <= :maxPrice";
      params.ExpressionAttributeNames["#pricePerMonth"] = "pricePerMonth";
      params.ExpressionAttributeValues[":maxPrice"] = filters.maxPrice;
    }
  }

  if (filters.minNumberOfParkings !== undefined) {
    params.FilterExpression += " and #parkingSpaces >= :minNumberOfParkings";
    params.ExpressionAttributeNames["#parkingSpaces"] = "parkingSpaces";
    params.ExpressionAttributeValues[":minNumberOfParkings"] = filters.minNumberOfParkings;
  }
  if (filters.minNumberOfRooms !== undefined) {
    params.FilterExpression += " and #numberOfRooms >= :minNumberOfRooms";
    params.ExpressionAttributeNames["#numberOfRooms"] = "numberOfRooms";
    params.ExpressionAttributeValues[":minNumberOfRooms"] = filters.minNumberOfRooms;
  }

  if (filters.isAnimalFriendly) {
    params.FilterExpression += " and #isAnimalFriendly = :isAnimalFriendly";
    params.ExpressionAttributeNames["#isAnimalFriendly"] = "isAnimalFriendly";
    params.ExpressionAttributeValues[":isAnimalFriendly"] = filters.isAnimalFriendly;
  }

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

  try {
    const data = await dynamodb.scan(params).promise();
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
  return distance;
}

module.exports = {
  queryListings,
  getUserHistory,
  filterListingsByUserHistory,
  convertFiltersToLowercase,
  calculateDistance,
};

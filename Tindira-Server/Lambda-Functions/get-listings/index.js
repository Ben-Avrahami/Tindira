const {
  queryListings,
  getUserHistory,
  filterListingsByUserHistory,
  convertFiltersToLowercase,
} = require("./utils");

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

exports.handler = async (event, context) => {
  try {
    const { username, amount, category, filters } = event.queryStringParameters;

    const lowerCaseUserName = username.toLowerCase();
    const lowerCaseCategory = category.toLowerCase();
    const lowerCaseFilters = convertFiltersToLowercase(filters);

    const userHistory = await getUserHistory(lowerCaseUserName);

    const listings = await queryListings(lowerCaseCategory, lowerCaseFilters);

    // Filter out listings that are in user's history
    const filteredListings = filterListingsByUserHistory(listings, userHistory);

    // Return specified amount of listings
    const nextListings = filteredListings.slice(0, amount);

    // Return response
    return {
      statusCode: 200,
      body: JSON.stringify(nextListings),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

// Function to filter out listings that are in user's history
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

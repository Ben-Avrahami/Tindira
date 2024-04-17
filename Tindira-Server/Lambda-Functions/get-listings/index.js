const {
  queryListings,
  getUserHistory,
  filterListingsByUserHistory,
  convertFiltersToLowercase,
} = require("./utils");

exports.handler = async (event, context) => {
  try {
    const { username, amount, category, filters } = event.queryStringParameters;

    const lowerCaseUserName = username.toLowerCase();
    const lowerCaseCategory = category.toLowerCase();
    let lowerCaseFilters = {};

    if (filters && Object.keys(filters).length > 0) {
      lowerCaseFilters = convertFiltersToLowercase(filters);
    }

    const userHistory = await getUserHistory(lowerCaseUserName);

    const listings = await queryListings(lowerCaseCategory, lowerCaseFilters);

    // Filter out listings that are in user's history
    const filteredListings = filterListingsByUserHistory(listings, userHistory);

    // Return specified amount of listings
    const nextListings = filteredListings.slice(0, amount);

    // Return response
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(nextListings),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

const {
  queryListings,
  getUserHistory,
  filterListingsByUserHistory,
  convertFiltersToLowercase,
} = require("./utils");

exports.handler = async (event, context) => {
  try {
    const { username, amount, category, listingId, filters } =
      event.queryStringParameters;

    const lowerCaseUserName = username.toLowerCase();
    const lowerCaseCategory = category.toLowerCase();
    let lowerCaseFilters = {}; //probably should be an object

    lowerCaseFilters = convertFiltersToLowercase(filters);

    // Get user's history based on the username.
    const userHistory = await getUserHistory(lowerCaseUserName);

    // fetches the listings from the database or listings source based on the provided category, filters, and listing ID.
    const listings = await queryListings(
      lowerCaseCategory,
      lowerCaseFilters,
      listingId
    );

    // Filter out listings that are in user's history
    let filteredListings = filterListingsByUserHistory(listings, userHistory);

    const nextListings = filteredListings.slice(0, amount);

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
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

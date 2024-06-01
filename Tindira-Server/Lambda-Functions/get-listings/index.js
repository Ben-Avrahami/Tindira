const {
  queryListings,
  getUserHistory,
  filterListingsByUserHistory,
  convertFiltersToLowercase,
  calculateDistance
} = require("./utils");

exports.handler = async (event, context) => {
  console.log("Lambda function invoked with event:", JSON.stringify(event, null, 2));
  try {
    const { username, amount, ignoreListings } = event.queryStringParameters;
    const body = JSON.parse(event.body);
    const filters = body.filters;

    console.log("Received Parameters:", { username, amount, ignoreListings, filters });

    let lowerCaseFilters = filters ? convertFiltersToLowercase(filters) : {};

    console.log("Converted Filters:", lowerCaseFilters);

    let listingIdsToIgnore = [];
    if (ignoreListings && ignoreListings !== '0') {
      listingIdsToIgnore = ignoreListings.split(',').map(id => id.trim().toLowerCase());
    }

    let userHistory = [];
    if (username && username !== '0') {
      const lowerCaseUserName = username.toLowerCase();
      // Get user's history based on the username.
      userHistory = await getUserHistory(lowerCaseUserName);
      console.log("User History:", userHistory);
    }

    // Fetches the listings from the database or listings source based on the provided filters and ignoreListings.
    let listings = await queryListings(lowerCaseFilters, listingIdsToIgnore);
    console.log("Queried Listings:", listings);

    // Filter listings by radius if location and radiusInKm are provided
    if (filters.location && filters.radiusInKm) {
      const { lat, lng } = filters.location.geometry.location;
      listings = listings.filter(listing => {
        const { lat: listingLat, lng: listingLng } = listing.coordinates.geometry.location;
        const distance = calculateDistance(lat, lng, listingLat, listingLng);
        console.log(`Calculated distance from ${listing.listingId}: ${distance.toFixed(2)} km`);
        return distance <= filters.radiusInKm;
      });
    }

    // Filter out listings that are in user's history if username is provided and not '0'
    let filteredListings = username !== '0' ? filterListingsByUserHistory(listings, userHistory) : listings;
    console.log("Filtered Listings:", filteredListings);

    const nextListings = filteredListings.slice(0, parseInt(amount, 10));
    console.log("Next Listings:", nextListings);

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

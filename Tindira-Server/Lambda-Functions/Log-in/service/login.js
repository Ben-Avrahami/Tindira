const AWS = require("aws-sdk");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const auth = require("../utils/auth");

AWS.config.update({
  region: "us-east-2",
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const userTable = "TindiraUsers";
const getUserByUserNameEndpoint =
  "https://aa94or46cc.execute-api.us-east-2.amazonaws.com/prod/user";

// Define the API key directly
const X_API_KEY = "ncVT79MBOfag9tx2Cr2RT7BmhydcTjyUaDgwhfQ6";

async function login(user) {
  const username = user.username;
  const password = user.password;

  if (!user || !username || !password) {
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "username and password are required" }),
    };
  }

  const dynamoUser = await getUser(username.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.username) {
    return {
      statusCode: 403,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "user doesn't exist" }),
    };
  }

  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return {
      statusCode: 403,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Password is incorrect" }),
    };
  }

  // Call the external Lambda function after successful login
  try {
    const externalUser = await getUserFromExternalService(username);
    const token = auth.generateToken(externalUser);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: externalUser,
        token: token,
      }),
    };
  } catch (error) {
    console.error("Error calling external service: ", error.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "An error occurred while fetching user details",
      }),
    };
  }
}

async function getUser(username) {
  const params = {
    TableName: userTable,
    Key: {
      username: username,
    },
  };
  return await dynamoDB
    .get(params)
    .promise()
    .then(
      (response) => response.Item,
      (error) => {
        console.error("There is an error getting user: ", error);
      }
    );
}

async function getUserFromExternalService(username) {
  // Define the additional query parameters
  const fields = "username,history";
  const url = `${getUserByUserNameEndpoint}?username=${username}&fields=${fields}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json",
      },
    });
    console.log("External service response: ", response.data); // Detailed logging

    // Check if response data is an array and not empty
    if (Array.isArray(response.data) && response.data.length > 0) {
      // Find the user object with the matching username
      const user = response.data.find((user) => user.username === username);

      // Check if user exists
      if (user) {
        // Extract user's history
        const { history } = user;

        // Optionally, you can process the user's history here
        // For example, you can return the entire history object or extract specific data

        return history;
      } else {
        throw new Error("User not found in external service response");
      }
    } else {
      throw new Error("Invalid or empty response from external service");
    }
  } catch (error) {
    console.error("Error fetching user details: ", error.message);
    throw error;
  }
}

module.exports.login = login;

const AWS = require("aws-sdk");
const axios = require("axios");
AWS.config.update({
  region: "us-east-2",
});

const util = require("../utils/util");
const bcrypt = require("bcryptjs");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const userTable = "TindiraUsers";
const auth = require("../utils/auth");

const getUserByUserNameEndpoint =
  "https://aa94or46cc.execute-api.us-east-2.amazonaws.com/prod/user";

async function login(user) {
  const username = user.username;
  const password = user.password;
  if (!user || !username || !password) {
    return util.buildResponse(401, {
      message: "username and password are required",
    });
  }
  const dynamoUser = await getUser(username.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(403, {
      message: "user doesn't exist",
    });
  }
  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return util.buildResponse(403, {
      message: "Password is incorrect",
    });
  }

  // Call the external Lambda function after successful login
  try {
    const externalUser = await getUserFromExternalService(username);
    const userInfo = {
      username: externalUser.username,
      fullName: externalUser.fullName,
      profilePicture: externalUser.profilePicture,
      profileDescription: externalUser.profileDescription,
    };
    const token = auth.generateToken(userInfo);
    const response = {
      user: userInfo,
      token: token,
    };
    return util.buildResponse(200, response);
  } catch (error) {
    console.error("Error calling external service: ", error);
    return util.buildResponse(500, {
      message: "An error occurred while fetching user details",
    });
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
  const url = `${getUserByUserNameEndpoint}?username=${username}`;
  const response = await axios.get(url);
  return response.data;
}

module.exports.login = login;

const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-2",
});

const util = require("../utils/util");
const bcrypt = require("bcryptjs");

const { error } = require("console");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = "TindiraUsers";

async function register(userInfo) {
  const username = userInfo.username;
  const email = userInfo.email;
  const firstName = userInfo.firstName;
  const lastName = userInfo.lastName;
  const password = userInfo.password;
  const phoneNumber = userInfo.phoneNumber;
  const roles = userInfo.roles;

  if (
    !username ||
    !email ||
    !firstName ||
    !lastName ||
    !password ||
    !phoneNumber ||
    !roles
  ) {
    return util.buildResponse(401, {
      message: "All fields are required",
    });
  }
  const dynamoUser = await getUser(username.toLowerCase().trim());
  if (dynamoUser && dynamoUser.username) {
    return util.buildResponse(401, {
      message:
        "Username already exists in our database. Please choose a different username ",
    });
  }
  const encryptedPassword = bcrypt.hashSync(password.trim(), 10);
  const user = {
    username: username.toLowerCase().trim(),
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: encryptedPassword,
    phoneNumber: phoneNumber,
    roles: roles,
    profilePicture: "",
    profileDescription: "",
    history: {
      rent: {
        liked: [],
        unliked: [],
      },
      sublet: {
        liked: [],
        unliked: [],
      },
    },
    reviews: [],
    listings: [],
  };

  const saveUserResponse = await saveUser(user);
  if (!saveUserResponse) {
    return util.buildResponse(503, {
      message: "Server Error. Please try again later.",
    });
  }
  return util.buildResponse(200, { username: username });
}

async function getUser(username) {
  const params = {
    TableName: userTable,
    Key: {
      username: username,
    },
  };
  return await dynamodb
    .get(params)
    .promise()
    .then(
      (response) => {
        return response.Item;
      },
      (error) => {
        console.error("There is an error getting user: ", error);
      }
    );
}

async function saveUser(user) {
  const params = {
    TableName: userTable,
    Item: user,
  };
  return await dynamodb
    .put(params)
    .promise()
    .then(
      () => {
        return true;
      },
      (error) => {
        console.error("There is an error saving user", error);
      }
    );
}

module.exports.register = register;

const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-2",
});

const util = require("../utils/util");
const bcrypt = require("bcryptjs");

const { error } = require("console");
const dynamoDB = new AWS.dynamoDB.DocumentationClient();
const userTable = "jin-users";

async function register(userInfo) {
  const name = userInfo.name;
  const email = userInfo.email;
  const username = userInfo.username;
  const password = userInfo.passwordme;

  if (!name || !email || !username || !password) {
    return util.buildResponse(401, {
      message: "All fields are required",
    });
  }
  const dynamoUser = await getUser(username.toLowerCase().trim());
  if (dynamoUser && dynamoUser.username) {
    return util.buildResponse(401, {
      message:
        "Username already exusts in our database. Please choose a different username ",
    });
  }
  const encryptesPassword = bcrypt.hashSync(password.trim(), 10);
  const user = {
    name: name,
    email: email,
    username: username.toLowerCase().trim(),
    password: encryptesPassword,
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
    key: {
      username: username,
    },
  };
  return await dynamoDB
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
  return await dynamoDB.put(params).promise.then(
    () => {
      return true;
    },
    (error) => {
      console.error("There is an error saving user", error);
    }
  );
}

module.exports.register = register;

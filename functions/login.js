var jwt = require("jsonwebtoken");
var fetch = require("node-fetch");
const STATIC_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6ImYzZTU4ZjQ2LWY4ZWYtNDdiMC04MzIxLTAwZTY4ZmY3NGYyMCIsImlhdCI6MTYwNTgyMDg2MiwiZXhwIjoxNjA1ODI0NzUwLCJYLUhBU1VSQS1ST0xFIjoidXNlciIsIlgtSEFTVVJBLVVTRVJfSUQiOiJuYXRhbmRkcmV3In0.JRFVfInXLw76rKtbz5NrgDSXSzhW5UmYdELdot_1qWw";

exports.handler = async function (event, context) {
  let body = JSON.parse(event.body);
  let graphQLRequest = getLoginGraphQL(body);
  let loginResult = await fetch(process.env.GRAPHQL_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ query: graphQLRequest }),
  }).then((resp) => resp.json());
  console.log("data", loginResult);
  let user = parseUser(loginResult);
  if (user) {
    let claims = {
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": [user.role],
        "x-hasura-default-role": user.role,
        "x-hasura-user-id": user.username,
      },
    };
    console.log("claims", claims);
    var token = jwt.sign(claims, process.env.JWT_SECRET, {
      noTimestamp: true,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        ...user,
        token,
      }),
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Nope... wrong username/password." }),
    };
  }
};

const getLoginGraphQL = ({ username, password }) => {
  return `{
        user:login(args: {userid: "${username.toLowerCase()}", pwd: "${password}"}) {
          email
          imageUrl
          name
          role
          username
        }
      }
    `;
};

const parseUser = (loginResult) => {
  try {
    return loginResult.data.user[0];
  } catch (err) {
    return null;
  }
};

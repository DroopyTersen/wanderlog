const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config();
const getIntrospectionQuery = require("graphql").getIntrospectionQuery;
const introspection = require("@urql/introspection");
const { getIntrospectedSchema, minifyIntrospectionQuery } = introspection;

fetch("https://hasura.wanderlog.app/v1/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": process.env.ADMIN_SECRET,
  },
  body: JSON.stringify({
    variables: {},
    query: getIntrospectionQuery({ descriptions: false }),
  }),
})
  .then((result) => result.json())
  .then(({ data }) => {
    const minified = minifyIntrospectionQuery(getIntrospectedSchema(data));
    fs.writeFileSync("src/global/gql.schema.json", JSON.stringify(minified));
  });

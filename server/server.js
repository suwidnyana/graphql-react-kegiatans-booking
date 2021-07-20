const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const graphqlHttp = require("express-graphql");
const isAuth = require("./middleware/is-auth");

// const { ApolloServer } = require("apollo-server");
const { ApolloServer, gql } = require('apollo-server-express');

//grapqhl
const typeDefs = require("./graphql/schema/index");
const resolvers = require("./graphql/resolvers/index");

//connect Database
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db");

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   playground: true,
// });

// server.applyMiddleware(isAuth);

// ----------------------------------
// API Routes
// ----------------------------------
// app.use('/graphql',
//            graphqlHttp({
//             schema: graphQlSchema,
//             rootValue: graphQlResolver,
//             graphiql: true
// }));

// ----------------------------------
// Express server
// ----------------------------------

async function startApolloServer() {
  connectDB();

  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    context: ({ req, res }) => ({ req, res })
  });

  await server.start();

  server.applyMiddleware({ app });

  // ----------------------------------
  // Express configuration
  // ----------------------------------
  // app.use(bodyParser.json());
  // app.use(cors());
  // app.use((req, res, next) => {
  //   res.setHeader("Access-Control-Allow-Origin", "*");
  //   res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  //   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  //   if (req.method === "OPTIONS") {
  //     return res.sendStatus(200);
  //   }
  //   next();
  // });

  // app.use(isAuth);

  const port = process.env.PORT || 4000;

  await new Promise(resolve => app.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);

  return { server, app };
}

startApolloServer();
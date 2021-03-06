const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const graphqlHttp = require("express-graphql");
const app = express();
const isAuth = require("./middleware/is-auth");

const { ApolloServer } = require("apollo-server");

//grapqhl
const typeDefs = require("./graphql/schema/index");
const resolvers = require("./graphql/resolvers/index");

//connect Database
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db");
connectDB();

// ----------------------------------
// Express configuration
// ----------------------------------
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
});

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
const port = process.env.PORT || 4000;

server.listen(port, () => console.log(`Server started on port ${port}`));

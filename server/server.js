const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const graphqlHttp = require('express-graphql')
const app = express()
const isAuth = require('./middleware/is-auth')
const graphQlSchema = require('./graphql/schema/index')
const graphQlResolver = require('./graphql/resolvers/index')

require('dotenv').config();




// ----------------------------------
// Express configuration
// ----------------------------------
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
app.use(isAuth);

// ----------------------------------
// API Routes
// ----------------------------------
app.use('/graphql', 
           graphqlHttp({
            schema: graphQlSchema,
            rootValue: graphQlResolver, 
            graphiql: true
}));



//connect Database
const connectDB = require('./config/db');
connectDB();

// ----------------------------------
// Express server
// ----------------------------------
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Server started on port ${port}`));


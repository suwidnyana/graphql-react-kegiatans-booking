const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const graphqlHttp = require('express-graphql')
const mongoose = require("mongoose") 
const app = express()
const isAuth = require('./middleware/is-auth')

require('dotenv').config();
const port = process.env.PORT || 8000


const graphQlSchema = require('./graphql/schema/index')
const graphQlResolver = require('./graphql/resolvers/index')


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

app.use('/graphql', 
           graphqlHttp({
            schema: graphQlSchema,
            rootValue: graphQlResolver, 
            graphiql: true
}));



const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true
});

const connection = mongoose.connection;



app.listen(port, () => {
    console.log(`Server berjalan di port: ${port}`);
    connection.once('open',  () => {
        console.log(`MongoDB database koneksi berhasil berjalan di port: ${port}`);
    })
})
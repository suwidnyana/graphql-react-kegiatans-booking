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



// app.listen(3000)

// app.listen(port, () => {
//     console.log(`Server berjalan pada port ${port}`);
// })



// app.get('/', (request, response, next) => {
//     response.send('Hallo Dunia Apel');
// })



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


// mongoose
//     .connect(
//     `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphql-react-event-booking-exuzg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,{ useNewUrlParser: true, useUnifiedTopology: true  }
// )



// .then(() => {
//     app.listen(port, () => {
//         console.log(`Server berjalan pada port ${port}`);
//     })
    
// }).catch(err => {
//     console.log(err);
// })



const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true
});

const connection = mongoose.connection;

// connection.once('open',  () => {
//     console.log("MongoDB database koneksi berhasil");
//     console.log(`Server berjalan di port: ${port}`);
   
// })

app.listen(port, () => {
    console.log(`Server berjalan di port: ${port}`);
    connection.once('open',  () => {
        console.log(`MongoDB database koneksi berhasil berjalan di port: ${port}`);
    })
})
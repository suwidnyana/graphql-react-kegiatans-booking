const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const graphqlHttp = require('express-graphql')

const { buildSchema } = require('graphql')

const mongoose = require("mongoose")
 
const app = express()
const Event = require("./models/event")



const kegiatans = [];

require('dotenv').config();
const port = process.env.PORT || 5000

app.use(bodyParser.json());

app.use(cors());

// app.listen(3000)

// app.listen(port, () => {
//     console.log(`Server berjalan pada port ${port}`);
// })



// app.get('/', (request, response, next) => {
//     response.send('Hallo Dunia Apel');
// })

app.use('/graphql', 
           graphqlHttp({
            schema: buildSchema(`
                
            type kegiatan {
                _id: ID!
                 judul : String!
                 deskripsi : String!
                 harga : Float!
                 date: String!

            }

            input EventInput {
                 judul : String!
                 deskripsi : String!
                 harga : Float!
                 date: String!
            }

            type RootQuery {
                    kegiatans: [kegiatan!]!
                }

            type RootMutation {
                buatEvent(eventInput: EventInput): kegiatan
                }
        
        schema {
            query: RootQuery
            mutation : RootMutation
        }
    `),

    rootValue: { //proses graphql
        kegiatans : () => {      
            
            //resolver 


            // return ['Makan malam', 'Makan Nasi', 'Minum'];
            // return kegiatans;
            return Event.find()
            .then(kegiatans => {
                return kegiatans.map(kegiatan => {
                    return {...kegiatan._doc};
                })
            })
            .catch(err => {
                console.log(err)
            })
        },

        buatEvent: args => {  //mutation proses
        //  const eventName = args.name;
        //  return eventName;
        // const event = {
        //     _id: Math.random().toString(),
        //     judul : args.eventInput.judul,
        //     deskripsi : args.eventInput.deskripsi,
        //     harga : +args.eventInput.harga,
        //     date : args.eventInput.date
        // };

        const event = new Event({
            
            judul : args.eventInput.judul,
            deskripsi : args.eventInput.deskripsi,
             harga : +args.eventInput.harga,
             date : new Date(args.eventInput.date)

        })

        // kegiatans.push(event);
        return event
        .save()
        .then(result => {
            console.log(result)
            return {...result._doc};
        })
        .catch(err => {
            console.log(err)
            throw err;
        })
       
     }                   
    },
    graphiql: true
}));


mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphql-react-event-booking-exuzg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
)
.then(() => {
    app.listen(port, () => {
        console.log(`Server berjalan pada port ${port}`);
    })
    
}).catch(err => {
    console.log(err);
})
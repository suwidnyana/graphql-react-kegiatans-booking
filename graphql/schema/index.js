const { buildSchema } = require('graphql')

module.exports = buildSchema(`
                

type Booking {
    _id: ID!
    event : kegiatan!
    user: User!
    createdAt : String!
    updatedAt : String!
}

type kegiatan {
    _id: ID!
     judul : String!
     deskripsi : String!
     harga : Float!
     date: String!
     creator : User!

}

type User {
    _id: ID!
    email: String!
    password: String
    createdEvents : [kegiatan!]
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

input EventInput {
     judul : String!
     deskripsi : String!
     harga : Float!
     date: String!
}

input UserInput {
    email: String!
    password: String!
}



type RootQuery {
        kegiatans: [kegiatan!]!
        bookings: [Booking!]!
        login(email: String!, password: String!):  AuthData!
    }

type RootMutation {
    buatEvent(eventInput: EventInput): kegiatan
    buatUser(userInput: UserInput): User
    
    bookKegiatan(eventId: ID!): Booking!
    
    cancelBooking(bookingId: ID!): kegiatan!

   

    }

schema {
query: RootQuery
mutation : RootMutation
}
`);
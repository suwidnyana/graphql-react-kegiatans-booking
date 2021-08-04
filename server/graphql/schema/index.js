const { gql } = require("apollo-server");

const typeDefs = gql`
  type Kegiatan {
    _id: ID!
    judul: String!
    deskripsi: String!
    harga: Float!
    date: String!
    creator: User!
  }

  type Booking {
    _id: ID!
    event: Kegiatan!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Kegiatan]!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  type AuthUser {
    userId: ID!
    email: String!
    authenticated: Boolean!
  }

  input EventInput {
    judul: String!
    deskripsi: String!
    harga: Float!
    date: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type Query {
    kegiatans: [Kegiatan]
    bookings: [Booking]

    auth(token: String!): AuthUser
  }

  type Mutation {
    login(email: String!, password: String!): AuthData!
    buatUser(userInput: UserInput): User!

    buatEvent(eventInput: EventInput): Kegiatan!

    bookKegiatan(eventId: ID!): Booking!

    cancelBooking(bookingId: ID!): Kegiatan!
  }
`;

module.exports = typeDefs;

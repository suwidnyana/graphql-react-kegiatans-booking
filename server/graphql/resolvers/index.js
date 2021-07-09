const eventResolver = require("./events");
const bookingResolver = require("./booking");
const authResolver = require("./auth");

module.exports = {
  Query: {
    ...eventResolver.Query,
    ...bookingResolver.Query,
  },
  Mutation: {
    ...authResolver.Mutation,
    ...eventResolver.Mutation,
    ...bookingResolver.Mutation,
  },
};

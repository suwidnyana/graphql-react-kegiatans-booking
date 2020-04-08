const eventResolver = require('./events');
const bookingResolver = require('./booking');
const authResolver = require('./auth');

const rootResolver = {
    ...authResolver,
    ...bookingResolver,
    ...eventResolver
};

module.exports = rootResolver;
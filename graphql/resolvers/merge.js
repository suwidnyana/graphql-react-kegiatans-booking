const Event = require("../../models/event")
const { dateToString } = require('../../helpers/date')
const User = require("../../models/user")


const transformEvent =  event => {
    return {
         ...event._doc,
         _id: event.id,
         date: dateToString(event._doc.date),
         creator: user.bind(this, event.creator)
    };
}


const transformBooking = booking => {
    return {

            ...booking._doc,
            _id: booking.id,
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
            createdAt: dateToString(booking._doc.createdAt),
            updatedAt: dateToString(booking._doc.updatedAt)
    }
}


const events =  async kegiatanId => {
    
    try {
     const events =  await Event.find({ _id:{$in : kegiatanId} });
      events.map(event => {
            // return { 
            //     ...event._doc, 
            //      date : new Date(event._doc.date).toISOString(),
            //     creator: user.bind(this, event.creator)
            // };

            return transformEvent (event);
        });
    return events;
    } catch(err) {
        throw err;
    }
  }

const singleEvent =  async eventId => {
    try {
        const event = await Event.findById(eventId)
        // return {
        //     ...event._doc,
        //     creator: user.bind(this, event.creator)
        // }
        return transformEvent(event);
    } catch (err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return { 
            ...user._doc,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch(err) {
        throw err
    }
}


exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
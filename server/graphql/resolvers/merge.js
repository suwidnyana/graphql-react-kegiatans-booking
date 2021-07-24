const Event = require("../../models/event")
const { dateToString } = require('../../helpers/date')
const User = require("../../models/user")
const DataLoader = require('dataloader');


const eventLoader = new DataLoader((kegiatanIds) => {
    return events(kegiatanIds);
});

const userLoader = new DataLoader(userIds => {
    return User.find({ _id: { $in: userIds } });
});


const events = async kegiatanIds => {
    try {
        const events = await Event.find({ _id: { $in: kegiatanIds } });

        events.sort((a, b) => {
            return (
                kegiatanIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
            );
        });
        console.log(events)

        return events.map(event => {
            return transformEvent(event);
        });

    } catch (err) {
        throw err;
    }
}

const singleEvent = async kegiatanId => {
    try {
        // const event = await Event.findById(kegiatanId)
        // return transformEvent(event);
        const event = await eventLoader.load(kegiatanId.toString());
        return event;
    } catch (err) {
        throw err;
    }
}

const user = async userId => {
    try {
        // const user = await User.findById(userId)
        const user = await userLoader.load(userId);
        return {
            ...user._doc,
            _id: user.id,
            // createdEvents: events.bind(this, user._doc.createdEvents)
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
        };
    } catch (err) {
        throw err
    }
}

const transformEvent = event => {
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
        user: user.bind(this, booking.user),
        event: singleEvent.bind(this, booking.event._id),
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt)
    }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
const bcrypt = require("bcrypt")
const Booking = require("../../models/booking")
const { dateToString } = require('../../helpers/date')
const { transformBooking, transformEvent} = require('../resolvers/merge')
const Event = require("../../models/event")




module.exports = {

bookings: async (args, req) => { //query
    if(!req.isAuth) {
        throw new Error('Unauthenticated!')
    }
    try {
        const bookings  = await Booking.find();
        return bookings.map(booking => {
         return transformBooking(booking);
        });
    } catch(err) {
        throw err;
    }
},

  

bookKegiatan: async (args,req) => { //mutations proses
    if(!req.isAuth) {
        throw new Error('Unauthenticated!')
    }
   
    const fetchedEvent = await Event.findOne({ _id: args.eventId  });
    
    // const user_sudah_ada = await User.findOne({
    //     _id: args.eventId,
    // })

    const booking = new Booking({
        user: "5e823efabc06c476823e0244",
        event: fetchedEvent
    });


    console.log(booking)
    const hasil = await booking.save();
    return transformBooking(hasil);
   
},

cancelBooking: async (args,req) => {
    if(!req.isAuth) {
        throw new Error('Unauthenticated!')
    }
    try {
        const booking =  await Booking.findById(args.bookingId).populate('event');
        // const event = {
        //     ...booking.event._doc,
        //     _id: booking.event.id,
        //     creator: user.bind(this, booking.event._doc.creator)
        // };
        const event = transformEvent(booking.event);
        await Booking.deleteOne({ _id : args.bookingId });
        return event;
    } catch (err) {
        throw err
    }
}
};
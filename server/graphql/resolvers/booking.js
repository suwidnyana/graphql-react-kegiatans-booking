const bcrypt = require("bcrypt");
const Booking = require("../../models/booking");
const { dateToString } = require("../../helpers/date");
const { transformBooking, transformEvent } = require("../resolvers/merge");
const Event = require("../../models/event");
const checkAuth = require("../../middleware/is-auth");

module.exports = {
  Query: {
    async bookings(parent, args, context) {
      const auth = checkAuth(context);
      // if(!req.isAuth) {
      //     throw new Error('Unauthenticated!')
      // }
      try {
        const bookings = await Booking.find({ user: auth.userId })
          .populate('user')
          .populate('event');

        return bookings.map((booking) => {
          return transformBooking(booking);
        });
      } catch (err) {
        throw err;
      }
    },
  },

  // bookings: async (args, req) => { //query
  //     if(!req.isAuth) {
  //         throw new Error('Unauthenticated!')
  //     }
  //     try {
  //         const bookings  = await Booking.find({user: req.userId});
  //         return bookings.map(booking => {
  //          return transformBooking(booking);
  //         });
  //     } catch(err) {
  //         throw err;
  //     }
  // },
  Mutation: {
    async bookKegiatan(_, args, context) {
      const auth = checkAuth(context);
      const fetchedEvent = await Event.findOne({ _id: args.eventId });

      if (!fetchedEvent) {
        throw new Error('Event cannot be found');
      }

      const booking = new Booking({
        user: auth.userId,
        event: args.eventId,
      });

      const hasil = await booking.save();
      return transformBooking(hasil);
    },
    async cancelBooking() {
      if (!req.isAuth) {
        throw new Error("Unauthenticated!");
      }
      try {
        const booking = await Booking.findById(args.bookingId).populate(
          "event"
        );
        const event = transformEvent(booking.event);
        await Booking.deleteOne({ _id: args.bookingId });
        return event;
      } catch (err) {
        throw err;
      }
    },
  },
  // bookKegiatan: async (args,req) => { //mutations proses
  //     if(!req.isAuth) {
  //         throw new Error('Unauthenticated!')
  //     }

  //     const fetchedEvent = await Event.findOne({ _id: args.eventId  });

  //     const booking = new Booking({
  //         user: req.userId,
  //         event: fetchedEvent
  //     });

  //     console.log(booking)
  //     const hasil = await booking.save();
  //     return transformBooking(hasil);

  // },

  // cancelBooking: async (args,req) => {
  //     if(!req.isAuth) {
  //         throw new Error('Unauthenticated!')
  //     }
  //     try {
  //         const booking =  await Booking.findById(args.bookingId).populate('event');
  //         const event = transformEvent(booking.event);
  //         await Booking.deleteOne({ _id : args.bookingId });
  //         return event;
  //     } catch (err) {
  //         throw err
  //     }
  // }
};

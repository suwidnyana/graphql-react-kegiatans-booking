const { dateToString } = require("../../helpers/date");
const bcrypt = require("bcrypt");

const Event = require("../../models/event");
const User = require("../../models/user");
const checkAuth = require("../../middleware/is-auth");
const { transformEvent } = require("./merge");

module.exports = {
  Query: {
    async kegiatans() {
      try {
        const kegiatans = await Event.find().populate('creator');
        return kegiatans.map((e) => {
          return transformEvent(e);
        });
      } catch (error) {
        throw error;
      }
    },
  },
  // kegiatans : async () => {   //query
  //     //resolver
  //     try {
  //         const kegiatans = await Event.find()
  //         return kegiatans.map(kegiatan => {
  //             return transformEvent(kegiatan);
  //         });
  //     } catch(err) {
  //         throw err;

  //     }
  // },

  Mutation: {
    async buatEvent(_, { eventInput: { judul, deskripsi, harga, date } }, context) {
      const auth = checkAuth(context);
      const creator = await User.findById(auth.userId);

      if (!creator) {
        throw new Error("User tidak ditemukan.");
      }

      const event = new Event({
        judul: judul,
        deskripsi: deskripsi,
        harga: +harga,
        date: new Date(date),
        creator: creator._id,
      });

      try {
        const result = await event.save();
        const createdEvent = transformEvent(result);

        creator.createdEvents.push(event);

        await creator.save();

        return createdEvent;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    // buatEvent: async (args, req) => {
    //   //mutation proses

    //   if (!req.isAuth) {
    //     throw new Error("Unauthenticated!");
    //   }
    //   const event = new Event({
    //     judul: args.eventInput.judul,
    //     deskripsi: args.eventInput.deskripsi,
    //     harga: +args.eventInput.harga,
    //     date: new Date(args.eventInput.date),
    //     creator: req.userId,
    //   });
    //   let createdEvent;
    //   try {
    //     const result = await event.save();
    //     createdEvent = transformEvent(result);
    //     const creator = await User.findById(req.userId);
    //     console.log(result);

    //     if (!creator) {
    //       throw new Error("User tidak ditemukan.");
    //     }
    //     creator.createdEvents.push(event);

    //     await creator.save();

    //     return createdEvent;
    //   } catch (err) {
    //     console.log(err);
    //     throw err;
    //   }
    // },
  },
};

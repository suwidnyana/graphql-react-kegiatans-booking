const { dateToString } = require('../../helpers/date')
const bcrypt = require("bcrypt")


const Event = require("../../models/event")
const User = require("../../models/user")
const { transformEvent } = require("./merge")


module.exports = {

    kegiatans : async () => {   //query  
        //resolver 
        try {
            const kegiatans = await Event.find()
            return kegiatans.map(kegiatan => {
                return transformEvent(kegiatan);
            });
        } catch(err) {
            throw err;
           
        }
    },
    
     
    buatEvent: async (args, req) => {  //mutation proses
        
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
    const event = new Event({
        
        judul : args.eventInput.judul,
        deskripsi : args.eventInput.deskripsi,
         harga : +args.eventInput.harga,
         date : new Date(args.eventInput.date),
         creator : req.userId
    });
    let createdEvent;
    try {
        const result = await  event.save()
        createdEvent = transformEvent(result);
        const creator = await User.findById(req.userId)
        console.log(result)
    
    
        if (!creator) {
            throw new Error('User tidak ditemukan.');
        }
        creator.createdEvents.push(event);
       
        await creator.save();
    
       return createdEvent;
    } 
    catch(err)  {
        console.log(err)
        throw err;
    }
    }
    
   
    };
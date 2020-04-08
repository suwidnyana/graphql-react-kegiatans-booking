const { dateToString } = require('../../helpers/date')
const bcrypt = require("bcrypt")
const Event = require("../../models/event")
const User = require("../../models/user")

const { transformEvent } = require("../resolvers/merge")


module.exports = {

    kegiatans : async () => {   //query  
                
        //resolver 
        const kegiatans = await Event.find()
        
        try {
            return kegiatans.map(kegiatan => {
                return transformEvent(kegiatan);
            });
        } catch(err) {
            throw err;
            console.log(err);
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
         creator : '5e7e978c6d40b64dd491212f'
    });
    let createdEvent;
    const result = await  event
    .save()
        try {

        createdEvent = transformEvent(result);
        const creator = await  User.findById('5e7e978c6d40b64dd491212f')
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
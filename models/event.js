const moongose = require('mongoose')

const Schema = moongose.Schema;


const eventSchema = new Schema({
    judul: {
        type: String,
        required: true
    },
    deskripsi: {
        type: String,
        required: true
    },
    harga: { 
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

module.exports =  moongose.model('Event', eventSchema);
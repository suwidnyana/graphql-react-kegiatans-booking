const moongose = require('mongoose')

const Schema = moongose.Schema;

const userSchema = new Schema({
    email : {
        type: String,
        required: true
    },

    password : {
        type: String,
        required: true
    },

    createdEvents : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
});

module.exports =  moongose.model('User', userSchema);
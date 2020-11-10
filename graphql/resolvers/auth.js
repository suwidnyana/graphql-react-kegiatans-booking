const bcrypt = require("bcrypt")
const Event = require("../../models/event")
const User = require("../../models/user")

const jwt = require('jsonwebtoken')


module.exports = {

buatUser: async args => {  //mutation proses
    try 
    
    {
        const user_sudah_ada = await User.findOne({
        email: args.userInput.email,
    })
   
        if (user_sudah_ada) {
            throw new Error('User sudah ada.');
        }
        const  password_dienkrip =  await bcrypt.hash(args.userInput.password, 12)
 
        const user = new User({
    
            email : args.userInput.email,
            password : password_dienkrip
            
        })
        const result = await user.save();
        console.log(result)

        return {...result._doc, 
            password: null,
            _id: result.id 
        };
    }
    catch(err) {
        console.log(err)
        throw err;
    }
   
},

login: async ({email, password}) => {
    const user = await User.findOne({email: email});
    if(!user) {
        throw new Error('User tidak ada! ');
    }

    const sama = await bcrypt.compare(password, user.password);
    if(!sama) {
        throw new Error('Password salah atau tidak sama!');
    } 

    const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {
        expiresIn: '1h'
        
    });
    
    return {
        
        userId: user.id,
        token: token,
        tokenExpiration: 1
    }
},


auth: async ({token}) => {
    
    // const user = await User.findOne({email: email});
    // if(!user) {
    //     throw new Error('User tidak ada! ');
    // }

    // const sama = await bcrypt.compare(password, user.password);
    // if(!sama) {
    //     throw new Error('Password salah atau tidak sama!');
    // } 

  

    try {
        var user = jwt.verify(token, 'somesupersecretkey');

        return {
            authenticated: true,
            userId: user.userId,
            email: user.email
        }
      } catch(err) {
        // err
        return {
            authenticated: false,
            email: null,
            userId: null
        }
      }
    
   
}

};
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlength:5,
        trim:true,
        unique: true,
        validate: {
            validator:validator.isEmail,
            message: '{VALUE} is not a valid email'
        }

    },
    password:{
        type:String,
        required: true,
        minlength: 6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type: String,
            required:true
        }

        
    }]
})

userSchema.methods.toJSON = function(){
    var user = this;
    console.log("USER in toJSON func = ",user);
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email'])
}

userSchema.methods.generateAuthToken = function(){
    console.log("generating token")
    var user = this;
    console.log("USER in user.js = ",user);

    var access = "auth";
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'secret-key').toString();

    // user.tokens.push({access, token});
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save()
        .then((user) => {
            console.log("saved token",user)
            return token;
        })
        .catch(() => {
            console.log("error OCCURED..");
        })
}

var User = mongoose.model('User', userSchema);

module.exports = {
    User
}
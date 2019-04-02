const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
    console.log("\n\nUSER in toJSON func = ",user);
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email'])
}

userSchema.methods.generateAuthToken = function(){
    // console.log("\n\ngenerating token")
    var user = this;
    // console.log("USER in user.js = ",user);

    var access = "auth";
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'secret-key').toString();

    // user.tokens.push({access, token});
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save()
        .then((user) => {
            // console.log("saved token",user)
            return token;
        })
        .catch(() => {
            // console.log("error OCCURED..");
        })



}

userSchema.statics.findByToken = function(token){
    var User = this;
    // console.log("");
    try{
        var decoded = jwt.verify(token, 'secret-key');
        // console.log("inside findByToken DECODED = ",decoded);
    }catch (e) {
        return new Promise((resolve, reject) => {
            reject();
        })
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': decoded.access
    });
}

userSchema.statics.findByCredentials = function(body) {
    var User = this;

    return User.findOne({email: body.email})
        .then((user) => {
            if(!user){
                // console.log("User not found");
                return Promise.reject();
            }
            console.log("USER found: ",user);
            return new Promise( (resolve, reject) => {
                bcrypt.compare(body.password, user.password)
                    .then((result) => {
                        // console.log("result of bcrypt.compare: ", result)
                        if(result){
                            resolve(user);
                        }else{
                            reject();
                        }
                    })
            })
        })
}

userSchema.pre('save', function(next){
    var user = this;
    // console.log("\n\n");
    // console.log("before saving document: ",user);
    if(user.isModified('password')){
        bcrypt.genSalt(5, (err, salt) => {
            // console.log("salt is generated: ",salt);
            bcrypt.hash(user.password, salt, (e, hash) => {
                if(!e){
                    // console.log("successfully hashed password");
                    user.password = hash;
                    next();
                }
            })
        })
    }else{
        next();
    }
})

var User = mongoose.model('User', userSchema);

module.exports = {
    User
}
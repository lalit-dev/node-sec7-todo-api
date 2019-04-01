const {SHA256, AES, enc} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// const secret = "shh it is secret"; 
// var hash = (SHA256("message").toString() + secret);
// var hash2 = AES.encrypt('message', secret).toString();
// var bytes  = AES.decrypt(hash2.toString(), secret);
// var plaintext = bytes.toString(enc.Utf8);
// console.log(hash);
// console.log("encrypt HASH2 = ",hash2);
// console.log("decrypt HASH2 = ",plaintext);




// var data = {
//     id:'12er234er'
// }

// var secretKey = "privateKey";

// var encoded = jwt.sign(data, secretKey);
// console.log("encoded data = ",encoded);

// var decoded = jwt.verify(encoded, secretKey);
// console.log("decoded data = ",decoded);





var pass = '12345';
var hashedPass;
bcrypt.genSalt(16, (err, salt) => {
    if(!err){
        bcrypt.hash(pass, salt, (e, hash) => {
            console.log("no. of rounds: ",bcrypt.getRounds(hash));
            if(!e){
                console.log("hashedpass = ",hash);
            }else {
                console.log("ERROR = ",e);
            }
        })

    }
    else{
        console.log("err: ",err);
    }
})

hashedPass = '$2a$10$OewHDOPvnVtaOjfId9.LH.jiNW3zQwBFEwOQdLIc46yQW/5gnXDz.';

var compareHash = function(pass,hashedPass){
    return new Promise((res,rej) => {
        res(bcrypt.compare(pass, hashedPass));
    }) 
}

compareHash(pass, hashedPass)
.then((res) => {
    console.log(res);
})

bcrypt.compare("12345", hashedPass)
    .then((res) => {
        console.log("@@@@@@@@",res);
        console.log("#########",hashedPass)

    })




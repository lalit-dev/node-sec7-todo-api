const {SHA256, AES, enc} = require('crypto-js');
const jwt = require('jsonwebtoken');
const secret = "shh it is secret"; 
// var hash = (SHA256("message").toString() + secret);
// var hash2 = AES.encrypt('message', secret).toString();
// var bytes  = AES.decrypt(hash2.toString(), secret);
// var plaintext = bytes.toString(enc.Utf8);
// console.log(hash);
// console.log("encrypt HASH2 = ",hash2);
// console.log("decrypt HASH2 = ",plaintext);

var data = {
    id:'12er234er'
}

var secretKey = "privateKey";

var encoded = jwt.sign(data, secretKey);
console.log("encoded data = ",encoded);

var decoded = jwt.verify(encoded, secretKey);
console.log("decoded data = ",decoded);


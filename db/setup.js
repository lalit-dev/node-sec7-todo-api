const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// console.log("GLOBAL - ",global)

mongoose.connect(process.env.MONGODB_URI , { useNewUrlParser: true });

module.exports = {
    mongoose
}
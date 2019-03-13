const {mongoose} = require('./../db/setup');

var {Todo} = require('./../models/todo');
var {User} = require('./../models/user');


var id = "5c88ed5262efe20e60e107581";

// User.find()
//     .then((docs) => {
//         console.log("DOCUMENTS = ",docs);
//     })

User.findById(id)
    .then((doc) => {
        if(!doc){
            return console.log("No document found");
        }
        console.log("DOC: ",doc);
    }, (err) => {
        console.log("Invalid ID");
    })
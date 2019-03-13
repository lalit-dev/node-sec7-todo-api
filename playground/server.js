const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// console.log("GLOBAL - ",global)

mongoose.connect("mongodb://localhost:27017/practiceDatabase");

// var Todo = mongoose.model('Todo', {
//     task:{
//         type:String,
//         required: true,
//         minlength: 3,
//         trim: true
//     },
//     completed:{
//         type: Boolean,
//         default: false
//     },
//     completedAt:{
//         type: Number,
//         default: null
//     },
//     assignedTo:{
//         type:String
//     }
    
// })

// var newTodo = new Todo({
//     task: 'aaa',
//     // completed:'no',
//     assignedTo:'Lalit yadav',
//     // completedAt: new Date()
// })

// newTodo.save()
    // .then((doc) => {
    //     console.log("Document = ",doc);
    // }, (err) => {
    //     console.log("Error: ",err);
    // })

var Users = mongoose.model('Users', {
    email:{
        type:String,
        required:true,
        minlength:5,
        trim:true
    },
    password:{
        type:String
    }
})

var newUser = new Users({
    // email:"   abc   des.com   ",
    password:1234
})

newUser.save()
.then((doc) => {
    console.log("Document of saved user = ",doc);
}, (err) => {
    console.log("Error in saving User", err);
})
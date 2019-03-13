const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    task:{
        type:String,
        required: true,
        minlength: 3,
        trim: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    completedAt:{
        type: Number,
        default: null
    },
    assignedTo:{
        type:String
    }
    
})

module.exports = {
    Todo
}
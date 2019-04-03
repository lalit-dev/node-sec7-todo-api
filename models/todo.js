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
    },
    _creator:{
        type: mongoose.Schema.Types.ObjectId,
        required: true    
    }
    
})

module.exports = {
    Todo
}
const express = require('express');
const bodyParser = require('body-parser');

var mongoose = require("../db/setup");
var {Todo} = require('../models/todo');
var {User} = require('../models/user');

// console.log("express = ",express)
var app = express();

// app.use(bodyParser.json());
app.use(express.json());


app.post('/todo', (req, res) => {
    console.log("Req.body = ",JSON.stringify(req.body, undefined, 2));
    var newtodo = new Todo({
        completed: req.body.completed,
        completedAt: req.body.completedAt,
        task: req.body.task
    })

    newtodo.save()
        .then((doc) => {
            // console.log("**Document: ",doc);
            res.send(doc);
        }, (err) => {
            // console.log("**Error: ",err);
            res.status(400).send(err);
        })
})

app.post('/user', (req, res) => {
    console.log("Req.body = ",JSON.stringify(req.body, undefined, 2));
    var newUser = new User({
        email: 'email.com'
    })

    newUser.save()
        .then((doc) => {
            // console.log("**Document: ",doc);
            res.send(doc);
        }, (err) => {
            // console.log("**Error: ",err);
            res.status(400).send(err);
        })
})

app.get("/todo", (req, res) => {
    Todo.find()
        .then((docs) => {
            res.send(docs);
        },(err) =>{
            res.status(400).send(err);
        })
})

app.listen(5000, () => {
    console.log("connected to database");
})

module.exports = {app};


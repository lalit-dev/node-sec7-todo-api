require('./../config/config')

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb')
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var mongoose = require("../db/setup");
var {Todo} = require('../models/todo');
var {User} = require('../models/user');
var {authenticate} = require('./../middlewares/authenticate');

// console.log("express = ",express)
var app = express();
var port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(express.json());

// PUBLIC API *******************************************************************************
app.post('/todo', (req, res) => {
    // console.log("Req.body = ",JSON.stringify(req.body, undefined, 2));
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
    // console.log("Req.body = ",JSON.stringify(req.body, undefined, 2));
    var body = _.pick(req.body, ['email', 'password']);
    // console.log("BODY of /user ",body)
    var newUser = new User(body);

    newUser.save()
        .then(() => {
            // console.log("saved document...")
            return newUser.generateAuthToken()
        })
        .then((token) => {
            // console.log("saved token...",token);
            // console.log("NEWUSER = ",newUser);
            res.header('auth-x',token).send(newUser);
        }, (err) => {
            res.status(400).send(err);
        })
})

app.get('/user/:id', (req, res) => {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!")
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send({errorMessage: "Id is not valid"})
    }

    User.findById(id)
        .then((docs) => {
            if(!docs){
                return res.status(404).send({errorMessage: "no document found"})
            }
            res.send(docs);
        }, (err) => {
            res.status(400).send(err)
        })
})

app.get('/todo/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send({errorMessage: "Id is not valid"})
    }

    Todo.findById(id)
        .then((docs) => {
            if(!docs){
                return res.status(404).send({errorMessage: "no document found"})
            }
            res.send({docs,randomText:'randomText'});
        }, (err) => {
            res.status(400).send(err)
        })
        .catch((err) => {
            return res.status(400).send({err});
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

app.delete("/todo/:id", (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send({errorMessage: 'Invalid Id'});
    }
    Todo.findByIdAndDelete(id)
        .then( (doc) => {
            if(!doc){
                return res.status(404).send({errorMessage: 'document not found'});
            }
            res.send({doc});
        }, (err) => {
            res.statue(400).send(err);
        })
})

app.patch('/todo/:id', (req, res) => {
    var id = req.params.id;

    var body = _.pick(req.body, ['task', 'completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id}, {
        $set: body
    },{new: true})
    .then((todo) => {
        if(!todo){
            return res.status(404).send({errorMessage: "document not found"});
        }
        res.send({todo});
    })
    .catch((err) => {
        res.status(400).send({err});
    })
})
// ***************************************************


// PRIVATE API  *******************************************************************

app.get("/users/me", authenticate, (req, res) => {
    // console.log("req = ", req.header);
    res.send(req.user);
    
})

app.post("/users/login", (req, res) => {
    var usr;
    // console.log('req.body = ',req.body);
    let body = _.pick(req.body, ['email', 'password']);
    // User.findOne({email: body.email})
    //     .then((user) => {
    //         usr = user
    //         console.log("USER ", user);
    //         return bcrypt.compare(body.password, user.password);
    //     })
    //     .then((response) => {
    //         console.log("RESPONSE   ",response)
    //         if(response == true){
    //             res.send(usr);
    //         } else{
    //             res.status(400).send();
    //         }
    //     })

    User.findByCredentials(body)
        .then((user) => {
            //  console.log("user recieved in server.js")
            return user.generateAuthToken()
                .then((token) => {
                    // console.log("NEW TOKEN recieved in server.js")
                    res.header('x-auth',token).send(user)
                })
        })
        .catch((e) => {
            // console.log("error recieved in server.js",e)
            res.status(400).send();
        })

})

app.listen(port, () => {
    console.log(`connected to Port: ${port}`);
})

module.exports = {app};



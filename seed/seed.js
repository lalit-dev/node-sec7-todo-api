const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');



const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: "1@abc.com",
    password: 'UserOnePass',
    tokens:[{
        access:'auth',
        token: jwt.sign({_id: userOneId.toHexString(), access:'auth'}, process.env.JWT_SECRET).toString()
    }]
},
{
    _id: userTwoId,
    email: "2@abc.com",
    password: 'UserTwoPass',
    tokens:[{
        access:'auth',
        token: jwt.sign({_id: userTwoId.toHexString(), access:'auth'}, process.env.JWT_SECRET).toString()
    }]
}]

const todos = [{
    _id: new ObjectID(),
    task: 'first task',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    task: 'second task',
    completed: true,
    _creator: userTwoId
}]

const populateTodos = (done) => {
    // console.log("inside populateTodos")
    Todo.deleteMany({})
        .then(() => {
            // console.log("todos: ",todos);
            return Todo.insertMany(todos)
            
        })
        .then(() => {
            // console.log("SUCCESS")
            done();
        })
        .catch((err) => {
            done(err)
        })
}

const populateUsers = (done) => {
    // console.log("inside populateUsers")
    User.deleteMany({})
        .then(() => {
            // console.log("USERS: ",users);
            var userOne = new User(users[0]).save();
            var userTwo = new User(users[1]).save();

            return Promise.all([userOne, userTwo])

            
        })
        .then(() => {
            // console.log("SUCCESS")
            done();
        })
        .catch((err) => {
            done(err)
        })
}



module.exports = {todos, populateTodos, users, populateUsers};

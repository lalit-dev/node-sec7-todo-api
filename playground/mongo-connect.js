// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// console.log("MongoClient = ",MongoClient);
// console.log("ObjectID = ",ObjectID);


var {name} = {name:'lalit', age:25};
console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, Client) => {
    if(err){
        return console.log(" unable to connect to mongodb");
    }
    console.log("Connected to mongodb");
    const db = Client.db("TodoApp");

    // db.collection('testObj').insertOne({
    //     name: 'lalit',
    //     age: '23'
    // }, (err, result) => {
    //     if(err){
    //         return console.log("unable to insert document");
    //     }
    //     console.log("Document: ",JSON.stringify(result.ops, undefined, 2))
    // })

    db.collection('Users').insertOne({
        name: 'rohit yadav',
        age: 21,
        location: 'gurgaon'
    }, (err, result) => {
        if(err){
            return console.log("unable to insert",err);
        }
        console.log("OUTPUT = ",JSON.stringify(result.ops, undefined, 3));
    })

    Client.close();
})
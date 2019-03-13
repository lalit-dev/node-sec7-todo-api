// const MongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb');

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

    // var x = db.collection('Users').find({name:'rohit yadav',age:21}).toArray()
    // .then((docs)=>{
    //     console.log("DOCS = ",typeof docs, JSON.stringify(docs, undefined, 2));
    // })
    // console.log("XXXXXXXXXXX = ",x);

    db.collection('Users').deleteMany({name: 'rohit yadav'})
    .then((result) => {
        console.log("deleteMany = ",result);
    })

    db.collection('Users').deleteOne({name: 'lalit yadav'})
    .then((result) => {
        console.log("deleteOne = ",result);
    })

    db.collection('Users').findOneAndDelete({name: 'Lalit yadav'})
    .then((result) => {
        console.log("Result = ",result);
    })

    Client.close();
})
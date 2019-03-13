const {MongoClient} = require('mongodb');


var {name} = {name:'lalit', age:25};
console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, Client) => {
    if(err){
        return console.log(" unable to connect to mongodb");
    }
    console.log("Connected to mongodb");
    const db = Client.db("TodoApp");

    db.collection('Users').findOneAndUpdate({location:'gurgaon'},{
    $set: {
           location:'gurugram'
    }},
    {
        returnOriginal: false,
        multi: true
    })
    .then((result) => {
        console.log("RESULT = ",result);
    })

    Client.close();
})
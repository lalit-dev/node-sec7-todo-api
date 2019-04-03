var env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test'){
    var configArray = require('./config.json');
    // console.log(configArray);

    configObj = configArray[env];
    // console.log("configObj = ",configObj);

    Object.keys(configObj).forEach((key) => {
        process.env[key] = configObj[key];
        // console.log(`process.env[${key}] = ${process.env[key]}`);
    })
    // .then(() => {
    //     console.log("process.env = ",process.env);
    // })

}




// if(env === 'development'){
//     process.env.PORT= '5000';
//     process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";

// }else if(env === 'test'){  
//     process.env.PORT= '5000';
//     process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";

// }
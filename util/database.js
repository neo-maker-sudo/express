const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback =>{
    MongoClient.connect('mongodb+srv://neo:FGG88SyM0tSdYWM3@cluster0.2wcgz.mongodb.net/<dbname>?retryWrites=true&w=majority')
    .then(client=>{
        console.log('Connected!!');
        _db =client.db('test');
        callback()
    })
    .catch(err=>{
        console.log(err);
        throw err;
    });
}

const getDb = ()=>{
    if(_db){
        return _db;
    }
    throw 'No database found !'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
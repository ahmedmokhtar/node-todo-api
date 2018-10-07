// const MongoClient = require('mongodb').MongoClient;
const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // deleteMany
    // db.collection('Todos').deleteMany({name: 'Eat lunch'}).then((result) => {
    //     console.log(result)
    // })

    // deleteOne
    // db.collection('Todos').deleteOne({name: 'Eat lunch'}).then((result) => {
    //     console.log(result)
    // })

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result)
    // })

    // db.collection('Users').deleteMany({name: 'Ahmed Mokhtar'}).then((result) => {
    //     console.log(result.result)
    // })

    // db.collection('Users').findOneAndDelete({_id: new ObjectID("5bb893df78189b251c693649")}).then((result) => {
    //     console.log(result)
    // })

    // db.close();
});
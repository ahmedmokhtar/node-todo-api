const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// Todo.remove({}).then((result) => {
//     console.log(result)
// }) 

// Todo.findByIdAndRemove('5bc3079b2b59b0116c9cc83f').then((todo) => {
//     console.log(todo)
// })

Todo.findOneAndRemove({text: 'First test todo'}).then((todo) => {
    console.log(todo)
})
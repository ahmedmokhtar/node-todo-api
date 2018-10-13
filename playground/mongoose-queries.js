const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// const id = '5bc1a2ecb1a0facc0a5274c7'

// if (!ObjectID.isValid(id)) {
//     console.log('Id not valid!')
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos:', todos)
// })

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo:', todo)
// })

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found!')
//     }
//     console.log('Todo by Id:', todo)
// }).catch((err) => console.log(err))

const userId = '5bbdc4dc3bddde1c124abf9d'

User.findById(userId).then((user) => {
    if (!user) {
        return console.log('User not found!')
    }

    console.log('User by Id: ', user)
}).catch((err) => {
    console.log(err)
})
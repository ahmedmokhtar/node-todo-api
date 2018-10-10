const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp')

const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
})

const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
})

// const newTodo = new Todo({
//     text: 'Cook new dinner'
// })

// newTodo.save().then((doc) => {
//     console.log('saved todo: ', doc)
// }, (err) => {
//     console.log('Unable to save todo', err)
// })

// const anotherTodo = new Todo({
//     text: '   Edit this todo    '
// })

// anotherTodo.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2))
// }, (err) => {
//     console.log('Unable to save todo', err)
// })

const newUser = new User({
    email: '   ahmed@ahmed.com'
})

newUser.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2))
}, (err) => {
    console.log('Unable to save user', err)
})
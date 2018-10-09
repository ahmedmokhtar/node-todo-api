const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp')

const Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
})

const newTodo = new Todo({
    text: 'Cook new dinner'
})

// newTodo.save().then((doc) => {
//     console.log('saved todo: ', doc)
// }, (err) => {
//     console.log('Unable to save todo', err)
// })

const anotherTodo = new Todo({
    text: 'Learn coding',
    completed: false,
    completedAt: 1234562
})

anotherTodo.save().then((doc) => {
    console.log(doc)
}, (err) => {
    console.log('Unable to save todo', err)
})
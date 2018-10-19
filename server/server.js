require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')
const bcrypt = require('bcryptjs')

const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')
const {authenticate} = require('./middleware/authenticate')

const app = express()
const port = process.env.PORT


app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    })

    todo.save().then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(400).send(err)
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (err) => {
        res.status(400).send(err)
    })
})

app.get('/todos/:id', (req, res) => {
    const id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Todo.findById(id).then((todo) => {
        if(todo) {
            res.send({todo})
        } else {
            res.status(404).send()
        }
    }).catch((err) => res.status(400).send())
})

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(todo) {
            res.send({todo})
        } else {
            res.status(404).send()
        }
    }).catch((err) => res.status(400).send())
})

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id
    const body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false
        body.completedAt = null 
    }

    Todo.findByIdAndUpdate(id, body, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send()
        }

        res.send({todo})
    }).catch((err) => {
        res.status(400).send()
    })
})

// POST /users
app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password'])
    const user = new User(body)

    user.generateAuthToken()
        .then((token) => {
        res.header('x-auth', token).send(user)
        })
        .catch((err) => {
        res.status(400).send(err)
        })
    
})

//POST /users/login
app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password'])

    User.findByCredentials(body.email, body.password)
        .then((user) => {
            const token = user.generateAuthToken()
            return Promise.all([token, user])    
        })
        .then(([token, user]) => {
            res.header('x-auth', token).send(user)
        })
        .catch((err) => {
            res.status(400).send(err)
        })

    // const {email, password} = req.body

    // User.findOne({email}).then((user) => {
    //     if (!user) {
    //         return Promise.reject('user not found')
    //     }

    //     const isMatching = bcrypt.compareSync(password, user.password)

    //     if (!isMatching) {
    //         return Promise.reject('wrong password')
    //     }

    //     return res.send(user)
    // }).catch((err) => {
    //     res.status(404).send(err)
    // })
})

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }).catch((err) => res.status(400).send(err))
})

app.listen(port, () => {
    console.log(`Started at port: ${port}`)
})

module.exports = {app}
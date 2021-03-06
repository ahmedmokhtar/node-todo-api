const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test todo text'

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((err) => done(err))
            })
    })

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((err) => done(err))
            })
    })
})

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1)
            })
            .end(done)
    })
})

describe('GET /todos:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('should not return todo doc for other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404, done)
    })

    it('should return 404 for invalid ObjectIDs', (done) => {
        request(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404, done)
    })
})

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const id = todos[1]._id.toHexString()

        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                
                Todo.findById(id).then((todo) => {
                    expect(todo).toBeFalsy()
                    done()
                }).catch((err) => done(err))
            })
       
    })

    it('should not remove a todo of another user', (done) => {
        const id = todos[0]._id.toHexString()

        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                
                Todo.findById(id).then((todo) => {
                    expect(todo).toBeTruthy()
                    done()
                }).catch((err) => done(err))
            })
       
    })

    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID().toHexString()

        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404, done)
   
    })

    it('should return 404 for invalid ObjectIDs', (done) => {
        request(app)
            .delete('/todos/123')
            .set('x-auth', users[1].tokens[0].token)
            .expect(404, done)
    })
})

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        const id = todos[0]._id.toHexString()
        const update = {
            text: "Updated from test script",
            completed: true
        }

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(update)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(update.text)
                expect(res.body.todo.completed).toBe(true)
                expect(typeof res.body.todo.completedAt).toBe('number')
            })
            .end(done)
    })

    it('should not update the todo of the other user', (done) => {
        const id = todos[1]._id.toHexString()
        const update = {
            text: "Updated from test script",
            completed: true
        }

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(update)
            .expect(404)
            .end(done)
    })

    it('should clear completedAt when todo is not completed', (done) => {
        const id = todos[1]._id.toHexString()
        const update = {
            text: "Updated from test script",
            completed: false
        }

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(update)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(update.text)
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toBeFalsy()
            })
            .end(done)
    })
}) 

describe('Get /users/me', () => {
    it('should return a user if authenticated', (done) => {
        const user = users[0]
        
        request(app)
            .get('/users/me')
            .set('x-auth', user.tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(user._id.toHexString())
                expect(res.body.email).toBe(user.email)
            })
            .end(done)
    })

    it('should return 401 if not authenticated', (done) => {
        const user = users[1]

        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) =>{
                expect(res.body).toEqual({})
            })
            .end(done)
    })
})

describe('POST /users', () => {
    it('should create a user', (done) => {
        const email = 'example@ex.com'
        const password = 'abc123!'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toBeTruthy()
                expect(res.body.email).toBeTruthy()
                expect(res.body._id).toBeTruthy()
            })
            .end((err, res) => {
                if (err) return done(err)

                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy()
                    expect(user.password).not.toBe(password)
                    done()
                }).catch((err) => done(err))

            })
    })

    it('should return validation errors if request invalid', (done) => {
        const email = 'ahmed'
        const password = 'abcdef12!'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400, done)
    })

    it('should not create user if email in use', (done) => {
        const user = users[0]
        request(app)
            .post('/users')
            .send({email: user.email, password: user.password})
            .expect(400, done)
            
    })
}) 

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        const {email, password, _id} = users[1]

        request(app)
            .post('/users/login')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toBeTruthy()
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                User.findById(_id).then((user) => {
                        expect(user.toObject().tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.header['x-auth']
                    })
                    done()
                }).catch((err) => done(err))
            })
    })

    it('should reject invalid login', (done) => {
        const {email, password, _id} = users[1]
        const wrongPass = password + '123'

        request(app)
            .post('/users/login')
            .send({email, password: wrongPass})
            .expect(400)
            .expect((res) => {
                expect(res.header['x-auth']).toBeFalsy()
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                User.findById(_id).then((user) => {
                    expect(user.tokens.length).toBe(1)
                    done()
                }).catch((err) => done(err))
            })
    })
}) 

describe('DELETE /users/me/token', () => {
    it('should remove auth token on log out', (done) => {
        const user1 = users[0]
        const token = user1.tokens[0].token
        request(app)
            .delete('/users/me/token')
            .set('x-auth', token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)

                User.findById(user1._id).then((user) => {
                    expect(user.tokens.length).toBe(0)
                    done()
                }).catch((err) => {
                    return done(err)
                })
            })
    })
})
const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test todo text'

        request(app)
            .post('/todos')
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
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})

describe('GET /todos:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404, done)
    })

    it('should return 404 for invalid ObjectIDs', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404, done)
    })
})

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const id = todos[1]._id.toHexString()

        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                
                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist()
                    done()
                }).catch((err) => done(err))
            })
       
    })

    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID().toHexString()

        request(app)
            .delete(`/todos/${id}`)
            .expect(404, done)
   
    })

    it('should return 404 for invalid ObjectIDs', (done) => {
        request(app)
            .delete('/todos/123')
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
            .send(update)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(update.text)
                expect(res.body.todo.completed).toBe(true)
                expect(res.body.todo.completedAt).toBeA('number')
            })
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
            .send(update)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(update.text)
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toNotExist()
            })
            .end(done)
    })
})
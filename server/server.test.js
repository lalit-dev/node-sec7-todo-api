const request = require("supertest");
const expect = require("expect");
const { ObjectID } = require("mongodb");

var { Todo } = require('./../models/todo');
var { User } = require('./../models/user');
var { app } = require('./server');
var {todos, populateTodos, users, populateUsers} = require('./../seed/seed');

// before(() => {
//     this.timeout(10000);
// });
// describe("reset Todo and User", (done) => {
    beforeEach(populateUsers);
    beforeEach(populateTodos);
// })
// const todos = [{
//     _id: new ObjectID(),
//     task: 'first task'
// }, {
//     _id: new ObjectID(),
//     task: 'second task',
//     completed: true
// }]


// beforeEach((done) => {
//     Todo.deleteMany({})
//         .then(() => {
//             return Todo.insertMany(todos)
//         })
//         .then(() => {
//             return done();
//         })
//         .catch((err) => {
//             return done();
//         })
// })


describe('create new Todo', () => {
    it('todo created successfully', (done) => {
        var task = 'new task';

        request(app)
            .post('/todo')
            .send({ task })
            .expect(200)
            .expect((res) => {
                expect(res.body.task).toBe(task)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ task: task })
                    .then((doc) => {
                        if(!err){
                        expect(doc.length).toBe(1);
                        expect(doc[0].task).toBe(task);
                        done();
                        }
                    })
                    .catch((err) => {
                        done(err);
                    })
            })
    })

    it("should not create todo with invalid data", (done) => {
        var task = 'invalid task'
        request(app)
            .post("/todo")
            .send()
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find()
                    .then((docs) => {
                        expect(docs.length).toBe(2);
                        // expect(docs[0].task).toBe(task)
                        done()
                    })
                    .catch((err) => {
                        done(err)
                    })
            })
    })
})

describe('FETCH /todo', () => {
    it('fetch todo', (done) => {
        request(app)
            .get('/todo')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(2);
            })
            .end(done)
    })
})

describe("GET /todo/:id", () => {
    it('It should return invalid id', (done) => {
        request(app)
            .get(`/todo/1234`)
            .expect(404)
            .expect((res) => {
                expect(res.body.errorMessage).toBe("Id is not valid");
            })
            .end(done);
    })

    it('Valid Id but no document found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todo/${hexId}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.errorMessage).toBe("no document found");
            })
            .end(done);
    })

    it('Valid id and document found', (done) => {
        request(app)
            .get(`/todo/${todos[0]._id}`)
            .expect(200)
            .expect((res) => {
                // expect(res.body.doc.length).toBe(1);
                expect(res.body.docs.task).toBe('first task');
            })
            .end(done);
    })
})

describe('DELETE /todo/:id', () => {
    it('Invalid ID', (done) => {
        request(app)
            .delete(`/todo/123ddd`)
            .expect(404)
            .expect((res) => {
                expect(res.body.errorMessage).toBe('Invalid Id');
            })
            .end(done);
    })

    it("document doesn't exist", (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todo/${hexId}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.errorMessage).toBe('document not found');
            })
            .end(done);
    })

    it("document Deleted", (done) => {
        request(app)
            .delete(`/todo/${todos[1]._id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.doc.task).toBe('second task');
            })
            .end(done);
    })
})

describe("PATCH /todo/:id", () => {
    it("should update todo", (done) => {
        request(app)
            .patch(`/todo/${todos[0]._id}`)
            .send({
                task: "task 1 updated",
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.task).toBe("task 1 updated");
                expect(res.body.todo.completed).toBe(true);
                // expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    })

    it("should clear completedAt when completed is false ", (done) => {
        request(app)
            .patch(`/todo/${todos[1]._id}`)
            .send({
                task: "task 2 updated ",
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.task).toBe("task 2 updated");
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done);
    })
})

describe('GET users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done);
    })

    it('should return 401 if not authorised', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    })
})

describe('POST /user', () => {
    it('should create user', (done) => {
        var user = {
            email: '3@abc.com',
            password: '123mnb!'
        }
        request(app)
            .post('/user')
            .send(user)
            .expect(200)
            .expect((res) => {
                // console.log("$$$$$$$$$$$$$$$$$$should create user: ",res.body);
                expect(res.headers['auth-x']).toBeTruthy();
                expect(res.body.email).toBe(user.email);
                expect(res.body._id).toBeTruthy();
            })
            .end((err) => {
                if(err){
                    // console.log("ERROR OCCURED",err);
                    return done(err);
                }
                
                User.findOne({email: user.email})
                    .then((newUser) => {
                        // console.log("USER FOUND",newUser);
                        expect(newUser).toBeTruthy();
                        expect(newUser.password).not.toBe(user.password);
                        done();
                    }).catch((e) => done(e));
            })
    })

    it('should return validation error if request is invalid ', (done) => {
        var user = {
            email: '4@5@2.3',
            password: '123mnb!'
        }
        request(app)
            .post('/user')
            .send(user)
            .expect(400)
            .end(done);
            
    })

    it('should not create error if email is in use', (done) => {
        var user = {
            email: "1@abc.com",  //email is already in use
            password: '123mnb!'
        }

        request(app)
            .post('/user')
            .send(user)
            .expect(400)
            .end(done);

    })
})

describe("POST /users/login", () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email:users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect( (res) => {
                expect(res.header['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err){
                    return done(err)
                }

                User.findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens[0]).toMatchObject({access:'auth', token: res.header['x-auth'] });
                        done();
                    }).catch((e) => done(e));
            })
    });

    it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email:users[1].email,
            password: users[1].password + "11"
        })
        .expect(400)
        .expect((res) => {
            expect(res.header['x-auth']).toBeFalsy();
        })
        .end(done)
    })
})
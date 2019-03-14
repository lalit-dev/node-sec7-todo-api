const request = require("supertest");
const expect = require("expect");
const {ObjectID} = require("mongodb");

var {Todo} = require('./../models/todo');
var {app} = require('./server');

var todos = [{
    _id: new ObjectID(),
    task: 'first task'
},{
    _id: new ObjectID(),
    task:'second task'
}]

beforeEach( (done) => {
    Todo.deleteMany({})
        .then( () => {
            return Todo.insertMany(todos)
        })
        .then(() => {
            done();
        })
})


describe('create new Todo', () => {
    it('todo created successfully', (done) => {
        var task = 'new task';

        request(app)
            .post('/todo')
            .send({task})
            .expect(200)
            .expect((res) => {
                expect(res.body.task).toBe(task)
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.find({task:task})
                    .then((doc) =>{
                        // if(!err){
                            expect(doc.length).toBe(1);
                            expect(doc[0].task).toBe(task);
                            done();
                        // }
                    })
                    .catch( (err) => {
                        done(err);
                    })
            })
    })

    it("should not create todo with invalid data", (done) => {
        var task = 'invalind task'
        request(app)
            .post("/todo")
            .send()
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find()
                    .then((docs) => {
                        expect(docs.length).toBe(2);
                        // expect(docs[0].task).toBe(task)
                        done()
                    })
                    .catch((err) =>{
                        done(err)
                    })
            })
    })
})

describe('FETCH /todo', () =>{
    it('fetch todo', (done) =>{
        request(app)
            .get('/todo')
            .expect(200)
            .expect((res) =>{
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
                // console.log("it should return invalid id",res.body);
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
                // console.log("document should be empty",res.body);
                expect(res.body.errorMessage).toBe("no document found");
            })
            .end(done);
    })

    it('Valid id and document found', (done) => {
        request(app)
            .get(`/todo/${todos[0]._id}`)
            .expect(200)
            .expect( (res) => {
                // console.log("Valid id and document found",res.body);
                // expect(res.body.doc.length).toBe(1);
                expect(res.body.docs.task).toBe('first task');
            })
            .end(done);
    })
})
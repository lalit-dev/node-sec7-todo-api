const request = require("supertest");
const expect = require("expect");

var {Todo} = require('./../models/todo');
var {app} = require('./server');

var todos = [{
    task: 'first task'
},{
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
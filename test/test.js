var request = require('supertest');
var app = require('./../server');

var token;
var testItem;

describe('LOGIN', function () {
    it("login success", function (done) {
        request(app).post('/api/auth')
            .send({
                'email': "thanhkq",
                "password": "123"
            })
            .set('Content-type', "application/json")
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    // console.log("error ", err)
                    throw err
                }

                if (res.status == 200) {
                    // console.log(res.body);
                    token = res.body.token;
                    done();
                } else {
                    throw new Error("Not expected response");
                }
            })
    });

    it("login failed", function (done) {
        request(app).post('/api/auth')
            .send({
                'email': "thanhkq",
                "password": "wrongpassword"
            })
            .set('Content-type', "application/json")
            .expect(400, done)
    });
});

describe('GET /', function () {
    it("should return json with some message", function (done) {
        // The line below is the core test of our app.     
        request(app).get('/index')
            .expect(200) // THis is HTTP response
            .expect("Content-type", /json/)
            .end(function (err, res) {
                if (err) throw err

                if (res.status == 200) {
                    done();
                } else {
                    throw new Error("Not expected response")
                }
            });
    });

    it("get all items", function (done) {
        request(app).get("/api/items")
            .expect("Content-type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) throw err

                if (res.status == 200) {
                    done();
                } else {
                    throw new Error("Not expected response")
                }
            })
    });

    it("get user info with token", function (done) {
        request(app).get("/api/auth/user")
            .set({
                'Content-Type': 'application/json',
                'x-auth-token': token
            })
            .expect(200, done)
    })

    it("get user info without token", function (done) {
        request(app).get("/api/auth/user")
            .expect(403)
            .end((err, res) => {
                if (err) throw err

                console.log('res.status: ', res.status);
                if (res.status == 403) {
                    done();
                } else {
                    throw new Error("Not expected response")
                }
            })
    });
});

describe('POST /', function () {
    it("create new item failed without token", function (done) {
        request(app).post("/api/items")
            .send({ 'name': 'test data-' + Math.floor(new Date() / 1000) })
            .expect(500, done)
    });

    it("create new item", function (done) {
        request(app).post("/api/items")
            .send({ 'name': 'test data-' + Math.floor(new Date() / 1000) })
            .set({
                'Content-Type': 'application/json',
                'x-auth-token': token
            })
            .expect(200)
            .end((err, res) => {
                if (err) throw err;

                if (res.status == 200) {
                    testItem = res.body;
                    // console.log("testItem data: ", testItem)
                    done();
                } else {
                    throw new Error("No expected response")
                }
            })
    });

    it("sign up witt empty password", function (done) {
        request(app).post("/api/users")
            .send({ "name": "tester", "email": "testing@gmail.com", "password": "" })
            .expect(400, done)
    })
});

describe('DELETE /', function () {
    it("delete test item failed without token", function (done) {
        request(app).delete("/api/items/" + testItem._id)
            .expect(401, done)
    });

    it("delete test item", function (done) {
        request(app).delete("/api/items/" + testItem._id)
            .set({
                'Content-Type': 'application/json',
                'x-auth-token': token
            })
            .expect(200, done)
    });

    it("delete item with wrong id", function (done) {
        request(app).delete("/api/items/" + "123")
            .set({
                'Content-Type': 'application/json',
                'x-auth-token': token
            })
            .expect(404, done)
    })
});
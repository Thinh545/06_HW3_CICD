var request = require('supertest');
var app = require('./../app')

describe('GET /', function () {
    it("should return home page", function (done) {
        // The line below is the core test of our app.     
        request(app).get('/')
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(function (err, res) {
                if (res.status == 200) {
                    done();
                } else {
                    throw err;
                }
            });
    });
}); 
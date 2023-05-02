/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const app = require("../app");

let id;

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("Routing tests", function() {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        test("Test POST /api/books with title", function(done) {
          chai
            .request(app)
            .post("/api/books")
            .send({
              title: "test title",
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.property(res.body, "title");
              assert.property(res.body, "_id");
              assert.equal(res.body.title, "test title");
              id = res.body._id;
            });

          done();
        });

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(app)
            .post("/api/books")
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field title");
            });

          done();
        });
      }
    );

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(app)
          .get("/api/books")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            assert.property(
              res.body[0],
              "commentcount",
              "Books in array should contain commentcount"
            );
            assert.property(
              res.body[0],
              "title",
              "Books in array should contain title"
            );
            assert.property(
              res.body[0],
              "_id",
              "Books in array should contain _id"
            );

            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      test("Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(app)
          .get("/api/books/56cb91bdc3464f14678934ca")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");

            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(app)
          .get(`/api/books/${id}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, "title");
            assert.property(res.body, "_id");
            assert.property(res.body, "comments");
            assert.isArray(res.body.comments);
          });

        done();
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        test("Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(app)
            .post(`/api/books/${id}`)
            .send({
              comment: "test comment",
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.property(res.body, "title");
              assert.property(res.body, "_id");
              assert.property(res.body, "comments");
              assert.isArray(res.body.comments);
            });

          done();
        });

        test("Test POST /api/books/[id] without comment field", function(done) {
          chai
            .request(app)
            .post(`/api/books/${id}`)
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field comment");
            });

          done();
        });

        test("Test POST /api/books/[id] with comment, id not in db", function(done) {
          chai
            .request(app)
            .post(`/api/books/56cb91bdc3464f14678934ca`)
            .send({
              comment: "test comment",
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "no book exists");
            });

          done();
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function() {
      test("Test DELETE /api/books/[id] with valid id in db", function(done) {
        chai
          .request(app)
          .delete(`/api/books/${id}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
          });

        done();
      });

      test("Test DELETE /api/books/[id] with  id not in db", function(done) {
        chai
          .request(app)
          .delete(`/api/books/56cb91bdc3464f14678934ca`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
          });

        done();
      });
    });
  });
});

after(function() {
  chai.request(app)
    .get('/')
});
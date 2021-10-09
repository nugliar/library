/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const ObjectId = require('mongoose').Types.ObjectId;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        const title = randomString();

        chai
          .request(server)
          .post('/api/books')
          .send({
            title: title
          })
          .end(function(err, res) {
            if (err) { done(err) }
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.equal(res.body.title, title);
            done();
          })
      });

      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res) {
            if (err) { done(err) }
            assert.equal(res.status, 200);
            assert.empty(res.body);
            assert.equal(res.text, 'missing required field title');
            done();
          })
      });

    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        const title = randomString();

        chai
          .request(server)
          .post('/api/books')
          .send({
            title: title
          })
          .end(function(err, res) {
            if (err) { done(err) }
            assert.equal(res.status, 200);

            chai
              .request(server)
              .get('/api/books')
              .end(function(err, res) {
                if (err) { done(err) }
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.property(res.body[0], '_id');
                assert.property(res.body[0], 'title');
                assert.property(res.body[0], 'commentcount');
                assert.property(res.body[0], 'comments');
                assert.isArray(res.body[0].comments);
                done();
              })
          })
      });
    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get('/api/books/' + new ObjectId)
          .end(function(err, res) {
            if (err) { done(err) }
            assert.equal(res.status, 200);
            assert.empty(res.body);
            assert.equal(res.text, 'no book exists');
            done();
          })
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        const title = randomString();

        chai
          .request(server)
          .post('/api/books')
          .send({
            title: title
          })
          .end(function(err, res) {
            if (err) { done(err) }
            assert.equal(res.status, 200);
            assert.property(res.body, '_id')

            const bookId = res.body._id;

            chai
              .request(server)
              .get('/api/books/' + bookId)
              .end(function(err, res) {
                if (err) { done(err) }
                assert.equal(res.status, 200);
                assert.property(res.body, '_id');
                assert.equal(res.body._id, bookId)
                assert.property(res.body, 'title');
                assert.property(res.body, 'comments');
                assert.isArray(res.body.comments);
                done();
              })
          })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        const title = randomString();

        chai
          .request(server)
          .post('/api/books')
          .send({
            title: title
          })
          .end(function(err, res) {
            if (err) { done(err) }
            assert.equal(res.status, 200);
            assert.property(res.body, '_id')

            const bookId = res.body._id;
            const comment = randomString();

            chai
              .request(server)
              .post('/api/books/' + bookId)
              .send({
                comment: comment
              })
              .end(function(err, res) {
                if (err) { done(err) }
                assert.equal(res.status, 200);
                assert.property(res.body, '_id');
                assert.equal(res.body._id, bookId)
                assert.property(res.body, 'title');
                assert.property(res.body, 'commentcount');
                assert.isTrue(res.body.commentcount > 0)
                assert.property(res.body, 'comments');
                assert.isArray(res.body.comments);
                assert.include(res.body.comments, comment);
                done();
              })
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        const title = randomString();

        chai
          .request(server)
          .post('/api/books')
          .send({
            title: title
          })
          .end(function(err, res) {
            if (err) { done(err) }
            assert.equal(res.status, 200);
            assert.property(res.body, '_id')

            const bookId = res.body._id;

            chai
              .request(server)
              .post('/api/books/' + bookId)
              .send({})
              .end(function(err, res) {
                if (err) { done(err) }
                assert.equal(res.status, 200);
                assert.empty(res.body);
                assert.equal(res.text, 'missing required field comment');
                done();
              })
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const comment = randomString();

        chai
          .request(server)
          .post('/api/books/' + new ObjectId)
          .send({
            comment: comment
          })
          .end(function(err, res) {
            if (err) { done(err) }
            assert.equal(res.status, 200);
            assert.empty(res.body);
            assert.equal(res.text, 'no book exists');
            done();
          })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        const title = randomString();

        chai
          .request(server)
          .post('/api/books')
          .send({
            title: title
          })
          .end(function(err, res) {
            if (err) { done(err) }
            assert.equal(res.status, 200);
            assert.property(res.body, '_id')

            const bookId = res.body._id;

            chai
              .request(server)
              .delete('/api/books/' + bookId)
              .send({})
              .end(function(err, res) {
                if (err) { done(err) }
                assert.equal(res.status, 200);
                assert.empty(res.body);
                assert.equal(res.text, 'delete successful');
                done();
              });
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){
        chai
          .request(server)
          .delete('/api/books/' + new ObjectId)
          .send({})
          .end(function(err, res) {
            if (err) { done(err) }
            assert.equal(res.status, 200);
            assert.empty(res.body);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});

// Helper functions
const randomString = () => {
  const length = Math.round(Math.random() * 15 + 5);
  let array = [];

  for (let idx = 0; idx < length; idx++) {
    array.push(String
      .fromCharCode(32 + Math.floor(Math.random() * 94))
      .concat(String.fromCharCode(97 + Math.floor(Math.random() * 25)))
      .match(/[0-9a-zA-Z]/g)
      .join('')
    )
  }
  return array.join('');
}

const randomArrayElem = (array) => {
  return array[Math.floor(Math.random() * (array.length - 1))];
}

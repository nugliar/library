/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const BookModel = require('../BookModel');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      BookModel.find({}, function(err, books) {
        if (err) { return res.send(err.message.text || err.message) }
        res.json(books || []);
      })
    })

    .post(function (req, res){
      const title = req.body.title;

      if (!title) { return res.send('missing required field title') }

      BookModel.create({
        title: title,
        commentcount: 0,
        comments: []
      }, function(err, book) {
        if (err) { return res.send(err.message.text || err.message) }
        if (!book) { return res.send('could not create') }
        res.send({
          _id: book._id,
          title: book.title,
          commentcount: book.commentcount,
          comments: book.comments
        })
      })
    })

    .delete(function(req, res){
      BookModel.deleteMany({}, function(err, result) {
        if (err) { return res.send(err.message.text || err.message) }
        res.send('complete delete successful');
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      const bookid = req.params.id;

      BookModel.findById(bookid, function(err, book) {
        if (err) { return res.send(err.message.text || err.message) }
        if (!book) { return res.send('no book exists') }
        res.json({
          _id: book._id,
          title: book.title || '',
          comments: book.comments || []
        });
      })
    })

    .post(function(req, res){
      const bookid = req.params.id;
      const comment = req.body.comment;

      if (!comment) { return res.send('missing required field comment')}

      BookModel.findOne({ _id: bookid }, function(err, book) {
        if (err) { return res.send(err.message.text || err.message) }
        if (!book) { return res.send('no book exists') }

        book.comments.push(comment);
        book.commentcount = book.commentcount + 1;

        book.save({new: true}, function(err, savedBook) {
          if (err) { return res.send(err.message.text || err.message) }
          res.json(savedBook);
        })
      })
    })

    .delete(function(req, res){
      let bookid = req.params.id;

      BookModel.deleteOne({ _id: bookid }, function(err, result) {
        if (err) { return res.send(err.message.text || err.message) }
        if (!result.deletedCount) { return res.send('no book exists') }
        res.send('delete successful');
      })
    });

};

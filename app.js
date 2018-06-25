var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
var app = express();

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/mylibrary', {useMongoClient: true});

app.set('views', path.join(__dirname, 'views'));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var db = mongoose.connection;


var librarySchema = new mongoose.Schema({
  email: String,
  id: String
});

var Book = mongoose.model('books', librarySchema);

app.post('/book', function (req, res) {
  var newBook = new Book();
  newBook.email = req.body.email;
  newBook.id = req.body.id;

  newBook.save(function (err, Book) {
      if (err)
          res.send(err);
      else {
          console.log(Book);
          res.json(Book);
      }
  });
});



app.get('/books/:email', function (req, res) {
  console.log('gettting Book by _id... ');
  Book.find({ email: req.params.email },{_id:0,__v:0}, function (err, books) {
      if (err)
          res.send(err);
      else {
          console.log(books);
          res.json(books);
      }
  });
});



app.delete('/books/:id/:email', function (req, res) {
  console.log('deleting Book by id and email... ',{ id: req.params.id,email: req.params.email});
  Book.findOneAndRemove({ id: req.params.id,email: req.params.email }, function (err, Book) {
      if (err)
          res.send(err);
      else {
          console.log(Book);
          res.json(Book);
      }
  });
});



module.exports = app;

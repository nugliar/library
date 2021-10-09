const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const bookSchema = new mongoose.Schema({
  title: String,
  comments: [{ type: String }],
  commentcount: Number,
});

module.exports = mongoose.model('BookModel', bookSchema);

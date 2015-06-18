var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  upvotes: {type: Number, default: 0},
  comments: [String]
});

mongoose.model('Post', PostSchema);
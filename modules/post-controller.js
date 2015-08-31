//
// Post Controller
//

var Post = require('./posts');
var fs = require('fs');
var posts = [];

exports.getPostsFromDB = function(callback) {
  Post.find(function (err, data) {
    if(err) {
      return console.error(err);
    }
    console.log('I got this from DB: ' + data);
    posts = data;
    if(typeof(callback) != 'undefined') {
      callback();
    }
  });
}

exports.posts = function() {
  return posts;
}

exports.delete = function(req, callback) {
  Post.findOneAndRemove({_id: req.body._id}, {
    title: req.body.title,
    content: req.body.content
  }, function(error, doc, result) {
    if(error) {
      console.log('Error');
    }
    else {
      console.log('Removed!!!!');
      callback();
    }
  });
}

exports.update = function(req, callback) {
  var postObject = {
    title: req.body.title,
    content: req.body.content,
    slug: req.body.title.toLowerCase().replace(/\s/g, '-'),
    tags: req.body.tags.replace(/\s/g, '').split(',')
  };
  if(typeof(req.file) != 'undefined')
    postObject.thumbnail = req.file.path.substr(6, this.length);
  Post.findOneAndUpdate({_id: req.body._id}, postObject, {upsert: true}, function(error, doc, result) {
    if(error) {
      console.log('Error');
    }
    else {
      console.log('Updated');
      callback();
    }
  });
}

exports.createNew = function(req, callback) {
  var newPost = new Post;
  newPost.title = req.body.title;
  newPost.content = req.body.content;
  newPost.author = req.user.name;
  newPost.date = Date.now();
  newPost.slug = req.body.title.toLowerCase().replace(/\s/g, '-');
  newPost.tags = req.body.tags.replace(/\s/g, '').split(',');
  if(typeof(req.file) != 'undefined')
    newPost.thumbnail = req.file.path.path.substr(6, this.length); // cut public
  newPost.save(function (err) {
    callback();
  });
}

exports.getPostBySlug = function(req, callback) {
  Post.findOne({ slug: req.params.slug }, function(err, post) {
    console.log(post);
    callback(post);
  });
}

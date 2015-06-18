var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/Users');

/* GET home page. */

router.get('/', function(req, res) {
  if(req.user === undefined){
    res.redirect('/login');
  }else{
    res.render('index', {
    title: req.user
  });
  }
  
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  Account.register(new Account({
    username: req.body.username
  }), req.body.password, function(err, account) {
    if (err) {
      return res.render('register', {
        account: account
      });
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    });
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

var mongoose = require('mongoose');
var PostSchema = require('../models/Posts.js').PostSchema;
var Post = mongoose.model('Post', PostSchema);

router.get('/loadPostElement/:id', function(req, res, next) {
  Post.findById(req.param('id'), function(err, posts) {
    if (err) {
      return next(err);
    }

    res.json(posts);
  });
});

router.get('/loadPost', function(req, res, next) {
  Post.find(function(err, posts) {
    if (err) {
      return next(err);
    }

    res.json(posts);
  });
});

router.post('/createPost', function(req, res, next) {
  var post = new Post(req.body);
  post.save(function(err, post) {
    if (err) {
      return next(err);
    }

    res.json(post);
  });
});

router.post('/updatePostVote', function(req, res, next) {
  Post.findById(req.param('id'), function(err, posts) {
    if (err) {
      return next(err);
    }
    posts.upvotes++;
    posts.save(function(err, callback) {
      if (err) {
        return next(err);
      }
      res.json(callback);
    });
  });
});

router.post('/updatePostComment', function(req, res, next) {
  Post.findById(req.param('id'), function(err, posts) {
    if (err) {
      return next(err);
    }
    posts.comments.push(req.param('comment'));
    posts.save(function(err, callback) {
      if (err) {
        return next(err);
      }
      res.json(callback);
    });
  });
});

router.post('/removePost', function(req, res, next) {
  Post.findById(req.param('id'), function(err, posts) {
    if (err) {
      return next(err);
    }
    posts.remove(function(err) {
      if (err) {
        return res.json(false);
      }
      res.json(true);
    });
  });
});

router.post('/removeComment', function(req, res, next) {
  Post.findById(req.param('id'), function(err, posts) {
    if (err) {
      return next(err);
    }
    posts.comments.splice(req.param('index'), 1);
    posts.save(function(err) {
      if (err) {
        return res.json(false);
      }
      res.json(true);
    });
  });
});

module.exports = router;
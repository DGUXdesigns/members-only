const { validationResult } = require('express-validator');
const Post = require('../models/Post.js');

async function listPosts(req, res) {
  const posts = await Post.getAll();
  res.render('home', { title: 'Home', posts });
}

function showPostForm(req, res) {
  res.render('posts/new', {
    title: 'New Post',
    errors: {},
    oldInput: {},
  });
}

async function createPost(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMap = {};

    errors.array().forEach((error) => {
      errorMap[error.path] = error.msg;
    });

    return res.status(400).render('posts/new', {
      title: 'New Post',
      errors: errorMap,
      oldInput: req.body, // Preserve input fields
    });
  }

  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    await Post.create(title, content, userId);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listPosts,
  showPostForm,
  createPost,
};

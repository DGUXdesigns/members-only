const postController = require('../controllers/postController');
const isLoggedIn = require('../middleware/isMember');
const postValidation = require('../validators/postValidator');

const indexRouter = require('express').Router();

// view all posts
indexRouter.get('/', postController.listPosts);

// Show form to create post
indexRouter.get('/posts/new', isLoggedIn, postController.showPostForm);

// create new post
indexRouter.post('/posts/new', postValidation, postController.createPost);

module.exports = indexRouter;

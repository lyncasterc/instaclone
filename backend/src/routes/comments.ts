import express from 'express';
import { authenticator } from '../utils/middleware';
import { parseStringField } from '../utils/field-parsers';
import { NewComment } from '../types';
import commentService from '../services/comment-service';
import logger from '../utils/logger';
import { Post } from '../mongo';

const router = express.Router({ mergeParams: true });

// checking if the post exists before handling any requests
router.use(async (req, res, next) => {
  const postId = (req.params as { id: string }).id;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).send({ error: 'Post not found' });
  }

  return next();
});

// this route is for getting the parent comments of a post
router.get('/', async (req, res, next) => {
  const postId = (req.params as { id: string }).id;

  try {
    const comments = await commentService.getParentCommentsByPostId(postId);

    return res.send(comments);
  } catch (error) {
    const errorMessage = logger.getErrorMessage(error);

    if (/not found/i.test(errorMessage)) {
      return res.status(404).send({ error: errorMessage });
    }

    return next(error);
  }
});

// this route is for getting the replies of a parent comment
router.get('/:parentCommentId', async (req, res, next) => {
  const { parentCommentId } = req.params as { parentCommentId: string };

  try {
    const replies = await commentService.getRepliesByParentCommentId(parentCommentId);

    return res.send(replies);
  } catch (error) {
    const errorMessage = logger.getErrorMessage(error);

    if (/not found/i.test(errorMessage)) {
      return res.status(404).send({ error: errorMessage });
    }

    return next(error);
  }
});

router.post('/', authenticator(), async (req, res, next) => {
  const postId = req.params.id;

  try {
    const newComment: NewComment = {
      post: postId,
      body: parseStringField(req.body.body, 'body'),
      author: req.userToken!.id,
      parentComment: req.body.parentComment,
    };

    await commentService.addComment(newComment);

    return res.status(201).end();
  } catch (error) {
    const errorMessage = logger.getErrorMessage(error);

    if (/not found/i.test(errorMessage)) {
      return res.status(404).send({ error: errorMessage });
    }

    if (/incorrect or missing body/i.test(errorMessage)) {
      return res.status(400).send({ error: errorMessage });
    }

    return next(error);
  }
});

router.delete('/:commentId', authenticator(), async (req, res, next) => {
  const { commentId } = req.params;

  try {
    await commentService.deleteCommentById(commentId);

    return res.status(204).end();
  } catch (error) {
    const errorMessage = logger.getErrorMessage(error);

    if (/not found/i.test(errorMessage)) {
      return res.status(404).send({ error: errorMessage });
    }

    return next(error);
  }
});

export default router;

import express from 'express';
import postService from '../services/post-service';
import { authenticator } from '../utils/middleware';
import fieldParsers, { parseStringField } from '../utils/field-parsers';
import logger from '../utils/logger';
import cloudinary from '../utils/cloudinary';
import { User } from '../mongo';

const router = express.Router();

router.get('/:id', authenticator(), async (req, res) => {
  const post = await postService.getPost(req.params.id);
  if (!post) return res.status(404).end();
  return res.send(post);
});

router.post('/', authenticator(), async (req, res, next) => {
  let post;
  const user = await User.findById(req.userToken!.id);

  try {
    post = fieldParsers.proofPostFields(req.body);
  } catch (error) {
    logger.error(logger.getErrorMessage(error));
    return res.status(400).send({ error: logger.getErrorMessage(error) });
  }

  try {
    const imageUrl = await cloudinary.upload(post.image);
    post.image = imageUrl;
  } catch (error) {
    logger.error(logger.getErrorMessage(error));
    return res.status(500).send({ error: 'Something went wrong uploading the photo!' });
  }

  try {
    const savedPost = await postService.addPost(post, req.userToken!.id);
    user.posts = [...user.posts, savedPost];
    await user.save();
    return res.status(201).send(savedPost);
  } catch (error) {
    logger.error(logger.getErrorMessage(error));
    // TODO: destroy the image if saving post fails?
    return next(error);
  }
});

router.put('/:id', authenticator(), async (req, res, next) => {
  const updatedPostFields = req.body;

  try {
    if (updatedPostFields.caption) updatedPostFields.caption = parseStringField(updatedPostFields.caption, 'caption');
  } catch (error) {
    logger.error(logger.getErrorMessage(error));
    return res.status(400).send({ error: logger.getErrorMessage(error) });
  }

  try {
    const updatedPost = await postService.updatePostById(
      updatedPostFields,
      req.params.id,
      req.userToken!.id,
    );
    return res.status(200).send(updatedPost);
  } catch (error) {
    const errorMessage = logger.getErrorMessage(error);
    logger.error(errorMessage);
    if (errorMessage === 'Unauthorized') return res.status(401).send({ error: errorMessage });

    return next(error);
  }
});

// TODO: write a delete route

export default router;

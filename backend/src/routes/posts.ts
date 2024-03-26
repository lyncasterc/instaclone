import express from 'express';
import commentRouter from './comments';
import postService from '../services/post-service';
import { authenticator } from '../utils/middleware';
import fieldParsers, { parseStringField } from '../utils/field-parsers';
import logger from '../utils/logger';
import cloudinary from '../utils/cloudinary';
import { User } from '../mongo';
import { NewPostFields, Image } from '../types';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const post = await postService.getPost(req.params.id);
  if (!post) return res.status(404).end();
  return res.send(post);
});

router.post('/', authenticator(), async (req, res, next) => {
  let newPostFields: NewPostFields;
  let image: Image | undefined;
  const user = await User.findById(req.userToken!.id);

  try {
    newPostFields = fieldParsers.proofPostFields(req.body);
  } catch (error) {
    return res.status(400).send({ error: logger.getErrorMessage(error) });
  }

  try {
    image = await cloudinary.upload(newPostFields.imageDataUrl);
  } catch (error) {
    return res.status(500).send({ error: 'Something went wrong uploading the photo!' });
  }

  try {
    const savedPost = await postService.addPost({
      caption: newPostFields.caption,
      image,
    }, req.userToken!.id);
    user.posts = [...user.posts, savedPost];
    await user.save();
    return res.status(201).send(savedPost);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', authenticator(), async (req, res, next) => {
  const updatedPostFields = req.body;

  try {
    if (updatedPostFields.caption) updatedPostFields.caption = parseStringField(updatedPostFields.caption, 'caption');
  } catch (error) {
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

    if (errorMessage === 'Unauthorized') return res.status(401).send({ error: errorMessage });

    return next(error);
  }
});

router.delete('/:id', authenticator(), async (req, res, next) => {
  try {
    await postService.deletePostById(req.params.id, req.userToken!.id);
    return res.status(204).end();
  } catch (error) {
    const errorMessage = logger.getErrorMessage(error);

    if (/unauthorized/i.test(errorMessage)) {
      return res.status(401).send({ error: errorMessage });
    }

    if (/post not found/i.test(errorMessage)) {
      return res.status(404).send({ error: errorMessage });
    }

    return next(error);
  }
});

router.use('/:id/comments', commentRouter);

export default router;

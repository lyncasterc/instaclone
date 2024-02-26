import express from 'express';
import postService from '../services/post-service';
import { authenticator } from '../utils/middleware';
import fieldParsers, { parseStringField } from '../utils/field-parsers';
import logger from '../utils/logger';
import cloudinary from '../utils/cloudinary';
import { User } from '../mongo';
import { NewPostFields, Image } from '../types';

const router = express.Router();

// TODO: remove authenticator from this. instagram allows this.
router.get('/:id', authenticator(), async (req, res) => {
  const post = await postService.getPost(req.params.id);
  if (!post) return res.status(404).end();
  return res.send(post);
});

router.post('/', authenticator(), async (req, res, next) => {
  let newPostFields: NewPostFields;
  let image: Image | undefined;
  // TODO: check if the user exists before proceeding?
  // or should that happen in the authenticator middleware?
  const user = await User.findById(req.userToken!.id);

  try {
    newPostFields = fieldParsers.proofPostFields(req.body);
  } catch (error) {
    logger.error(logger.getErrorMessage(error));
    return res.status(400).send({ error: logger.getErrorMessage(error) });
  }

  try {
    image = await cloudinary.upload(newPostFields.imageDataUrl);
  } catch (error) {
    logger.error(logger.getErrorMessage(error));
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
    logger.error(logger.getErrorMessage(error));
    // TODO: destroy the image if saving post fails?
    return next(error);
  }
});

router.put('/:id', authenticator(), async (req, res, next) => {
  const updatedPostFields = req.body;

  try {
    // TODO: this check will not be necessary,
    // the only thing that will be updated for now on a post will be the capton
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

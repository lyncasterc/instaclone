import express from 'express';
import userService from '../services/user-service';
import fieldParsers from '../utils/field-parsers';
import logger from '../utils/logger';
import cloudinary from '../utils/cloudinary';
import { Image, ProofedUpdatedUserFields } from '../types';
import { authenticator } from '../utils/middleware';

const router = express.Router();

router.get('/', async (_req, res) => {
  res.send(await userService.getUsers());
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await userService.getUserById(id);
    if (!user) return res.status(404).end();
    return res.send(user);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const newUser = fieldParsers.proofNewUserFields(req.body);
    const savedNewUser = await userService.addUser(newUser);
    res.status(201).send(savedNewUser);
  } catch (error) {
    res.status(400).send({ error: logger.getErrorMessage(error) });
  }
});

router.put('/:id', authenticator(), async (req, res, next) => {
  let userFields: ProofedUpdatedUserFields;
  let image: Image | undefined;

  // Blocking users from updating personal information of another user
  if (['email', 'imageDataUrl', 'username', 'fullName', 'password'].some((field) => field in req.body)) {
    if (req.params.id !== req.userToken!.id) return res.status(401).send({ error: 'Unauthorized' });
  }

  try {
    userFields = fieldParsers.proofUpdateUserFields(req.body);
  } catch (error) {
    return res.status(400).send({ error: logger.getErrorMessage(error) });
  }

  try {
    if (userFields.imageDataUrl) {
      image = await cloudinary.upload(userFields.imageDataUrl);
    }
  } catch (error) {
    logger.error(logger.getErrorMessage(error));
    return res.status(500).send({ error: 'Something went wrong uploading the photo!' });
  }

  try {
    const updatedUser = await userService.updateUserById({
      fullName: userFields.fullName,
      username: userFields.username,
      email: userFields.email,
      password: userFields.password,
      bio: userFields.bio,
      followers: userFields.followers,
      following: userFields.following,
      image,
    }, req.params.id);
    return res.status(200).send(updatedUser);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id/image', authenticator(), async (req, res, next) => {
  if (req.params.id !== req.userToken!.id) return res.status(401).send({ error: 'Unauthorized' });

  try {
    const updatedUser = await userService.deleteUserImage(req.params.id);
    return res.status(204).send(updatedUser);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id/follow', authenticator(), async (req, res, next) => {
  if (req.params.id === req.userToken!.id) {
    return res.status(400).send({ error: 'You can\'t follow yourself!' });
  }

  try {
    await userService.followUserById(req.userToken!.id, req.params.id);
    return res.status(200).end();
  } catch (error) {
    const errorMessage = logger.getErrorMessage(error);
    const errorResponseObj = { error: errorMessage };

    if (/user not found/i.test(errorMessage)) return res.status(404).send(errorResponseObj);
    if (/you already follow that user/i.test(errorMessage)) return res.status(400).send(errorResponseObj);

    return next(error);
  }
});

router.put('/:id/unfollow', authenticator(), async (req, res, next) => {
  if (req.params.id === req.userToken!.id) {
    return res.status(400).send({ error: 'You can\'t unfollow yourself!' });
  }

  try {
    await userService.unfollowUserById(req.userToken!.id, req.params.id);
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
});

// TODO: write a delete route

export default router;

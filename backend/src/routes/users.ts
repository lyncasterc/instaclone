import express from 'express';
import userService from '../services/user-service';
import fieldParsers from '../utils/field-parsers';
import logger from '../utils/logger';
import cloudinary from '../utils/cloudinary';
import { ProofedUpdatedUser } from '../types';
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
  let userFields: ProofedUpdatedUser;

  // Blocking users from updating personal information of another user
  if (['email', 'image', 'username', 'fullName', 'password'].some((field) => field in req.body)) {
    if (req.params.id !== req.userToken!.id) return res.status(401).send({ error: 'Unauthorized' });
  }

  try {
    userFields = fieldParsers.proofUpdateUserFields(req.body);
  } catch (error) {
    return res.status(400).send({ error: logger.getErrorMessage(error) });
  }

  try {
    if (userFields.image) {
      const imageUrl = await cloudinary.upload(userFields.image);
      userFields.image = imageUrl;
    }
  } catch (error) {
    logger.error(logger.getErrorMessage(error));
    return res.status(500).send({ error: 'Something went wrong uploading the photo!' });
  }

  try {
    const updatedUser = await userService.updateUserById(userFields, req.params.id);
    return res.status(200).send(updatedUser);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id/follow', authenticator(), async (req, res, next) => {
  if (req.params.id === req.userToken!.id) return res.status(400).send({ error: 'You can\'t follow yourself!' });

  try {
    const followedUser = await userService.followUserById(req.userToken!.id, req.params.id);
    return res.status(200).send(followedUser);
  } catch (error) {
    const errorMessage = logger.getErrorMessage(error);
    logger.error(errorMessage);
    const errorResponseObj = { error: errorMessage };

    if (/user not found/i.test(errorMessage)) return res.status(404).send(errorResponseObj);
    if (/you already follow that user/i.test(errorMessage)) return res.status(400).send(errorResponseObj);

    return next(error);
  }
});
// TODO: write a delete route
// TODO: write unfollow route?

export default router;

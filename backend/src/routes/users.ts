import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import userService from '../services/user-service';
import fieldParsers from '../utils/field-parsers';
import logger from '../utils/logger';
import cloudinary from '../utils/cloudinary';

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
// TODO: update this to require authorization token.
// TODO: refactor this to use multiple try/catches, remove the promise chaining
router.put('/:id', async (req, res) => {
  const decodedToken = !req.token
    ? false
    : jwt.verify(
      req.token,
      process.env.SECRET as string,
    ) as JwtPayload;

  if (!decodedToken || !decodedToken.id) {
    return res.status(401).send({ error: 'token missing or invalid.' });
  }
  if (decodedToken.id !== req.params.id) {
    return res.status(401).send({ error: 'Unauthorized request.' });
  }

  try {
    const user = fieldParsers.proofUpdateUserFields(req.body);
    if (user.image) {
      cloudinary.upload(user.image)
        .then((imageUrl) => {
          user.image = imageUrl;
        })
        .catch((error) => {
          logger.error(logger.getErrorMessage(error));
          return res.status(500).send({ error: 'Something went wrong!' });
        });
    }
    const updatedUser = await userService.updateUserById(user, req.params.id);

    return res.status(200).send(updatedUser);
  } catch (error) {
    return res.status(400).send({ error: logger.getErrorMessage(error) });
  }
});

// TODO: write a delete route

export default router;

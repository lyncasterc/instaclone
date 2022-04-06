import express from 'express';
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
    const newUser = fieldParsers.toNewUser(req.body);
    const savedNewUser = await userService.addUser(newUser);
    res.status(201).send(savedNewUser);
  } catch (error) {
    res.status(400).send({ error: logger.getErrorMessage(error) });
  }
});
// TODO: update this to require authorization token.
router.put('/:id', async (req, res) => {
  try {
    const user = fieldParsers.proofUpdatedUser(req.body);
    if (user.image) {
      cloudinary.upload(user.image)
        .then((imageUrl) => {
          user.image = imageUrl;
        })
        .catch((error) => {
          logger.error(logger.getErrorMessage(error));
          res.status(500).send({ error: 'Something went wrong!' });
        });
    }
    const updatedUser = await userService.updateUserById(user, req.params.id);

    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(400).send({ error: logger.getErrorMessage(error) });
  }
});

export default router;

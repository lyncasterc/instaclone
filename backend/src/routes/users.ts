import express from 'express';
import userService from '../services/userService';
import fieldParsers from '../utils/fieldParsers';
import logger from '../utils/logger';

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

export default router;

import express from 'express';
import userService from '../services/userService';

const router = express.Router();

router.get('/', async (_req, res) => {
  res.send(await userService.getUsers());
});

export default router;

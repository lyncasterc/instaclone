import express from 'express';
import { User, Post, Comment } from '../mongo';

const router = express.Router();

router.post('/reset', async (_req, res) => {
  await User.deleteMany();
  await Post.deleteMany();
  await Comment.deleteMany();
  return res.status(204).end();
});

export default router;

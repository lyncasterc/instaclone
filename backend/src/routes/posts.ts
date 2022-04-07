import express from 'express';
import postService from '../services/post-service';
import { authenticator } from '../utils/middleware';

const router = express.Router();

router.get('/:id', authenticator(), async (req, res) => {
  const post = await postService.getPost(req.params.id);
  if (!post) return res.status(404).end();
  return res.send(post);
});

export default router;

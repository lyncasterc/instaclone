import express from 'express';
import { authenticator } from '../utils/middleware';
import logger from '../utils/logger';
import likeService from '../services/like-service';

const router = express.Router();

router.post('/', authenticator(), async (req, res, next) => {
  try {
    await likeService.addLike(req.body);

    return res.status(201).end();
  } catch (error) {
    const errorMessage = logger.getErrorMessage(error);
    logger.error(errorMessage);

    if (/not found/i.test(errorMessage)) {
      return res.status(404).send({ error: errorMessage });
    }

    if (/same entity twice/i.test(errorMessage)) {
      return res.status(400).send({ error: errorMessage });
    }

    return next(error);
  }
});

router.delete('/:entityId', authenticator(), async (req, res, next) => {
  const userId = req.userToken!.id;
  const { entityId } = req.params;

  try {
    await likeService.removeLikeByUserIdAndEntityId({
      user: userId,
      entityId,
    });

    return res.status(204).end();
  } catch (error) {
    const errorMessage = logger.getErrorMessage(error);
    logger.error(errorMessage);

    return next(error);
  }
});

router.get('/:entityId/likeCount', async (req, res, next) => {
  const { entityId } = req.params;

  try {
    const likeCount = await likeService.getLikeCountByEntityId(entityId);

    return res.status(200).send({ likeCount });
  } catch (error) {
    const errorMessage = logger.getErrorMessage(error);
    logger.error(errorMessage);

    return next(error);
  }
});

router.get('/:entityId/likes', async (req, res, next) => {
  const { entityId } = req.params;

  try {
    const likes = await likeService.getLikeUsersByEntityId(entityId);

    return res.status(200).send({ likes });
  } catch (error) {
    const errorMessage = logger.getErrorMessage(error);
    logger.error(errorMessage);

    return next(error);
  }
});

export default router;

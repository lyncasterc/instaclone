import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express from 'express';
import fieldParsers from '../utils/field-parsers';
import logger from '../utils/logger';
import { User } from '../mongo';

const router = express.Router();

router.post('/', async (req, res) => {
  const { body } = req;
  let loginFields: {
    username: string,
    password: string,
  };

  try {
    loginFields = fieldParsers.proofLogInFields(body);
  } catch (error) {
    return res.status(400).send({ error: logger.getErrorMessage(error) });
  }

  try {
    // TODO: populate fields? frontend needs the image and posts of the logged in user.
    const user = await User.findOne({ username: loginFields.username });
    const isUserValidated = !user
      ? false
      : await bcrypt.compare(loginFields.password, user.passwordHash);

    if (!isUserValidated) {
      return res.status(401).send({
        error: 'Invalid username or password.',
      });
    }

    const userTokenInfo = {
      username: user.username,
      id: user.id,
    };

    const token = jwt.sign(
      userTokenInfo,
      process.env.SECRET = 'scrt',
      { expiresIn: 60 * 60 },
    );

    return res.status(200).send({ token, username: user.username });
  } catch (error) {
    return res.status(500).send({ error: 'Something went wrong!' });
  }
});

export default router;

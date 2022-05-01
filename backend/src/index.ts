import http from 'http';
import app from './app';
import logger from './utils/logger';
import config from './utils/config';

const server = http.createServer(app);
const port = config.PORT || 3001;

server.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

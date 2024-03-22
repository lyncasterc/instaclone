import http from 'http';
import app from './app';
import logger from './utils/logger';
import config from './utils/config';
import SocketManager from './utils/SocketManager';

const server = http.createServer(app);
SocketManager.getInstance(server);
const port = config.PORT || 3001;

server.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

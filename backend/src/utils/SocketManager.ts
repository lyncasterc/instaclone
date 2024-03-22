import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import config from './config';
import logger from './logger';

/**
 * Manages the socket connections and events for the server.
 */
class SocketManager {
  private static instance: SocketManager;

  private io: Server;

  private users: Map<string, string>;

  private constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    });

    this.users = new Map();

    this.io.use((socket, next) => {
      const { accessToken, userId } = socket.handshake.auth;
      let decodedToken;

      if (accessToken) {
        try {
          decodedToken = jwt.verify(
            accessToken,
            config.JWT_SECRET || '',
          ) as jwt.JwtPayload;
        } catch (error) {
          const errorMessage = logger.getErrorMessage(error);
          logger.error(errorMessage);
        }
      }

      if (
        !accessToken
        || !userId
        || !decodedToken
        || !decodedToken.id
        || decodedToken.id !== userId
        || !decodedToken.username
      ) {
        return next(new Error('invalid token'));
      }

      return next();
    });

    this.io.on('connection', (socket) => {
      const { userId } = socket.handshake.auth;
      const socketId = socket.id;

      this.users.set(userId, socketId);

      logger.info({
        message: 'user connected',
        userId,
        socketId,
      });

      socket.on('disconnect', () => {
        this.users.delete(userId);

        logger.info({
          message: 'user disconnected',
          userId,
          socketId,
        });
      });
    });

    logger.info('SocketManager initialized');
  }

  /**
   * Returns the singleton instance of the SocketManager class.
   * If the instance does not exist, it creates a new instance using the provided http.Server.
   * @param server - The http.Server instance to be used for initializing the SocketManager.
   * @returns The singleton instance of the SocketManager class.
   * @throws Error if the SocketManager instance is not initialized and no http.Server is provided.
   */
  public static getInstance(server?: http.Server): SocketManager {
    if (!SocketManager.instance) {
      if (!server) {
        throw new Error('SocketManager requires an http.Server to be initialized');
      }

      SocketManager.instance = new SocketManager(server);
    }

    return SocketManager.instance;
  }
}

export default SocketManager;

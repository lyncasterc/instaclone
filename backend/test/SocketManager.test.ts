/* eslint-disable import/first */
jest.unmock('../src/utils/SocketManager');

import supertest from 'supertest';
import { io, Socket } from 'socket.io-client';
import http from 'http';
import jwt from 'jsonwebtoken';
import { testMongodb } from '../src/mongo';
import app from '../src/app';
import config from '../src/utils/config';
import SocketManager from '../src/utils/SocketManager';
import { User } from '../src/types';
import testHelpers from './helpers/test-helpers';
import logger from '../src/utils/logger';

const api = supertest(app);

const PORT = config.PORT || 3001;
const JWT_SECRET = config.JWT_SECRET || '';
let httpServer: http.Server;
let clientSocket: Socket;
let testUser: User;
let accessToken: string;

beforeAll(() => {
  httpServer = http.createServer();
});

describe('SocketManager.getInstance', () => {
  test('throws error if no http.Server is provided on the first call', () => {
    expect(() => SocketManager.getInstance()).toThrowError(/requires an http.Server/i);
  });

  test('returns an instance of SocketManager if http.Server is provided', () => {
    const socketManager = SocketManager.getInstance(httpServer);
    expect(socketManager).toBeInstanceOf(SocketManager);
  });

  test('returns the same instance of SocketManager if called multiple times', () => {
    const socketManager1 = SocketManager.getInstance(httpServer);
    const socketManager2 = SocketManager.getInstance();
    expect(socketManager1).toBe(socketManager2);
  });

  test('returns the same instance of SocketManager if called multiple times with http.Server', () => {
    const socketManager1 = SocketManager.getInstance(httpServer);
    const socketManager2 = SocketManager.getInstance(httpServer);
    expect(socketManager1).toBe(socketManager2);
  });
});

describe('SocketManager accessToken validation', () => {
  beforeAll(async () => {
    await testMongodb.connect();
    SocketManager.getInstance(httpServer);
    httpServer.listen(PORT);
  });

  beforeEach(async () => {
    await testMongodb.clear();

    testUser = await testHelpers.createTestUser({
      username: 'bobbybo1',
      fullName: 'Bobby Bo',
      email: 'bobby@email.com',
      password: 'secret',
    });

    const response = await api
      .post('/api/auth/login')
      .send({
        username: testUser.username,
        password: 'secret',
      })
      .expect(200);

    accessToken = response.body.accessToken;
  });

  afterEach(() => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  afterAll(async () => {
    await testMongodb.close();
    httpServer.close();
  });

  test('should fire connect_error on client when no accessToken is provided', (done) => {
    clientSocket = io(`http://localhost:${PORT}`);

    clientSocket.on('connect_error', (error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('invalid token');
      done();
    });

    clientSocket.on('connect', () => {
      done('should not connect');
    });
  });

  test('should fire connect_error on client if invalid accessToken is provided', (done) => {
    clientSocket = io(`http://localhost:${PORT}`, {
      auth: {
        accessToken: 'faketoken',
      },
    });

    clientSocket.on('connect_error', (error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('invalid token');
      done();
    });

    clientSocket.on('connect', () => {
      done('should not connect');
    });
  });

  test('should fire connect_error if accessToken is valid but userId is missing', (done) => {
    clientSocket = io(`http://localhost:${PORT}`, {
      auth: {
        accessToken,
      },
    });

    clientSocket.on('connect_error', (error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('invalid token');
      done();
    });

    clientSocket.on('connect', () => {
      done('should not connect');
    });
  });

  test('should fire connect_error if accessToken is valid but userId does not match decoded token user id', (done) => {
    clientSocket = io(`http://localhost:${PORT}`, {
      auth: {
        accessToken,
        userId: 'fakeid',
      },
    });

    clientSocket.on('connect_error', (error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('invalid token');
      done();
    });

    clientSocket.on('connect', () => {
      done('should not connect');
    });
  });

  test('should fire connect_error if accessToken is expired', (done) => {
    const accessTokenInfo = {
      username: testUser.username,
      id: testUser.id,
    };

    const expiredAccessToken = jwt.sign(
      accessTokenInfo,
      JWT_SECRET,
      { expiresIn: '-1ms' },
    );

    clientSocket = io(`http://localhost:${PORT}`, {
      auth: {
        accessToken: expiredAccessToken,
        userId: testUser.id,
      },
    });

    clientSocket.on('connect_error', (error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('invalid token');
      done();
    });

    clientSocket.on('connect', () => {
      done('should not connect');
    });
  });

  test('should connect successfully if valid accessToken and userId are provided', (done) => {
    clientSocket = io(`http://localhost:${PORT}`, {
      auth: {
        accessToken,
        userId: testUser.id,
      },
    });

    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });

    clientSocket.on('connect_error', (error) => {
      done('connect_error should not fire: ', error);
    });
  });
});

describe('SocketManager.emitNotification', () => {
  beforeAll(async () => {
    await testMongodb.connect();
    SocketManager.getInstance(httpServer);
    httpServer.listen(PORT);
  });

  beforeEach(async () => {
    await testMongodb.clear();

    testUser = await testHelpers.createTestUser({
      username: 'bobbybo1',
      fullName: 'Bobby Bo',
      email: 'bobby@email.com',
      password: 'secret',
    });

    const response = await api
      .post('/api/auth/login')
      .send({
        username: testUser.username,
        password: 'secret',
      })
      .expect(200);

    accessToken = response.body.accessToken;
  });

  afterEach(() => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }

    jest.resetAllMocks();
  });

  afterAll(async () => {
    await testMongodb.close();
    httpServer.close();
  });

  test('should emit notification to the user if they are connected', (done) => {
    const loggerInfoSpy = jest.spyOn(logger, 'info');

    clientSocket = io(`http://localhost:${PORT}`, {
      auth: {
        accessToken,
        userId: testUser.id,
      },
    });

    clientSocket.on('connect', () => {
      SocketManager.getInstance().emitNotification(testUser.id, 'like');
    });

    clientSocket.on('notification', (notification) => {
      expect(notification).toBe('like');

      const loggerInfoCalls = loggerInfoSpy.mock.calls.flat().map((call) => call?.message);
      expect(loggerInfoCalls).toContain('notification sent');

      clientSocket.disconnect();
      done();
    });
  });

  test('should not emit notification to a user if they are not connected', (done) => {
    const loggerInfoSpy = jest.spyOn(logger, 'info');

    clientSocket = io(`http://localhost:${PORT}`, {
      auth: {
        accessToken,
        userId: testUser.id,
      },
    });

    clientSocket.on('connect', () => {
      console.log('client connected');
      clientSocket.disconnect();
    });

    setTimeout(() => {
      SocketManager.getInstance().emitNotification(testUser.id, 'like');

      const loggerInfoCalls = loggerInfoSpy.mock.calls.flat().map((call) => call?.message);

      expect(loggerInfoCalls).not.toContain('notification sent');

      done();
    }, 1500);

    clientSocket.on('notification', () => {
      done('should not receive notification');
    });
  });
});

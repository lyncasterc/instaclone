// Mocking the SocketManager class for all tests
jest.mock('../src/utils/SocketManager', () => {
  const socketManagerInstance = {
    emitNotification: jest.fn(),
  };

  return {
    getInstance: jest.fn(() => socketManagerInstance),
  };
});

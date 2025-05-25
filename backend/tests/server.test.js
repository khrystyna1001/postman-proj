require('./setup.test');

const request = require('supertest');
const { startServer, stopServer } = require('../server');
const axios = require('axios');

jest.mock('axios');

describe('Proxy API', () => {
  let testServer;
  let testPort;

  beforeAll(() => {
    testPort = Math.floor(Math.random() * (65535 - 1024) + 1024);
    testServer = startServer(testPort);
  });

  afterAll(() => {
    stopServer();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should proxy a GET request successfully', async () => {
    const mockResponse = { data: { message: 'Test GET' }, status: 200 };
    axios.mockResolvedValue(mockResponse);

    const response = await request(`http://localhost:${testPort}`)
      .post('/api/proxy')
      .send({
        url: 'http://www.example.com',
        method: 'GET',
        headers: {},
        body: null,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data);
    expect(global.mockSave).toHaveBeenCalledTimes(1);
  });

  it('should handle errors from axios', async () => {
    const mockError = { 
      response: { 
        status: 404, 
        data: { 
          error: 'Not Found' 
        },
        headers: {}, 
      } 
    };
    axios.mockRejectedValue(mockError);

    const response = await request(`http://localhost:${testPort}`)
      .post('/api/proxy')
      .send({
        url: 'http://example.com',
        method: 'GET',
        headers: {},
        body: null,
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Not Found" });
  });
});
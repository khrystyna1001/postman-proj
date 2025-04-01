const request = require('supertest');
const { startServer, stopServer, app } = require('./server');
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
  });

  it('should proxy a GET request successfully', async () => {
    const mockResponse = { data: { message: 'Test GET' } };
    axios.mockResolvedValue(mockResponse);

    const response = await request(`http://localhost:${testPort}`)
      .post('/proxy')
      .send({
        url: 'http://www.example.com',
        method: 'GET',
        headers: {},
        body: null,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.data);
  });

  it('should handle errors from axios', async () => {
    const mockError = { response: { status: 404, data: { message: 'Not Found' } } };
    axios.mockRejectedValue(mockError);

    const response = await request(`http://localhost:${testPort}`)
      .post('/proxy')
      .send({
        url: 'http://example.com',
        method: 'GET',
        headers: {},
        body: null,
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual(mockError.response.data);
  });
});
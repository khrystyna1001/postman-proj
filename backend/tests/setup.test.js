jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  connection: {
    on: jest.fn()
  }
}));

const mockSave = jest.fn().mockImplementation(function() {
  return Promise.resolve(this);
});

const mockFind = jest.fn().mockReturnValue({
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue([])
});

jest.mock('../models/request', () => {
  return jest.fn().mockImplementation(() => ({
    save: mockSave
  }));
});

const originalError = console.error;

beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  jest.clearAllMocks();
});
global.mockSave = mockSave;
global.mockFind = mockFind;

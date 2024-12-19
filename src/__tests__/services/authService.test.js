const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret';

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn()
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_token')
}));

// Mock @prisma/client
const mockCreate = jest.fn();
const mockFindUnique = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      create: mockCreate,
      findUnique: mockFindUnique
    },
    $connect: jest.fn(),
    $disconnect: jest.fn()
  }))
}));

// Import after mocks are set up
const authService = require('../../services/authService');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const mockCreatedUser = {
        id: 1,
        email: mockUser.email,
        name: mockUser.name
      };

      // Set up the mock implementation for this test
      mockCreate.mockResolvedValue(mockCreatedUser);

      // Act
      const result = await authService.register(mockUser);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          email: mockUser.email,
          password: 'hashed_password',
          name: mockUser.name
        },
        select: {
          id: true,
          email: true,
          name: true
        }
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockCreatedUser.id },
        'test-secret',
        { expiresIn: '24h' }
      );
      expect(result).toEqual({
        user: mockCreatedUser,
        token: 'mock_token'
      });
    });

    it('should throw an error if user creation fails', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      mockCreate.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(authService.register(mockUser)).rejects.toThrow('Database error');
    });
  });
}); 
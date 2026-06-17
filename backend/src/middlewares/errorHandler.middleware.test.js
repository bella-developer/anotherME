import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import {
  AppError,
  requestIdMiddleware,
  errorHandler,
  createValidationError,
  createAuthenticationError,
  createNotFoundError,
} from './errorHandler.middleware.js';

describe('Error Handler Middleware', () => {
  describe('AppError', () => {
    it('should create an AppError with correct properties', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR', {
        field: 'test',
      });

      assert.strictEqual(error.message, 'Test error');
      assert.strictEqual(error.statusCode, 400);
      assert.strictEqual(error.code, 'TEST_ERROR');
      assert.deepStrictEqual(error.details, { field: 'test' });
      assert.strictEqual(error.isOperational, true);
    });
  });

  describe('requestIdMiddleware', () => {
    it('should add request ID to request object', () => {
      const req = {};
      const res = {
        setHeader: mock.fn(),
      };
      const next = mock.fn();

      requestIdMiddleware(req, res, next);

      assert.ok(req.id, 'Request ID should be set');
      assert.strictEqual(typeof req.id, 'string');
      assert.strictEqual(res.setHeader.mock.calls.length, 1);
      assert.strictEqual(res.setHeader.mock.calls[0].arguments[0], 'X-Request-Id');
      assert.strictEqual(next.mock.calls.length, 1);
    });
  });

  describe('errorHandler', () => {
    it('should handle AppError correctly', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR');
      const req = { id: 'test-id', path: '/test', method: 'GET' };
      const res = {
        status: mock.fn(function (code) {
          return this;
        }),
        json: mock.fn(),
        setHeader: mock.fn(),
      };
      const next = mock.fn();

      errorHandler(error, req, res, next);

      assert.strictEqual(res.status.mock.calls.length, 1);
      assert.strictEqual(res.status.mock.calls[0].arguments[0], 400);
      assert.strictEqual(res.json.mock.calls.length, 1);

      const response = res.json.mock.calls[0].arguments[0];
      assert.strictEqual(response.status, 'error');
      assert.strictEqual(response.statusCode, 400);
      assert.strictEqual(response.message, 'Test error');
      assert.strictEqual(response.code, 'TEST_ERROR');
      assert.strictEqual(response.requestId, 'test-id');
    });

    it('should default to 500 for unknown errors', () => {
      const error = new Error('Unknown error');
      const req = { id: 'test-id', path: '/test', method: 'GET' };
      const res = {
        status: mock.fn(function (code) {
          return this;
        }),
        json: mock.fn(),
        setHeader: mock.fn(),
      };
      const next = mock.fn();

      errorHandler(error, req, res, next);

      assert.strictEqual(res.status.mock.calls[0].arguments[0], 500);
      const response = res.json.mock.calls[0].arguments[0];
      assert.strictEqual(response.statusCode, 500);
      assert.strictEqual(response.code, 'INTERNAL_ERROR');
    });

    it('should handle validation errors', () => {
      const error = {
        name: 'ValidationError',
        errors: {
          field1: { path: 'field1', message: 'Field 1 is required' },
        },
      };
      const req = { id: 'test-id', path: '/test', method: 'POST' };
      const res = {
        status: mock.fn(function (code) {
          return this;
        }),
        json: mock.fn(),
        setHeader: mock.fn(),
      };
      const next = mock.fn();

      errorHandler(error, req, res, next);

      assert.strictEqual(res.status.mock.calls[0].arguments[0], 400);
      const response = res.json.mock.calls[0].arguments[0];
      assert.strictEqual(response.code, 'VALIDATION_ERROR');
      assert.ok(Array.isArray(response.details));
    });

    it('should handle JWT errors', () => {
      const error = { name: 'JsonWebTokenError', message: 'Invalid token' };
      const req = { id: 'test-id', path: '/test', method: 'GET' };
      const res = {
        status: mock.fn(function (code) {
          return this;
        }),
        json: mock.fn(),
        setHeader: mock.fn(),
      };
      const next = mock.fn();

      errorHandler(error, req, res, next);

      assert.strictEqual(res.status.mock.calls[0].arguments[0], 401);
      const response = res.json.mock.calls[0].arguments[0];
      assert.strictEqual(response.code, 'INVALID_TOKEN');
    });
  });

  describe('Error helper functions', () => {
    it('should create validation error', () => {
      const error = createValidationError('Invalid input', { field: 'test' });
      assert.strictEqual(error.statusCode, 400);
      assert.strictEqual(error.code, 'VALIDATION_ERROR');
    });

    it('should create authentication error', () => {
      const error = createAuthenticationError();
      assert.strictEqual(error.statusCode, 401);
      assert.strictEqual(error.code, 'AUTHENTICATION_ERROR');
    });

    it('should create not found error', () => {
      const error = createNotFoundError();
      assert.strictEqual(error.statusCode, 404);
      assert.strictEqual(error.code, 'NOT_FOUND');
    });
  });
});

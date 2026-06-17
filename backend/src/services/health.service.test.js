import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { checkHealth } from './health.service.js';

describe('Health Service', () => {
  before(async () => {
    await connectDatabase();
  });

  after(async () => {
    await disconnectDatabase();
  });

  it('should return health status with database connection', async () => {
    const health = await checkHealth();
    
    assert.strictEqual(typeof health, 'object');
    assert.strictEqual(typeof health.status, 'string');
    assert.strictEqual(typeof health.timestamp, 'string');
    assert.strictEqual(typeof health.uptime, 'number');
    assert.strictEqual(typeof health.database, 'object');
    assert.strictEqual(typeof health.responseTime, 'string');
    assert.strictEqual(typeof health.environment, 'string');
  });

  it('should include database connection status', async () => {
    const health = await checkHealth();
    
    assert.strictEqual(health.database.connected, true);
    assert.strictEqual(health.database.status, 'connected');
    assert.ok(health.database.message);
    assert.ok(health.database.pingTime);
    assert.strictEqual(health.database.readyState, 1);
  });

  it('should return ok status when database is connected', async () => {
    const health = await checkHealth();
    
    assert.strictEqual(health.status, 'ok');
  });

  it('should include response time', async () => {
    const health = await checkHealth();
    
    assert.ok(health.responseTime.endsWith('ms'));
    const responseTime = parseInt(health.responseTime);
    assert.ok(responseTime >= 0);
  });
});

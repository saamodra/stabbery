import express from 'express';
import { Mock } from '../models/Mock.js';
import { RequestLog } from '../models/RequestLog.js';
import { validateMockData } from '../validators/mockValidator.js';

const router = express.Router();

// Get all mocks
router.get('/mocks', async (req, res) => {
  try {
    const mocks = await Mock.findAll();
    res.json(mocks);
  } catch (error) {
    console.error('Error fetching mocks:', error);
    res.status(500).json({ error: 'Failed to fetch mocks' });
  }
});

// Get mock by ID
router.get('/mocks/:id', async (req, res) => {
  try {
    const mock = await Mock.findById(req.params.id);
    if (!mock) {
      return res.status(404).json({ error: 'Mock not found' });
    }
    res.json(mock);
  } catch (error) {
    console.error('Error fetching mock:', error);
    res.status(500).json({ error: 'Failed to fetch mock' });
  }
});

// Create new mock
router.post('/mocks', async (req, res) => {
  try {
    const { error, value } = validateMockData(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const mock = await Mock.create(value);
    res.status(201).json(mock);
  } catch (error) {
    console.error('Error creating mock:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'Mock endpoint already exists for this path and method' });
    } else {
      res.status(500).json({ error: 'Failed to create mock' });
    }
  }
});

// Update mock
router.put('/mocks/:id', async (req, res) => {
  try {
    const { error, value } = validateMockData(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const mock = await Mock.update(req.params.id, value);
    res.json(mock);
  } catch (error) {
    console.error('Error updating mock:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'Mock endpoint already exists for this path and method' });
    } else {
      res.status(500).json({ error: 'Failed to update mock' });
    }
  }
});

// Delete mock
router.delete('/mocks/:id', async (req, res) => {
  try {
    const deleted = await Mock.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Mock not found' });
    }
    res.json({ message: 'Mock deleted successfully' });
  } catch (error) {
    console.error('Error deleting mock:', error);
    res.status(500).json({ error: 'Failed to delete mock' });
  }
});

// Get request logs
router.get('/logs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await RequestLog.findAll(limit);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Clear all logs
router.delete('/logs', async (req, res) => {
  try {
    await RequestLog.deleteAll();
    res.json({ message: 'All logs cleared successfully' });
  } catch (error) {
    console.error('Error clearing logs:', error);
    res.status(500).json({ error: 'Failed to clear logs' });
  }
});

// Test endpoint
router.post('/test-endpoint', async (req, res) => {
  try {
    const { method, path, headers = {}, body = null } = req.body;
    
    if (!method || !path) {
      return res.status(400).json({ error: 'Method and path are required' });
    }

    // Make request to the mock server
    const testUrl = `http://localhost:3001${path}`;
    const axios = (await import('axios')).default;
    
    try {
      const response = await axios({
        method: method.toLowerCase(),
        url: testUrl,
        headers,
        data: body,
        validateStatus: () => true // Don't throw on any status code
      });

      res.json({
        status: response.status,
        headers: response.headers,
        data: response.data
      });
    } catch (testError) {
      res.json({
        error: 'Request failed',
        message: testError.message
      });
    }
  } catch (error) {
    console.error('Error testing endpoint:', error);
    res.status(500).json({ error: 'Failed to test endpoint' });
  }
});

export { router as adminRoutes };
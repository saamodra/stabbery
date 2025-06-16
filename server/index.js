import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initDatabase } from './database/init.js';
import { adminRoutes } from './routes/adminRoutes.js';
import { dynamicMockMiddleware } from './middleware/dynamicMock.js';
import { requestLogger } from './middleware/requestLogger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
await initDatabase();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

// Request logging middleware
app.use(requestLogger);

// Admin API routes (for managing mocks)
app.use('/admin', adminRoutes);

// Dynamic mock middleware - handles all other routes
app.use(dynamicMockMiddleware);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `No mock endpoint configured for ${req.method} ${req.path}`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin panel available at http://localhost:5173`);
});

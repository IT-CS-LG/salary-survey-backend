import express from 'express';
import cors from 'cors';
import profileRoutes from './routes/profiles.js';
import benefitsRoutes from './routes/benefits.js';
import rolesRoutes from './routes/roles.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// More permissive CORS settings
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Basic ping endpoint
app.get('/ping', (req, res) => {
  console.log('Ping endpoint hit');
  res.status(200).send('pong');
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Test endpoint
app.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.status(200).send('Hello from the backend!');
});

// Routes
app.use('/api/profiles', profileRoutes);
app.use('/api/benefits', benefitsRoutes);
app.use('/api/roles', rolesRoutes);

// Error handling
app.use(errorHandler);

// Log when server starts
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /ping');
  console.log('- GET /test');
  console.log('- /api/profiles');
  console.log('- /api/benefits');
  console.log('- /api/roles');
}); 
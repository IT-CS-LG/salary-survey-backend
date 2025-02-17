import express from 'express';
import cors from 'cors';
import profileRoutes from './routes/profiles.js';
import benefitsRoutes from './routes/benefits.js';
import rolesRoutes from './routes/roles.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Basic test route
app.get('/test', (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({
      message: 'API is working'
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).send({
      error: 'Internal server error'
    });
  }
});

// Routes
app.use('/api/profiles', profileRoutes);
app.use('/api/benefits', benefitsRoutes);
app.use('/api/roles', rolesRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
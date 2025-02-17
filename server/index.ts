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
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Simple test route
app.get('/test', (req, res) => {
  res.send('Hello from the backend!');
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
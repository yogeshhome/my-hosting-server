import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const startTime = new Date();

console.log(`🚀 App starting at ${startTime.toISOString()}...`);

// DB connection
const cleanUrl = process.env.DB_URL.replace(/\/+$/, '');
mongoose.connect(`${cleanUrl}/${process.env.DB_NAME}`)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Health check endpoint for Kubernetes probes
app.get('/health', (req, res) => {
  console.log(`[HEALTH CHECK] ${new Date().toISOString()} - Responding with status OK`);
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});

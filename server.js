const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const generateRoute = require('./routes/generate');

dotenv.config();

const app = express();

// 🔐 Security Middleware
app.use(helmet()); // Secure headers
app.use(cors({ origin: '*' })); // Replace * with domain on prod
app.use(express.json({ limit: '10kb' })); // Prevent body attacks
app.use(xss()); // Prevent XSS

// 🔒 Rate Limiter (DDoS protection)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 100, // limit each IP
  message: 'Too many requests from this IP, try again later',
});
app.use('/api', limiter);

// ✅ Routes
app.use('/api/generate', generateRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const generateRoute = require("./routes/generate");

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(xss());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// ✅ Use the imported route directly
app.use("/api/generate", generateRoute);

// Catch-all
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

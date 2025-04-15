require('dotenv').config();;
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const { StreamChat } = require('stream-chat');
const OpenAI = require('openai');
const { connectToDatabase } = require('./src/config/database');
const { responseHandler } = require('./src/middlewares/responseHandler');
const routes = require('./src/routes');

// Connect to database
connectToDatabase();
// Create Express app
const app = express();


const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize Socket.io
if (!process.env.STREAM_API_KEY || !process.env.STREAM_API_SECRET) {
  throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be defined in the environment variables.");
}

const chatClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

// Initialize OpenAI (GPT-4)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy!" });
});

// API routes
app.use("/api/v1", routes);


// Handle unsupported routes
app.all("*", (req, res) => {
  return responseHandler(null, res, "Invalid Route !!", 404);
});


// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated gracefully");
  });
});

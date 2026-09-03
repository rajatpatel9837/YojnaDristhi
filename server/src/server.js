const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { connectDB } = require('./config/db');

let PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

function startServer(portToUse) {
  const server = app.listen(portToUse, () => {
    console.log(`====================================================`);
    console.log(`🚀 Yojna दृष्टि Backend Server running on port ${portToUse}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && !process.env.PORT && portToUse === 5000) {
      console.warn(`⚠️  Port 5000 in use (e.g. macOS AirPlay). Automatically switching to port 5001...`);
      startServer(5001);
    } else {
      console.error(`Server listen error on port ${portToUse}:`, err.message);
    }
  });
}

startServer(PORT);

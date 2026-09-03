const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log('🚀 Starting Yojna दृष्टि Full-Stack Platform');
console.log('📍 Backend:  http://localhost:5001');
console.log('📍 Frontend: http://localhost:5173');
console.log('====================================================');

const rootDir = path.join(__dirname, '..');

const server = spawn('npm', ['run', 'dev'], {
  cwd: path.join(rootDir, 'server'),
  stdio: 'inherit'
});

const client = spawn('npm', ['run', 'dev'], {
  cwd: path.join(rootDir, 'client'),
  stdio: 'inherit'
});

const shutdown = () => {
  console.log('\nStopping Yojna दृष्टि servers...');
  try { server.kill(); } catch (e) {}
  try { client.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = {
  apps: [
    {
      name: 'yojnasetu-backend',
      script: './server/src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        MONGO_URI: 'mongodb://localhost:27017/yojnasetu',
        ML_SERVICE_URL: 'http://127.0.0.1:8000'
      }
    },
    {
      name: 'yojnasetu-ml-service',
      script: 'uvicorn',
      args: 'main:app --host 127.0.0.1 --port 8000',
      cwd: './ml_service',
      interpreter: 'python',
      env: {
        PYTHONUNBUFFERED: '1'
      }
    }
  ]
};

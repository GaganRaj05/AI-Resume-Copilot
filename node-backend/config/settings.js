
const config = {
  database: {
    url: process.env?.MONGODB_URL,
  },
  server: {
    port: process.env?.PORT || 8000,
    environment: process.env?.NODE_ENV || "prod",
  },
  security: {
    secretKey: process.env.SECRET_KEY,
  },
  allowed_origins:{
    frontend:process.env?.ALLOWED_CLIENT1 || "http://localhost:5173",
    ai_service: process.env?.ALLOWED_CLIENT2 || "http://localhost:6000"
  }
};

const requiredKeys = ['SECRET_KEY', 'MONGODB_URL'];
const missingKeys = requiredKeys.filter(key => !process.env[key]);

if (missingKeys.length > 0) {
  
  throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`);
}

module.exports = {
  MONGODB_URL: config.database.url,
  NODE_ENV: config.server.environment,
  PORT: config.server.port,
  SECRET_KEY: config.security.secretKey,
  ALLOWED_ORIGINS:[config.allowed_origins.frontend, config.allowed_origins.ai_service],
  config,
};
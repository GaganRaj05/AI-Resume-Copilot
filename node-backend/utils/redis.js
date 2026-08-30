const { Redis } = require('ioredis');
const logger = require('../config/logger');
const { REDIS_URL } = require('../config/settings');

let redis = null;
let isConnecting = false;

const connectToRedis = () => {
    if (isConnecting || redis) {
        return redis;
    }

    try {
        isConnecting = true;

        redis = new Redis(REDIS_URL,{
            retryDelayOnFailover: 1000,
            maxRetriesPerRequest: null,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                logger.warn(`Retrying Redis connection (attempt ${times})`);
                return delay;
            }
        });

        redis.on('connect', () => {
            logger.info('Redis connected successfully');
            isConnecting = false;
        });

        redis.on('ready', () => {
            logger.info('Redis is ready to accept commands');
        });

        redis.on('error', (err) => {
            logger.error({ err: err.message, stack: err.stack }, 'Redis error');
        });

        redis.on('close', () => {
            logger.warn('Redis connection closed');
            isConnecting = false;
        });

        redis.on('reconnecting', (delay) => {
            logger.info(`Redis reconnecting in ${delay}ms`);
        });

        redis.on('end', () => {
            logger.error('Redis connection ended permanently');
            isConnecting = false;
            redis = null;
        });

        return redis;
    } catch (err) {
        logger.error({ err: err.message, stack: err.stack }, 'Failed to connect to Redis');
        isConnecting = false;
        redis = null;
        throw err; 
    }
};

connectToRedis();

const getRedis = () => {
    if (!redis) {
        logger.warn('Redis not connected, attempting to reconnect...');
        return connectToRedis();
    }
    return redis;
};

const closeRedis = async () => {
    if (redis) {
        try {
            await redis.quit();
            logger.info('Redis connection closed gracefully');
        } catch (err) {
            logger.error({ err: err.message }, 'Error closing Redis connection');
        }
    }
};

module.exports = {
    redis,
    getRedis,
    closeRedis,
    connectToRedis
};
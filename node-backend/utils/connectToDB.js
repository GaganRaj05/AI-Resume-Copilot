const mongoose = require('mongoose');
const logger = require('../config/logger');

const connectToDb = async(url) => {
    try{
        await mongoose.connect(url)
        logger.info('MongoDB connected successfully');
    }
    catch(err) {
        logger.error({err:err.message}, "MongoDB connection failed");
        throw err
    }
}

module.exports = connectToDb;
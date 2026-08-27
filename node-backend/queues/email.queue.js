const {Queue} = require('bullmq');
const {redis} = require('../utils/redis');

const emailQueue = new Queue('email-queue', {
    connection:redis,
    defaultJobOptions: {
        attempts:10,
        backoff: {
            type:'exponential',
            delay:2000
        },
        removeOnComplete: {
            count:100,
        }
    }
})

module.exports = emailQueue
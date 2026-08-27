const {Worker} = require('bullmq');
const {redis} = require('../../utils/redis');
const logger = require('../../config/logger');
const emailService = require('../../services/email.service');

const emailWorker = new Worker('email-queue', async(job) => {
    logger.info(`Processing job: ${job.name}, (ID: ${job.id})`)
    try{
        const { email_type, receiver} = job.data;

        if(!email_type || !receiver) throw new Error('Insufficient Data')
        await emailService({receiver:receiver, email_type:email_type  })        
    }
    catch(err) {
        logger.error({err:err.message}, `Job failed: ${job.name} (ID: ${job.id})`);
        throw err;
    }
}, {
    connection:redis,
    concurrency:5,
    limiter: {
        max:10,
        duration:1000
    }
})
emailWorker.on('completed', (job, returnvalue) => {
  logger.info(`Job ${job.id} completed!`);
});


emailWorker.on('failed', (job, err) => {
  logger.info({err:err.message},`Job ${job.id} failed:`);
});

emailWorker.on('stalled', (job) => {
  logger.warn(`Job ${job.name} stalled! (ID: ${job.id})`);
});


module.exports = emailWorker;
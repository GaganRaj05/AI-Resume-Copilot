const emailQueue = require("./email.queue");
const emailWorker = require("./workers/email.worker");

module.exports = {
    emailQueue:require('./email.queue'),
    emailWorker:require('./workers/email.worker')
};
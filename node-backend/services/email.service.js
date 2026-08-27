const logger = require('../config/logger');
const {GOOGLE_APP_PASSWORD, GOOGLE_GMAIL_ID} = require('../config/settings');
const nodemailer = require('nodemailer');
const email_templates = require('../templates/emails')


let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user:GOOGLE_GMAIL_ID,
        pass:GOOGLE_APP_PASSWORD
    }
})

const emailService = async(job) => {
    try {
        const { email_type, receiver} = job;
        switch(email_type) {
            case 'onboarding': {
                const html = email_templates?.onboarding?.html;
                if (!html) throw new Error('Html content empty');
                const mailOptions = {
                    from:GOOGLE_GMAIL_ID,
                    to:receiver,
                    subject:"You're on the AGENTCV waitlist",
                    html:html
                }
                await transporter.sendMail(mailOptions);
                logger.info(`Email sent to ${receiver} successfully`)
                return;
            }
            default:{
                throw new Error(`Unknown Job Type`)
            }
        } 
    }
    catch(err) {
        logger.error({err:err.message}, 'An error occured in email service');
        throw err
    }
}

module.exports = emailService;
const rateLimit = require('express-rate-limit');


const LIMIT = 5;
const WINDOW_SEC = 60 * 60

const normalLimiter = rateLimit({
    windowMs:10*60*10000,
    max:LIMIT,
    message: {
        status:429,
        success:false, msg:"To many requests try again"
    },
    standardHeaders:true,
    legacyHeaders:false
});




module.exports = { normalLimiter}
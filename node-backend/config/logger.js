const pino = require('pino');
const {NODE_ENV} = require('./settings');

const isProduction = NODE_ENV === "dev" ? false:true

const logger = pino({
    level:isProduction ? "debug":"info",
    transport:!isProduction? {target:'pino-pretty',options:{colorize:true}}:undefined 
})

module.exports = logger
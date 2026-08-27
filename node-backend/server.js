require('dotenv').config()
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const express = require('express')
const connectToDb = require('./utils/connectToDB');
const logger = require('./config/logger');
const earlyRoutes = require('./routes/early');

const {MONGODB_URL, ALLOWED_ORIGINS, PORT} = require('./config/settings')

connectToDb(MONGODB_URL);

const app = express()
app.use(helmet())
app.use(process.env.NODE_ENV === "dev" ? morgan('dev'):morgan('combined', {stream:{
    write:(message)=>logger.info({msg:message.trim()})
}}))

app.use(cors({
    origin:ALLOWED_ORIGINS,
    methods:['GET','PUT', 'POST','PATCH','DELETE']
}))
app.use(express.json());
app.use("/api/v1/early-users",earlyRoutes )


app.listen(PORT, logger.info(`Server started at PORT: ${PORT}`))


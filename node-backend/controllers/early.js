const logger = require('../config/logger');
const EarlyUsers = require('../models/Early_Users')

const saveEarlyUser = async(req, res)=> {
    try{
        const {email} = req.body;
        if (!email) return res.status(403).json({"success":false, "msg":"Insufficient Data"})
        
        const existing = await EarlyUsers.findOne({"email":email});
        if(existing) return res.status(409).json({"success":false, "msg":"Email Taken"})
            
        await EarlyUsers.create({
            email,
        })

        return res.status(201).json({"success":true, "msg":"Signup successfull"});
    }
    catch(err) {
        logger.error({err:err.message},"Application error");
        return res.status(500).json({"success":false, "msg":"Server error"});
    }
}

module.exports = {saveEarlyUser};
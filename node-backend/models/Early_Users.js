const mongoose = require('mongoose');

const earlyUsersSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
});

const EarlyUsers = mongoose.model('Early_Users', earlyUsersSchema);
module.exports = EarlyUsers;
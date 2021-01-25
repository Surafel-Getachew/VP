const mongoose = require("mongoose");
const UserProfileSchema = mongoose.Schema({
    avatar:{
        type:Buffer
    },
    name:{
        type:String
    },
    gender: {
        type:String
    },
    profileOwner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    }
});

UserProfileSchema.index({name:"text"});
module.exports = mongoose.model("userProfile",UserProfileSchema);
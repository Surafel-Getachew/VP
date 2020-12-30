const mongoose = require("mongoose");

const GroupVideoChatSchema = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    start:{
        type:Date,
        required:true
    },
    end: {
        type:Date,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    category: {
        type: [String],
      },
    avatar: {
        type:Buffer
    },
    roomOwner: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"psychiatrist"
    },
});

module.exports = mongoose.model("groupVideoChat",GroupVideoChatSchema)
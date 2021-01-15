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
        type: String,
        required:true
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

GroupVideoChatSchema.index({name:"text"})

module.exports = mongoose.model("groupVideoChat",GroupVideoChatSchema)
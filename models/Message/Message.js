const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
    textMessage:{
        type:String
    },
    sender: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"psychiatrist"
    },
    reciver: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"psychiatrist"
    },
},{
    timestamps:true
}
);

module.exports = mongoose.model("message",MessageSchema);
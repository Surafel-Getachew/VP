const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    }
})

module.exports = mongoose.model("task",taskSchema);
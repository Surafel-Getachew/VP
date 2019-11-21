const mongoose = require("mongoose");

const ArticleSchema =  mongoose.Schema({
    Header: {
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    Date:{
        type:Date,
        default:Date.now()
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"psychiatrist"
    }
});

module.exports = mongoose.model("article",ArticleSchema);
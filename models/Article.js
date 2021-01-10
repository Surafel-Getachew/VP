const mongoose = require("mongoose");

const ArticleSchema =  mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    articleTag:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"psychiatrist"
    }
});

ArticleSchema.index({title:"text"});

module.exports = mongoose.model("article",ArticleSchema);
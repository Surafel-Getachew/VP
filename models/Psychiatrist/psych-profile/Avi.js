const mongoose = require("mongoose");

const Avi = mongoose.Schema({
    avatar:{
        type:Buffer  
    },
    name:{
        type:String
    },
    aviOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "psychiatrist",
      },
});

module.exports = mongoose.model("avi",Avi);
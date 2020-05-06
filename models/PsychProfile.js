const mongoose = require("mongoose");

const PsychProfileSchema = mongoose.Schema({

    GraduatedFrom:{
        type:String,
        require:true
    },
    
    work_experience:{
        type:Number,
        required:true
    },

    specialization:{
        type:String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"psychiatrist"
    }

})

module.exports = mongoose.model("psychProfile",PsychProfileSchema)
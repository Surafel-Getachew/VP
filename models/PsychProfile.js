const mongoose = require("mongoose");

const PsychProfileSchema = mongoose.Schema({

    basicInformation:{
        firstname:{
            type:String,
            required:true
        },
        lastname: {
            type: String,
            required:true
        },
        dateofbirth:{
            type:String
        }
    },
    about:{
        type:String
    },
    contactDetails:{
        address1:{
            type:String
        },
        address2:{
            type:String
        },
        city:{
            type:String
        },
        state:{
            type:String
        },
        country:{
            type:String
        },
        postalCode:{
            type:String
        }
    },

    services:[
        {
            type:String
        }
    ],
    specialization:[
        {
            type:String
        }
    ],
    education:[{
        Degree:{
            type:String,
        },
        college:{
            type:String
        },
        yearOfCompletion:{
            type:String
        }
    }],
    experience:[{
        hospitalName:{
            type:String
        },
        from:{
            type:String
        },
        to:{
            type:String
        },
        designation:{
            type:String
        }
    }],
    awards:[{
        award:{
            type:String
        },
        year:{
            type:String
        }
    }],
    memberships:[{
        member:{
            type:String
        }
    }]


})

module.exports = mongoose.model("psychProfile",PsychProfileSchema)
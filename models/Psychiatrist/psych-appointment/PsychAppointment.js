const mongoose = require("mongoose");

const PsychAppointmentSchema = mongoose.Schema({
    psychAppointedTo: {
        type:mongoose.SchemaTypess.ObjectId,
        required:true,
        ref:"psychiatrist"
    },
    monday:[
        {
            start:{
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true
            },
            appointedBy: {
                requirded:true,
                type:mongoose.SchemaTypes.ObjectId,
                ref:"user"
            }
        }
    ],
    tuesday:[
        {
            start:{
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true
            },
            appointedBy: {
                required:true,
                type:mongoose.SchemaTypes.ObjectId,
                ref:"user"
            }
        }
    ],
    wednesday:[
        {
            start:{
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true
            },
            appointedBy: {
                required:true,
                type:mongoose.SchemaTypes.ObjectId,
                ref:"user"
            }
        }
    ],
    thursday:[
        {
            start:{
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true
            },
            appointedBy: {
                required:true,
                type:mongoose.SchemaTypes.ObjectId,
                ref:"user"
            }
        }
    ],
    friday:[
        {
            start:{
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true
            },
            appointedBy: {
                required:true,
                type:mongoose.SchemaTypes.ObjectId,
                ref:"user"
            }
        }
    ],
    saturday:[
        {
            start:{
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true
            },
            appointedBy: {
                required:true,
                type:mongoose.SchemaTypes.ObjectId,
                ref:"user"
            }
        }
    ],
    sunday:[
        {
            start:{
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true
            },
            appointedBy: {
                required:true,
                type:mongoose.SchemaTypes.ObjectId,
                ref:"user"
            }
        }
    ],
})

module.exports = mongoose.model("psychAppointment",PsychAppointmentSchema)
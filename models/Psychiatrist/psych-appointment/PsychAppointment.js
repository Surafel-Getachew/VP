const mongoose = require("mongoose");

const PsychAppointmentSchema = mongoose.Schema({
    psychAppointedTo: {
        type:mongoose.SchemaType.ObjectId,
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
                type:mongoose.SchemaType.ObjectId,
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
                type:mongoose.SchemaType.ObjectId,
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
                type:mongoose.SchemaType.ObjectId,
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
                type:mongoose.SchemaType.ObjectId,
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
                type:mongoose.SchemaType.ObjectId,
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
                type:mongoose.SchemaType.ObjectId,
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
                type:mongoose.SchemaType.ObjectId,
                ref:"user"
            }
        }
    ],
})

module.exports = mongoose.model("psychAppointment",PsychAppointmentSchema)
const mongoose = require("mongoose");

const PsychAppointmentSchema = mongoose.Schema({
    psychAppointedTo: {
        type:mongoose.SchemaTypes.ObjectId,
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
            },
            completed: {
                required:false,
                default:false
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
            },
            completed: {
                required:false,
                default:false
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
            },
            completed: {
                required:false,
                default:false
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
            },
            completed: {
                required:false,
                default:false
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
            },
            completed: {
                required:false,
                default:false
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
            },
            completed: {
                required:false,
                default:false
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
            },
            completed: {
                required:false,
                default:false
            }
        }
    ],
})

module.exports = mongoose.model("psychAppointment",PsychAppointmentSchema)
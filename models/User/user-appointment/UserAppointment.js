const mongoose = require("mongoose");

const userAppointmentSchema = mongoose.Schema({
    userAppointed : {
        type:mongoose.SchemaType.ObjectId,
        required:true,
        ref:"user"
    },
    monday: [
        {
            start: {
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true,
            },
            appointedTo: {
                required:true,
                type:mongoose.SchemaType.ObjectId,
                ref:"psychiatrist"
            }
        }
    ],
    tuesday: [
        {
            start: {
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true,
            },
            appointedTo: {
                required:true,
                type:mongoose.SchemaType.ObjectId,
                ref:"psychiatrist"
            }
        }
    ],
    wednesday: [
        {
            start: {
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true,
            },
            appointedTo: {
                required:true,
                type:mongoose.SchemaType.ObjectId,
                ref:"psychiatrist"
            }
        }
    ],
    thursday: [
        {
            start: {
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true,
            },
            appointedTo: {
                required:true,
                type:mongoose.SchemaType.ObjectId,
                ref:"psychiatrist"
            }
        }
    ],
    friday: [
        {
            start: {
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true,
            },
            appointedTo: {
                required:true,
                type:mongoose.SchemaType.ObjectId,
                ref:"psychiatrist"
            }
        }
    ],
    saturday: [
        {
            start: {
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true,
            },
            appointedTo: {
                required:true,
                type:mongoose.SchemaType.ObjectId,
                ref:"psychiatrist"
            }
        }
    ],
    sunday: [
        {
            start: {
                type:Date,
                required:true,
            },
            end: {
                type:Date,
                required:true,
            },
            appointedTo: {
                required:true,
                type:mongoose.SchemaType.ObjectId,
                ref:"psychiatrist"
            }
        }
    ],
})

module.exports = mongoose.model("userAppointment",userAppointmentSchema);
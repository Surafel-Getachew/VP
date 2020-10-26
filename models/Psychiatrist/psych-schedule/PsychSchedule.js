const mongoose = require("mongoose");
mongoose.set("useFindAndModify", true);
const PsychScheduleSchema = mongoose.Schema({
  psychSchedule: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "psychiatrist",
  },
  monday: [
    {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      appointed: {
        type: Boolean,
        default: false,
      },
      //   userId: {
      //     type: mongoose.SchemaTypes.ObjectId,
      //     ref: "user",
      //   },
    },
  ],
  tuesday: [
    {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      appointed: {
        type: Boolean,
        default: false,
      },
      userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
      },
    },
  ],
  wednesday: [
    {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      appointed: {
        type: Boolean,
        default: false,
      },
      userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
      },
    },
  ],
  thursday: [
    {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      appointed: {
        type: Boolean,
        default: false,
      },
      userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
      },
    },
  ],
  friday: [
    {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      appointed: {
        type: Boolean,
        default: false,
      },
      userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
      },
    },
  ],
  saturday: [
    {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      appointed: {
        type: Boolean,
        default: false,
      },
      userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
      },
    },
  ],
  sunday: [
    {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      appointed: {
        type: Boolean,
        default: false,
      },
      userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
      },
    },
  ],
});

module.exports = mongoose.model("psychSchedule", PsychScheduleSchema);

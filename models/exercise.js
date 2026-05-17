const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    sets: {
      type: Number,
      required: true,
    },

    reps: {
      type: Number,
      required: true,
    },

  weightHistory: [
  {
    setNumber: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
],

    description: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
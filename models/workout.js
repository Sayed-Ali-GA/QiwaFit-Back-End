const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    day: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true,
  }
  
);


const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
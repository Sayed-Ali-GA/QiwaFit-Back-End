const express = require('express');
const router = express.Router();

const Workout = require('../models/workout');
const Exercise = require('../models/exercise');

const verifyToken = require('../middleware/verify-token');

router.use(verifyToken);

// GET ALL WORKOUTS (user only)
router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id })
      .populate("userId")
      .sort({ createdAt: -1 });

    res.status(200).json(workouts);
  } catch (err) {
    res.status(500).json(err);
  }
});


// CREATE WORKOUT
router.post('/add', async (req, res) => {
  try {
    const newWorkout = await Workout.create({
      ...req.body,
      userId: req.user._id
    });

    res.status(201).json(newWorkout);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET ONE WORKOUT
router.get("/:workoutId", async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.workoutId,
      userId: req.user._id
    });

    const exercises = await Exercise.find({
      workoutId: req.params.workoutId,
      userId: req.user._id
    });

    res.status(200).json({
      workout: {
        day: workout.day
      },
      exercises: exercises.map(ex => ({
        _id: ex._id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps
      }))
    });

  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;

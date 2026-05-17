const express = require('express');
const router = express.Router();


const Exercise = require('../models/exercise');
const verifyToken = require('../middleware/verify-token');

// All routes in this controller require authentication.
router.use(verifyToken);

// To add new exercise to workout
router.post('/:workoutId', async (req, res) => {
  try {
    const exercise = await Exercise.create({
      userId: req.user._id,
      workoutId: req.params.workoutId,
      name: req.body.name,
      sets: req.body.sets,
      reps: req.body.reps,
      weightHistory: []
    });

    res.status(201).json(exercise);
  } catch (err) {
    res.status(400).json(err);
  }
});


// To get all exercises for a specific workout.
router.get('/:workoutId', async (req, res) => {
  try {
    const exercises = await Exercise.find({
      workoutId: req.params.workoutId,
      userId: req.user._id
    });

    res.status(200).json(exercises);
  } catch (err) {
    res.status(400).json(err);
  }
});


// To update an exercise's details (name, sets, reps).
router.put('/:exerciseId', async (req, res) => {
  try {
    const updated = await Exercise.findOneAndUpdate(
      {
        _id: req.params.exerciseId,
        userId: req.user._id
      },
      req.body,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json(err);
  }
});


// To delete an exercise.
router.delete('/:exerciseId', async (req, res) => {
  try {
    await Exercise.findOneAndDelete({
      _id: req.params.exerciseId,
      userId: req.user._id
    });

    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
});


// To add a new weight entry to an exercise's progress history.
router.post('/progress/:exerciseId', async (req, res) => {
  try {
    const exercise = await Exercise.findOne({
      _id: req.params.exerciseId,
      userId: req.user._id
    });

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    exercise.weightHistory.push({
      setNumber: req.body.setNumber,
      weight: req.body.weight,
      reps: req.body.reps,
      date: Date.now()
    });

    await exercise.save();

    res.status(200).json(exercise);

  } catch (err) {
    res.status(400).json(err);
  }
});




module.exports = router;

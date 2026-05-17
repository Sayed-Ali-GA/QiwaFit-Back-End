const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    hashedPassword: {
      type: String,
      required: true,
    },

    googleId: {
      type: String,
      required: false,
    },


    age: {
      type: Number,
      required: false,
    },

    weight: {
      type: Number,
      required: false,
    },

     height: {
      type: Number,
      required: false,
    },

    gender: {
      type: String,
      required: false,
    },

  },
  {
    timestamps: true,
  }
);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

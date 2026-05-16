const dotenv = require('dotenv');


dotenv.config();
const express = require('express');
const varifyToken = require('./middleware/verify-token')
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const logger = require('morgan');
const port = process.env.PORT ? process.env.PORT : '3000';


// Controllers

const authRouter = require('./controllers/authController');
const userRouter = require('./controllers/users');

//--------------------------------------------------- 



// Middleware
const verifyToken = require("./middleware/verify-token");


//---------------------------------------------------------- 



// MIDDLEWARE:

app.use(cors());
app.use(express.json());
app.use(logger('dev'));


app.get('/', (req, res) => {
  res.send('Welcome to the app')
})





// PUBLIC ROUTES
app.use("/auth", authRouter);

// PROTECTED ROUTES
app.use("/users", userRouter);



// ------------------------------------------------



// DB Connection

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.✅✅`);
  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });

//------------------------------------------------ 





// Routes go here

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!👍👍`);
});




// KILL THE SERVER
// npx kill-port 3000
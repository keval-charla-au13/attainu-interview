const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const app = express();
const jwt = require('jsonwebtoken');
const Quizuser = require('./models/quizUser');
const Score = require('./models/scoreModel');
const check = require('./middlewares/check'); // check.isLoggedIn
dotenv.config({ path: './.env' });
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));
app.use(cors());
app.use(cookieParser());


mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB is connected'));

//<
app.get('/', (req, res) => {
  res.send('Hello from Alex, Jenny and Tom');
});


app.post('/register', async (req, res) => {
  console.log('at the back end ');
  console.log(req.body);
  const hashedPassword = await bcrypt.hash(req.body.userPassword, 10);
  const player = await Quizuser.find({ email: req.body.userEmail });
  const password1 = req.body.userPassword;
  const password2 = req.body.userPassword2;
  if (password1 !== password2) {
    res.json({
      errorPasswords: 'Passwords Do Not Match',
    });
  } else if (player.length > 0) {
    res.json({
      registration: false,
      errorPasswords: 'Sorry Email Or Password Is Incorrect ',
    });
  } else {
    await Quizuser.create({
      name: req.body.userName,
      email: req.body.userEmail,
      password: hashedPassword,
    });
    res.json({
      registration: true,
      message: 'user was registered',
    });
  }
});


app.get('/api/user', check.isLoggedIn, async (req, res) => {
  try {
    const user = req.userFound._id;
    const userDB = await Quizuser.findById(user);

    res.json({
      name: userDB.name,
      email: userDB.email,
      id: userDB._id,
    });
  } catch (error) {
    res.json({
      name: 'Guest',
      email: false,
      id: false,
    });
  }
});


app.put('/update', check.isLoggedIn, async (req, res) => {
  console.log(req.body);
  const userId = req.userFound._id;
  // console.log(userId)
  const id = await Quizuser.findById(userId);
  console.log(id);
  const compare = await bcrypt.compare(req.body.userPassword, id.password);
  console.log(compare);
  const hashedPassword = await bcrypt.hash(req.body.userUpdatePassword, 10);
  console.log(hashedPassword);
  if (compare) {
    // try {
    await Quizuser.findByIdAndUpdate(userId, {
      name: req.body.userName,
      email: req.body.userEmail,
      password: hashedPassword,
    });
  }
  res.json({
    Message: 'Details updated. Please logout and log back in.',
  });
});


app.delete('/delete', check.isLoggedIn, async (req, res) => {
  try {
    const user = req.userFound._id;
    const deleteScores = await Score.deleteMany({ user: user });
    const userDB = await Quizuser.findByIdAndDelete(user);
  } catch (error) {
    res.json({
      Message: 'Please contact admin',
    });
  }
});


app.get('/login', (req, res) => {
  // console.log('at the back end ');
  console.log(req.body);
  res.json({
    message: 'logged in ',
  });
});

app.post('/login', async (req, res) => {
  const player = await Quizuser.findOne({ email: req.body.userEmail });
  try {
    const compare = await bcrypt.compare(
      req.body.userPassword,
      player.password
    );
    if (compare) {
      const quizToken = jwt.sign(
        { id: player._id },
        process.env.PLAYER_SECRET,
        {
          expiresIn: process.env.PLAYER_SECRET_IN,
        }
      );
      console.log(quizToken);
      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.PLAYER_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
      res.cookie('playerCookie', quizToken, cookieOptions);
      res.json({ user: player.name, token: quizToken });
    }
  } catch (error) {
    res.send('error at login');
  }
});

////<--------------------------------- LOGOUT  --------------------------------------------->>
app.get('/logout', check.logout, (req, res) => {
  res.json({ message: 'please work' });
});

//Results section
//<--------------------------Results----------------------------------------------->>

app.post('/api/score', async (req, res) => {
  await Score.create({
    score: req.body.score,
    time: req.body.time,
    difficulty: req.body.difficulty,
    category: req.body.category,
    user: req.body.user,
  });

  res.send('nice one');
});

app.get('/topscores', async (req, res) => {
  const scoreDB = await Score.find().populate('user', 'name');
  res.json({
    scores: scoreDB,
  });
});

app.get('/userscores', check.isLoggedIn, async (req, res) => {
  try {
    const allScores = await Score.find({ user: req.userFound._id }).populate(
      'user',
      'name'
    );
    res.json({
      scores: allScores,
    });
  } catch {
    res.json({
      scores: null,
    });
  }
});

app.listen(5000, () => {
  console.log('Server is online');
});

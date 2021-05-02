const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');

dotenv.config();

// Connect to database
connectDB();

const app = express();

const port = 3000;

const studentRoutes = require('./routes/students');
const toDoRoutes = require('./routes/to-do');

// View Engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Init passport
app.use(passport.initialize());
app.use(passport.session());

// Express messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res, next) => {
  res.render('index');
});

app.use('/students', studentRoutes);
app.use('/to-do', toDoRoutes);

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});

const express = require('express')
const path = require('path')
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const users = require('./routes/user');
const admin = require('./routes/admin');
const favicon = require('serve-favicon');
const auth = require('./auth');

var app = express();
var cors = require('cors');

// Mongoose connection with mongodb
mongoose.Promise = require('bluebird');

//authdemo is the name of the db
mongoose.connect('mongodb://authdemo:authdemo123@localhost/authdemo').then(() => {
  // if all is ok we will be here
  console.log('******************Start db working');
}).catch(err => {
  // if error we will be here
  console.error('App starting error:', err.stack);
  process.exit(1);
});

app.use(cors({ origin: '*' }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use('/users', users);
app.use(auth);
app.use('/protected', admin);

app.listen(process.env.PORT || 5000, function () {
  console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env);
});

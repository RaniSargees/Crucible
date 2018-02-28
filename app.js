var express = require('express');
var expressNunjucks = require('express-nunjucks');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('client-sessions');
var bcrypt = require('bcrypt');
var config = require('./config');
var isDev	= true;
var isDev	= false;
var index	= require('./routes/index');
var videos	= require('./routes/videos');
var lobbies	= require('./routes/lobbies');
var users	= require('./routes/users');
var about	= require('./routes/about');
var login	= require('./routes/login');
var register	= require('./routes/register');
var redir	= require('./routes/redir');

var app = express();

//bcrypt
app.set("bcrypt", bcrypt);

//setup sessions
app.use(session({
	cookieName: "session",
	secret: config.cookie_secret,
	duration: 1000*86400*7, //one week
	activeDuration: 1000*86400*7
}));


//flash messages
app.use(require("flash")());

//setup database pool
var db = mysql.createPool({
	connectionLimit: 100,
	host:		config.mysql_host,
	user:		config.mysql_user,
	password:	config.mysql_pass,
	database:	config.mysql_db,
	charset:	"utf8mb4",
});
app.set('db', db);

// view engine setup
app.set('views', __dirname + '/templates');
//app.set('view engine', 'jade');

//setup nunjucks
var njk = expressNunjucks(app, {
    watch: isDev,
    noCache: isDev
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/v', videos);
app.use('/l', lobbies);
app.use('/u', users);
app.use('/about', about);
app.use('/login', login);
app.use('/register', register);
app.use('/redir', redir);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = isDev ? err : {status:err.status, stack:req.url};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    navitems: [
      {
        name: 'Home',
        href: "/"
      },
      {
        name: 'Videos',
        href: '/v'
      },
      {
        name: 'Lobbies',
        href: '/l'
      }
    ]
  });
});

module.exports = app;

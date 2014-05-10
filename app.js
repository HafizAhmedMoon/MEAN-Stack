var express = require('express');
var path = require('path');
//var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var debug=require('debug');

var mongoose= require('mongoose');

// MongoDB Connection
/*
mongoose.connect('mongodb://<user>:<pass>@localhost:27017/test'); // connect to our mongoDB database (commented out after you enter in your own credentials)

var mongo_conn = mongoose.connection;

mongo_conn.on('error', console.error.bind(console, 'connection error:'));
mongo_conn.once('open', function()
    console.log('mongoConnected');
    // create Schema
    app.db = (new (require('./db'))(app,mongoose)).db;
});
*/


var app = express();

app.set('port', process.env.PORT || 3000);

//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Gets data with Database
//require('./query')(app);

//routes
require('./routes')(app);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(app.get('port'));

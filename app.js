var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose= require('mongoose');

// MongoDB Connection
/*mongoose.connect('mongodb://<user>:<pass>@<domain>:<port>/<db>');

var mongoConnect = mongoose.connection;
 mongoConnect.on('error', console.error.bind(console, 'connection error:'));
 mongoConnect.once('open', function(){
     express.request.db=(new (require('./app/db'))(mongoose)).db;
     console.log('mongoConnected');
});*/

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Gets data with Database
var api = require('./app/api');
app.use('/api', api);

// Routes
var routes = require('./app/routes');
app.use('/', routes);

// Error handler
require('./app/error')(app);

var server = app.listen(app.get('port'), function() {
    console.info('Server listening on port ' + server.address().port);
});

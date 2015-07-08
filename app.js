var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var os = require('os');
var fs = require('fs');
var dir = require('mkdirp');
var routes = require('./routes/index');
var app = express();
var ostype = os.type();
var ncp = require('ncp').ncp;
global.config = require('./package.json').config;
//console.log(ostype);

function CreateDir(path){
    if(!fs.existsSync(path)){
        dir(path, function(err){
            if (err) console.error(err);
            else {
                console.log('create gbtouch pow!');
            }
        });
    }
}

if(ostype.toLowerCase() == "darwin"){
    global.path = global.config.darwin;
}else if(ostype.toLowerCase() == "windows_nt"){
    global.path = global.config.window;
}else if(ostype.toLowerCase() == "linux"){
    global.path = global.config.linux;
}

CreateDir(global.path);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({
    dest: './uploads/',
    onFileUploadComplete: function (file, req, res) {
        var path = global.path + "/" + req.url.replace('/file/',"");
        var filepath = path + "/" + file.originalname;
        ncp(file.path, filepath, function (err) {
            if (err) {
                console.log(err);
                return false;
            }

        });

        res.send('{"finish":"' + file.originalname + '"}');
    },

    onFileUploadStart: function (file, req, res) {
        var allow = ["pdf","doc","docx","xls","xlsx","ppt","pptx","jpg","png"];
        var p = file.extension.toLowerCase().toString();

        if(!(allow.indexOf(p) > -1)){
            res.send('{"err": "extension not allow"}');
            return false;
        }
    }
}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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


module.exports = app;

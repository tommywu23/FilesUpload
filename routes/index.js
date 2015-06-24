var express = require('express');
var router = express.Router();
var dir = require('mkdirp');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/file/:meetingid', function(req, res){
    var meetingfolder = req.params.meetingid;
    if(meetingfolder == undefined || meetingfolder == ""){
        res.sendStatus(400);
    }

    if(!fs.existsSync(meetingfolder)){
        var path = global.path + "/" + meetingfolder;
        dir.sync(path);
    }

    res.status(204).end()
});

module.exports = router;

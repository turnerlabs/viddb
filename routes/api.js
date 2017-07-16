var express = require('express');
var router = express.Router();
var utils = require('./../utils');

var generalController = require('./../controllers/general');
var labelController = require('./../controllers/label');
var videoController = require('./../controllers/video');


router.get('/ping', function(req, res, next) {
    console.log(req.app.locals.envVars);

  res.send('pong');
});

/* General routes */
router.get('/getVideoList', function(req, res, next){

    var controller = new generalController(req.app.locals.envVars);
    controller.videoList(function(err, result){
        utils.responseFormatter(err, result, function(retVal){
            res.json(retVal);
        });
    });
});

/* Label routes */
router.get('/getLabelCount/:videoName', function(req, res, next){

    var vidName = req.params.videoName;

    var lc = new labelController(req.app.locals.envVars);
    lc.labelCount(vidName, function(err, result){
        var stripMySqlJunk = result[0]
        utils.responseFormatter(err, stripMySqlJunk, function(retVal){
            res.json(retVal);
        });
    });
});

module.exports = router;

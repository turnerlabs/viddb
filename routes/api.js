var express = require('express');
var router = express.Router();
var utils = require('./../utils');

var generalController = require('./../controllers/general');

router.get('/ping', function(req, res, next) {
    console.log(req.app.locals.envVars);

  res.send('pong');
});

router.get('/getVideoList', function(req, res, next){
    
    var controller = new generalController(req.app.locals.envVars);
    controller.videoList(function(err, result){
        utils.responseFormatter(err, result, function(retVal){
            res.json(retVal);
        });
    });
});


module.exports = router;

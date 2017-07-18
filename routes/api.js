var express = require('express');
var router = express.Router();
var utils = require('./../utils');
var Bing = require('node-bing-api')({ accKey: process.env.AZURE_API_KEY });

var generalController = require('./../controllers/general');
var labelController = require('./../controllers/label');
var videoController = require('./../controllers/video');
var celebController = require('./../controllers/celeb');

router.get('/ping', function(req, res, next) {
    //console.log(req.app.locals.envVars);
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

router.get('/labels/:videoName', function(req, res, next){
    var vidName = req.params.videoName;

    var lc = new labelController(req.app.locals.envVars);
    lc.getLabelsByVid(vidName, function(err, result) {
        var objects = {};
        result.map((object) => {
            if (!objects[object.TimeStamp]) {
                objects[object.TimeStamp] = [];
            }
            objects[object.TimeStamp].push(object['Labels']);
        });
        res.json(objects);     
    });
});

/* Celebs routes */
router.get('/celebs/:videoName', function(req, res, next){
    var vidName = req.params.videoName;

    var cc = new celebController(req.app.locals.envVars);
    cc.getCelebsByVid(vidName, function(err, result) {
        var objects = {};
        result.map((object) => {
            if (!objects[object.TimeStamp]) {
                objects[object.TimeStamp] = [];
            }
            objects[object.TimeStamp].push(object['Celebrities']);
        });
        res.json(objects);     
    });
});

router.get('/celebTimeStamps/:celebName', function(req, res, next){
    var celebName = req.params.celebName;
    
    var cc = new celebController(req.app.locals.envVars);
    cc.getCelebTimestamps(celebName, function(err, result){
        utils.responseFormatter(err, result, function(retVal){
            res.json(retVal);
        });
    });
});

router.get('/getCelebCount/:videoName', function(req, res, next){
    var videoName = req.params.videoName;

    var cc = new celebController(req.app.locals.envVars);
    cc.getCelebCount(videoName, function(err, result){
        var stripMySqlJunk = result[0];
        utils.responseFormatter(err, stripMySqlJunk, function(retVal){
            res.json(retVal);
        });
    });
});


//returns summary of celebs in a video along with their thumbnail images
router.get('/celebSummary/:videoName', function(req, res, next){
    var vidName = req.params.videoName;

    var cc = new celebController(req.app.locals.envVars);
    cc.getCelebSummaryByVid(vidName, function(err, results) {
        var objects = [];
        var counter = 1;
        results.map(function(object) {
            //get a thumbnail for this celebrity
            Bing.images(object.Celebrities, { top: 1, skip: 0 }, function(error, response, body){
                if (error) throw error;
                var item = { name: object.Celebrities };                
                if (body.value && body.value.length > 0)
                    item.thumbnailUrl = body.value[0].thumbnailUrl                
                objects.push(item);

                //return response once we've processed all the celebrities
                if (counter === results.length) {
                    res.json(objects);
                    return;
                }
                counter++;
            });
        });
    });   
});

module.exports = router;

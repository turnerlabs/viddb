var express = require('express');
var router = express.Router();
var utils = require('./../utils');
var Bing = require('node-bing-api')({ accKey: process.env.AZURE_API_KEY });
var aws = require('aws-sdk');
var mime = require('mime');
var s3 = new aws.S3();
bucket = process.env.BUCKET;

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
        if (err) throw err;
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
            let timestamp = Math.floor(object.TimeStamp);
            if (!objects[timestamp]) {
                objects[timestamp] = [];
            }
            if (objects[timestamp].indexOf(object['Labels']) === -1) {
                objects[timestamp].push(object['Labels']);
            }
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
            let timestamp = Math.floor(object.TimeStamp);
            if (!objects[timestamp]) {
                objects[timestamp] = [];
            }
            if (objects[timestamp].indexOf(object['Celebrities']) === -1) {
                objects[timestamp].push(object['Celebrities']);
            }
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
    cc.getCelebSummaryByVid(vidName, (err, results) => {
        var payload = results.map(result => {
            return { name: result.celebrity, thumbnailUrl: result.thumbnail };
        });
        res.json(payload)
    });
});

router.get('/stream/:video', stream);

function stream(req, res, next) {
  let key = 'videos/' + req.params.video,
  params = {Bucket: bucket, Key: key};
  console.log(params)
  s3.headObject(params, function (err, data) {
        if (err) {
            // an error occurred
            console.error(err);
            return next();
        }
        var stream = s3.getObject(params).createReadStream();

        // forward errors
        stream.on('error', function error(err) {
            //continue to the next middlewares
            return next();
        });

        //Add the content type to the response (it's not propagated from the S3 SDK)
        res.set('Content-Type', mime.lookup(key));
        res.set('Content-Length', data.ContentLength);
        res.set('Last-Modified', data.LastModified);
        res.set('ETag', data.ETag);

        stream.on('end', () => {
            console.log('Served by Amazon S3: ' + key);
        });
        //Pipe the s3 object to the response
        stream.pipe(res);
    });
}

module.exports = router;

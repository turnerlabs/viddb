var express = require('express');
var router = express.Router();

var apiController = require('./../controllers/api-controller');


/* GET users listing. */
router.get('/ping', function(req, res, next) {
    console.log(req.app.locals.envVars);
    
  res.send('pong');
});

router.get('/test', function(req, res, next){
    
    var controller = new apiController(req.app.locals.envVars);
    controller.test(function(result){
        res.json(result);
    });
});


module.exports = router;

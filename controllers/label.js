var mysql = require('mysql');
var pool;
var CONFIDENCE = process.env.CONFIDENCE || 80;
var LIMIT = process.env.LIMIT || 2000;

var LabelController = function(envVars) {
    pool = mysql.createPool({
        connectionLimit : 2,
        host            : envVars.serverURL,
        user            : envVars.username,
        password        : envVars.password,
        database        : envVars.database
    });
}

LabelController.prototype.labelCount = function(vidName, callback){
    pool.query("CALL LabelCount('" + vidName + "');", function (error, results, fields) {
        callback(error, results);
    });
}

LabelController.prototype.getLabelsByVid = function(vidName, callback){
    pool.query('SELECT * FROM `AWSLabelResults` WHERE `VideoName`="' + vidName + '" AND Confidence >= ' + CONFIDENCE + ' ORDER BY `Timestamp` LIMIT ' + LIMIT, (err, results, fields) => {
      if (err) {
        console.log("ERROR =>", err)
        throw err;
      }
      callback(err, results);
    });
}

module.exports = LabelController;

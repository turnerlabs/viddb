var mysql = require('mysql');
var pool;

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
    pool.query('SELECT * FROM `AWSLabelResults` WHERE `VideoName`="' + vidName + '" ORDER BY `Timestamp` LIMIT 1000', (err, results, fields) => {
      if (err) {
        console.log("ERROR =>", err)
        throw err;
      }
      callback(err, results);
    });
}

module.exports = LabelController;
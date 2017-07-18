var mysql = require('mysql');
var pool;

var CelebController = function(envVars) {
    pool = mysql.createPool({
        connectionLimit : 10,
        host            : envVars.serverURL,
        user            : envVars.username,
        password        : envVars.password,
        database        : envVars.database
    });
}

CelebController.prototype.getCelebsByVid = function(vidName, callback){
    pool.query('SELECT * FROM `AWSCelebResults` WHERE `VideoName`="' + vidName + '" ORDER BY `Timestamp` LIMIT 1000', (err, results, fields) => {
      if (err) {
        console.log("ERROR =>", err)
        throw err;
      }
      callback(err, results);
    });
}

module.exports = CelebController;
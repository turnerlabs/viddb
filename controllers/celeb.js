var mysql = require('mysql');
var pool;

var CelebController = function(envVars) {
    pool = mysql.createPool({
        connectionLimit : 2,
        host            : envVars.serverURL,
        user            : envVars.username,
        password        : envVars.password,
        database        : envVars.database
    });
}

CelebController.prototype.getCelebsByVid = function(vidName, callback) {
    var sql = 'SELECT * FROM `AWSCelebResults` WHERE `VideoName`="' + vidName + '" AND MatchConfidence > 60 ORDER BY `Timestamp` LIMIT 1000';
    pool.query(sql, (err, results, fields) => {
      if (err) {
        console.log("ERROR =>", err)
        throw err;
      }
      callback(err, results);
    });
}

CelebController.prototype.getCelebSummaryByVid = function(vidName, callback) {
    var sql = 'SELECT DISTINCT Celebrities FROM `AWSCelebResults` WHERE `VideoName`="' + vidName + '" AND MatchConfidence > 60 ORDER BY `Celebrities` LIMIT 1000';
    pool.query(sql, (err, results, fields) => {
      if (err) {
        console.log("ERROR =>", err)
        throw err;
      }
      callback(err, results);
    });
}

CelebController.prototype.getCelebTimestamps = function(celebName, callback){
    var query = "select ISO, TimeStamp from AWSCelebResults where Celebrities = '" + celebName + "';";

    pool.query(query, function(err, results, fields){
        if(err){
            console.log("ERROR: " + err);
            throw err;
        }
        callback(err, results);
    });
}

CelebController.prototype.getCelebCount = function(videoName, callback){
    pool.query("CALL CelebCount('" + videoName + "');", function(err, result, fields){
        callback(err, result);
    });

}

module.exports = CelebController;
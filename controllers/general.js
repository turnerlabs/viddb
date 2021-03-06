var mysql = require('mysql');
var pool;

var GeneralController = function(envVars) {
    pool = mysql.createPool({
        connectionLimit : 2,
        host            : envVars.serverURL,
        user            : envVars.username,
        password        : envVars.password,
        database        : envVars.database
    });
}

GeneralController.prototype.videoList = function(callback){
    pool.query('select distinct VideoName as vid from AWSLabelResults;', function (error, results, fields) {
        if (error) throw error;
        callback(error, results);
    });
}


module.exports = GeneralController;
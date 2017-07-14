
var mysql = require('mysql');
var pool;

var ApiController = function(envVars) {
    pool = mysql.createPool({
        connectionLimit : 10,
        host            : envVars.serverURL,
        user            : envVars.username,
        password        : envVars.password,
        database        : envVars.database
});
    
    
}

ApiController.prototype.videoList = function(callback){
    pool.query('select distinct VideoName as vid from AWSLabelResults;', function (error, results, fields) {
        callback(error, results);
    });
}


module.exports = ApiController;

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

ApiController.prototype.test = function(callback){
    pool.query('select * from AWSLabelResults limit 100;', function (error, results, fields) {
        if (error) throw error;
        //var s = JSON.stringify(results);
        callback(results);
    });
}


module.exports = ApiController;
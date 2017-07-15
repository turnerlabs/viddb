var mysql = require('mysql');
var pool;

var LabelController = function(envVars) {
    pool = mysql.createPool({
        connectionLimit : 10,
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


module.exports = LabelController;
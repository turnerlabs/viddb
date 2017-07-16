var mysql = require('mysql');
var pool;

var VideoController = function(envVars){
    pool = mysql.createPool({
	connectionLimit : 10,
	host		: envVars.serverURL,
	user		: envVars.username,
	password	: envVars.password,
	database	: envVars.database
    });
}

VideoController.prototype.test = function(callback){
	callback(1);
}


module.exports = VideoController;



exports.getEnvVars = function() {
    var server = process.env.DB_SERVER;
    var user = process.env.DB_USER;
    var pass = process.env.DB_PASSWORD;
    var database = process.env.DB;

    
   var ret = {
        serverURL: server,
        username: user,
        password: pass,
        database: database
    };

    console.log('Server URL: ' + ret.serverURL);

    return ret;
}

exports.responseFormatter = function(err, data, callback){
    var status = (err) ? 'error' : 'ok';
    var data = (err) ? err.message : data;
    var res = {
        status: status,
        res: data
    };
    callback(res);
}



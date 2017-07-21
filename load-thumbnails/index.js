//get distinct list of celebrities not in CelebrityThumbnails
//use bing cognitive services api to fetch missing thumbnails and persist them

const Bing = require('node-bing-api')({ accKey: process.env.AZURE_API_KEY });
const mysql = require('mysql');
const utils = require('../utils');
const envVars = utils.getEnvVars();

let pool = mysql.createPool({
    connectionLimit: 2,
    host: envVars.serverURL,
    user: envVars.username,
    password: envVars.password,
    database: envVars.database
});

console.log('fetching celebrities with missing thumbnails');

let sql = `
  select distinct celebrities as celebrity from AWSCelebResults where celebrities not in (
    select celebrity from CelebrityThumbnails where Celebrity = celebrities
  ) order by Celebrities`;

let queryResults;

pool.query(sql, (err, results, fields) => {
  if (err) {
    console.log("ERROR =>", err)
    throw err;
  }
  queryResults = results;
  console.log('%s celebrities with missing thumbnails', results.length);

  //start processing
  next(0, () => {
    pool.end();
    console.log('done');
  });
});

function next(i, callback) {
  //get a thumbnail for this celebrity
  let celeb = queryResults[i].celebrity;
  console.log('processing ', celeb);
  Bing.images(celeb, { top: 1 }, function(err, response, body){
      if (err) throw err;
      if (body.value && body.value.length > 0) {
        console.log('inserting thumbnail');

        const record = {
          celebrity: celeb,
          thumbnail: body.value[0].thumbnailUrl
        };

        let sql = 'insert into CelebrityThumbnails set ?';
        pool.query(sql, record, (err, result) => {
          if (err) throw err;
          console.log('insert complete');

          //are we done?
          if (i === queryResults.length-1) {
            callback();
            return;
          }

          //throttle next call
          setTimeout(() => next(++i, callback), 1000);        
        });
      }
      else {
        console.log('no results');
        
        //are we done?
        if (i === queryResults.length-1) {
          callback();
          return;
        }

        //throttle next call
        setTimeout(() => next(++i, callback), 1000);
      }
  });
}
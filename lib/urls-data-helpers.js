const {getRandomId} = require('./utils');

function makeUrlsDatahelpers(client){

  function createUrl(longUrl, userId, cb){
    const shortUrl = getRandomId();
    client.query('INSERT INTO urls ("userId", "shortUrl", "longUrl") VALUES ($1, $2, $3) RETURNING *', [userId, shortUrl, longUrl], (err, result) => {
      if(err){
        cb(err);
      } else {
        cb(null, result.rows[0]);
      }
    });
  }
  
  function getUrlsByUserId(userId, cb){
    client.query('SELECT * FROM urls WHERE "userId" = $1', [userId], (err, result) => {
      if(err){
        cb(err);
      } else {
        cb(null, result.rows);
      }
    });
  }
  
  function getUrl(shortUrl, cb){
    client.query('SELECT * FROM urls WHERE "shortUrl" = $1 LIMIT 1', [shortUrl], (err, result) => {
      if(err){
        cb(err);
      } else {
        cb(null, result.rows[0]);
      }
    });
  }
  
  function updateUrl(shortUrl, longUrl, cb){
    client.query('UPDATE urls SET "longUrl" = $1 WHERE "shortUrl" = $2', [longUrl, shortUrl], cb);
  }
  
  function deleteUrl(shortUrl, cb){
    client.query('DELETE FROM urls WHERE "shortUrl" = $1', [shortUrl], cb);
  }
  
  return {
    createUrl,
    getUrlsByUserId,
    getUrl,
    updateUrl,
    deleteUrl,
  };
}

module.exports = makeUrlsDatahelpers;
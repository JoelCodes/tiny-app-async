const {getRandomId} = require('./utils');

const urls = {};

function createUrl(longUrl, userId, cb){
  const shortUrl = getRandomId();
  const newUrl = {
    shortUrl,
    longUrl,
    userId
  };
  urls[shortUrl] = newUrl;
  cb(null, newUrl);
}

function getUrlsByUserId(userId, cb){
  const output = [];
  for(const shortUrl in urls){
    const url = urls[shortUrl];
    if(url.userId === userId){
      output.push(url);
    }
  }
  cb(null, output);
}

function getUrl(shortUrl, cb){
  cb(null, urls[shortUrl]);
}

function updateUrl(shortUrl, longUrl, cb){
  const url = urls[shortUrl];
  if(url){
    url.longUrl = longUrl;
  }
  cb();
}

function deleteUrl(shortUrl, cb){
  delete urls[shortUrl];
  cb();
}

module.exports = {
  createUrl,
  getUrlsByUserId,
  getUrl,
  updateUrl,
  deleteUrl,
};
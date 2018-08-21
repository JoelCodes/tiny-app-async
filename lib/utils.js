const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function getRandomId(length = 6){
  let output = "";
  for(let i = 0; i < length; i++){
    output += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return output;
}

module.exports = {
  getRandomId
};
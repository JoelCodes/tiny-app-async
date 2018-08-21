const bcrypt = require('bcrypt');
const {getRandomId} = require('./utils');

function makeUsersDataHelpers(client){
  const users = {};

  function getUserByEmail(email, cb){
    client.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email], (err, result) => {
      if(err){
        cb(err);
      } else {
        cb(null, result.rows[0]);
      }
    });
  }

  function getUserById(userId, cb){
    client.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [userId], (err, result) => {
      if(err){
        cb(err);
      } else {
        cb(null, result.rows[0]);
      }
    });
  }

  function authenticateUser(email, password, cb){
    getUserByEmail(email, (err, user) => {
      if(err){
        cb(err);
      } else if(!user){
        cb(null, user);
      } else {
        const matches = bcrypt.compareSync(password, user.password);
        if(matches){
          cb(null, user);
        } else {
          cb(null);
        }
      }
    });
  }

  function createUser(email, password, cb){
    const passwordHash = bcrypt.hashSync(password, 10);
    client.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, passwordHash], (err, result) => {
      if(err){
        cb(err);
      } else {
        cb(null, result.rows[0])
      }
    });
  }

  return {
    getUserByEmail,
    getUserById,
    authenticateUser,
    createUser,
  };
}


module.exports = makeUsersDataHelpers;
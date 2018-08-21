const bcrypt = require('bcrypt');
const {getRandomId} = require('./utils');

function makeUsersDataHelpers(){
  const users = {};

  function getUserByEmail(email, cb){
    for(const userId in users){
      const user = users[userId];
      if(user.email === email){
        cb(null, user);
        return;
      }
    }
    cb(null, undefined);
  }

  function getUserById(userId, cb){
    cb(null, users[userId]);
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
    const id = getRandomId();
    const newUser = {
      id, email, password: passwordHash
    };
    users[id] = newUser;
    cb(null, newUser);
  }

  return {
    getUserByEmail,
    getUserById,
    authenticateUser,
    createUser,
  };
}


module.exports = makeUsersDataHelpers;
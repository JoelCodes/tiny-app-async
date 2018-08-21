const Router = require('express').Router;

const {getUserById, getUserByEmail, createUser, authenticateUser} = require('../lib/users-data-helpers');

function getUserMiddleware(req, res, next){
  getUserById(req.session.user_id, (err, user) => {
    res.locals.user = req.user = user;
    console.log(res.locals.user);
    next();
  });
}

const usersRouter = new Router();

usersRouter.get("/register", (req, res) => {
  // If user is logged in, redirect to main urls page
  if (req.user) {
    res.redirect("/urls");
  // If user is not logged in, go to register page
  } else {
    res.render("register");
  }
});

usersRouter.post("/register", (req, res) => {
  // If user does not enter both an email and a password
  if (!req.body.email || !req.body.password) {
    res.status(400);
    res.send("Please enter both an email and a password. Return to <a href='/register'>registration</a> page.");
    return;
  }
  getUserByEmail(req.body.email, (err, user) => {
    if(user){
      res.status(400).send("That email is already registered, please <a href='/login'>login</a> or try registering <a href='/register'>again</a>" );
    } else {
      createUser(req.body.email, req.body.password, (err, createdUser) => {
        req.session.user_id = createdUser.id;
        res.redirect('/urls');
      });
    }
  })
});

usersRouter.get("/login", (req, res) => {
  // If user is logged in, go to urls
  if (req.user) {
    res.redirect("/urls");
    // If user is not logged in, go to login
  } else {
    res.render("login");
  }
});

usersRouter.post("/login", (req, res) => {
  // If user does not enter both an email and a password
  if (!req.body.email || !req.body.password) {
    res.status(400).send("Please enter both an email and a password. Return to <a href='/login'>login</a> page.");
    return;
  }
  authenticateUser(req.body.email, req.body.password, (err, user) => {
    if(user){
      req.session.user_id = user.id;
      res.redirect('/urls');
    } else {
      res.redirect('/login');
    }
  });
});

usersRouter.post("/logout", (req, res) => {
  req.session = undefined;
  res.redirect("/login");
});

module.exports = {
  getUserMiddleware,
  usersRouter
};
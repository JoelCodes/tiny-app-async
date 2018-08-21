const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const {Client} = require('pg');
const app = express();
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || "development"],
  maxAge: 24 * 60 * 60 * 1000
}));

const client = new Client({
  database: 'tiny_app_pg',
});

client.connect(() => {

  const usersDataHelper = require('./lib/users-data-helpers')(client);
  const {getUserMiddleware, usersRouter} = require('./routes/users')(usersDataHelper);

  const urlsDataHelper = require('./lib/urls-data-helpers')();
  const {urlsRouter} = require('./routes/urls')(urlsDataHelper);

  // Sets user as a global variable
  app.use(getUserMiddleware);
  app.use(usersRouter);
  app.use(urlsRouter);

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });

});

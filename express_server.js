const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const app = express();
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || "development"],
  maxAge: 24 * 60 * 60 * 1000
}));

const {getUserMiddleware, usersRouter} = require('./routes/users');
const {urlsRouter} = require('./routes/urls');
// Sets user as a global variable

app.use(getUserMiddleware);
app.use(usersRouter);
app.use(urlsRouter);


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

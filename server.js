const express = require("express");
const app = express();
require("dotenv").config()

const ejs = require("ejs")
const expressLayout = require("express-ejs-layouts")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("express-flash")
const MongoStore = require("connect-mongo")
const passport = require("passport")

app.use(flash())
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// db
mongoose.connect(process.env.MONGO_URI)
const db = mongoose.connection;
db.on("error", function () {
  console.log("Connection failed...");
});
db.once("open", function () {
  console.log("Db Connected successfully...");
});

// session
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  mongooseConnection: mongoose.connection
});

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { maxAge: 1000*60*60*24 }, 
}))

// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

// assets
app.use(express.static('public'))

// set template engine
app.use(expressLayout)
app.set("views", path.join(__dirname, '/resources/views'))
app.set("view engine", "ejs")

// global middleware
app.use((req, res, next) => {
  res.locals.session = req.session
  res.locals.user = req.user

  next()
})

const PORT = process.env.PORT || 8080

require("./routes/web")(app);


app.listen(PORT, function () {
  console.log(`server runnning on PORT ${PORT}`);
});




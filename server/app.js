require('dotenv').config(); 
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/openapi.json');
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet=require("helmet");
const cors=require("cors");

const options=require('./knexfile.js');
const knex=require('knex')(options);

const peopleRouter = require("./routes/peopleRouter");
const moviesRouter = require("./routes/moviesRouter");
const authRouter = require("./routes/authenticationRouter");

const app=express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req,res,next)=>{
    req.db=knex.queryBuilder()
    next()
});


app.use(helmet());
app.use(cors());


app.use("/people", peopleRouter);
app.use("/movies", moviesRouter);
app.use("/user", authRouter);

app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

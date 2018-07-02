const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');

// establish connection to the database
const db = mongoose.connect('mongodb://localhost/soccerAPI');

// require the mongoose model for Team
const Team = require('./models/teamModel');

// initialize the express app and set the port
const app = express();
const port = process.env.PORT || 3000;

// use body parser middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// routers
const apiRouter = require('./routes/apiRouter')(Team);
const rootRouter = require('./routes/rootRouter')(Team);

app.use('/', rootRouter);
app.use('/api', apiRouter);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
  if(req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
    return res.status(200).json({});
  }
  next();
});

// error handler
app.use( function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status,
      message: err.message
    }
  });
});

app.listen(port, function() {
  console.log('Server running on port', port);
});

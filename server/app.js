'use strict';

// load modules
const express = require('express');
const cors = require('cors');

// configuring options for cors, for the client to access the full Headers
const corsOptions = {
  exposedHeaders: "*"
}

// create the Express app
const app = express();


// setup cors
app.use(cors(corsOptions));


// serving the static files
app.use(express.static('screenshots'));


// setting a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the screenshot's server of The Mockup Project!",
  });
});


// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});


// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});


// setting the port
app.set('port', process.env.PORT || 5000);


// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

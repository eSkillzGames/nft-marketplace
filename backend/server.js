const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request');
request.post({
  url: 'TEST_URL',
  oauth: {
      consumer_key: 'TEST_KEY',
      consumer_secret: 'TEST_SECRET'
  }
});

const app = express();
const PORT = process.env.PORT || 8000;

// Init Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));


// Define Routes
app.use('/api/v1', require('./routes/api/nft'));
app.use('/sendTransaction/v1', require('./routes/api/bet'));
app.use('/1kin/', require('./routes/api/1kin'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

var serverApp = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
serverApp.setTimeout(400 * 1000);
console.log(serverApp.timeout);



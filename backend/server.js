const express = require('express');
//const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect Database
//connectDB();

// Init Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
// Define Routes
app.use('/api/cues', require('./routes/api/cues'));
//app.use('/api/wallet', require('./routes/api/wallet'));
//app.use('/api/chalks', require('./routes/api/chalk'));
//app.use('/api/halls', require('./routes/api/hall'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

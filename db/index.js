const mongoose = require('mongoose');
const config = require('./config.json');

// Use native promises
mongoose.Promise = global.Promise; // es6 promise

const connectionURL = `mongodb+srv://loft:loft@cluster0-wtdo7.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(connectionURL, { useNewUrlParser: true })
  .catch((e) => console.error(e));
const db = mongoose.connection;

// Check connection
db.on('connected', () => {
  console.log(`Mongoose connection open  on ${connectionURL}`)
});

// Check for Db errors
db.on('error', (err) => console.error(err));

// Check for disconected
db.on('disconnected', () => {
  console.log('mongoose connection disconnected')
});

process.on('SIGINT', () => {
  db.close(() => {
    console.log('mongoose connection closed throw app terminatatnio');
    process.exit(0);
  });
});

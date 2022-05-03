const mongoose = require('mongoose');
const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');

const id = process.env.ALGOLIA_APPLICATION_ID;
const apiKey = process.env.ALGOLIA_ADMIN_API_KEY;

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successfully');
  });

app.get('/', (req, res) => {
  res.end('Welcome to EMS software!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server has started at port ${port}`);
});

module.exports = port;

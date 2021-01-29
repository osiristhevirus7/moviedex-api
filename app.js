require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIEDATA = require('./movieData.js');

const app = express();
const API_TOKEN = process.env.API_TOKEN;

app.use(morgan('common'));
app.use(cors());
app.use(validateBearerToken);
app.use(helmet());

function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  next();
}

app.get('/movie', (req, res) => {
  const { genre, country, avg_vote } = req.query;
  let results = MOVIEDATA;

  if (genre) {
    results = results.filter((movie) =>
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if (country) {
    results = results.filter((movie) =>
      movie.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  if (avg_vote) {
    let minimumRating = parseFloat(avg_vote);
    results = results.filter((movie) => movie.avg_vote >= minimumRating);
  }

  console.log(`there are ${results.length} results`);

  res.json(results);
});

app.listen(8000, () => {
  console.log('Server is up on port 8000');
});

const express = require('express');
const app = express();
const db = require('./db');
const path = require('path');

app.use(express.json());

const DATA_PATH = './companies.json';
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/companies', (req, res, next) => {
  db.readJSON(DATA_PATH)
    .then(companies => res.send(companies))
    .catch(next);
});

app.post('/api/companies/', (req, res, next) => {
  const newCompany = req.body;
  db.readJSON(DATA_PATH)
    .then(companies => {
      const comps = [...companies];
      comps.unshift(newCompany);
      newCompany.id = `${companies.length + 2}`;
      return comps;
    })
    .then(updatedCompanies => {
      return db.writeJSON(DATA_PATH, updatedCompanies);
    })
    .then(() => res.sendStatus(204));

  // add the input from the post request to companies.json
});

app.delete('/api/companies/:companyId', (req, res, next) => {
  const companyId = req.params.companyId;
  db.readJSON(DATA_PATH)
    .then(companies => {
      return companies.filter(company => company.id !== companyId);
    })
    .then(remainingCompanies => {
      return db.writeJSON(DATA_PATH, remainingCompanies);
    })
    .then(() => res.status(204).send());
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));

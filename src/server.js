const express = require('express');
const json = require('body-parser').json;
const fs = require('fs');

const app = express();

app.set('port', (process.env.PORT || 3001));
app.use(json())

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use((req, res, next) => {
  const stats = fs.statSync('./db/db.json');
  res.setHeader('Last-Modified', (new Date(stats.mtimeMs)).toUTCString());
  next();
})

app.get('/api/notes', (req, res) => {
    console.log("GET /api/notes");
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    res.json({ message: 'success', data: notes });
})

app.head('/api/notes', (req, res) => {
    console.log("HEAD /api/notes");
    res.json({ message: 'success' });
})

app.post('/api/notes', (req, res) => {
    console.log("POST /api/notes");
    const notes = req.body;
    fs.copyFileSync('./db/db.json', `./db/backups/${Date.now()}.db.json`);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
    res.json({ message: 'success' });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

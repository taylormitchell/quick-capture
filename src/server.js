const express = require('express');
const json = require('body-parser').json;
const fs = require('fs');
const path = require('path');

const app = express();
app.use(json())

app.set('port', process.env.PORT || 3001);



// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

app.get('/api/health', function(req, res, next) {
  return res.status(200);
})


app.use('/api/data/:key', (req, res) => {
  const filepath = path.join(__dirname, 'data', req.params.key + '.json');
  let body = {};
  if (req.method === 'GET') {
    try {
      const text = fs.readFileSync(filepath, 'utf8')
      body = JSON.parse(text);
    } catch (err) {
      res.status(404)
      throw err;
    }
  } else if (req.method === 'POST') {
    let text;
    try {
      const data = req.body;
      text = JSON.stringify(data, null, 2)
    } catch (err) {
      res.status(400)
      throw err;
    }
    fs.writeFileSync(filepath, text);
    // Save back up copy
    const backupDir = filepath + '.bak';
    if(!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    fs.copyFileSync(filepath, path.join(backupDir, Date.now().toString()));
  }
  const stats = fs.statSync(filepath);
  res.setHeader('Last-Modified', new Date(stats.mtimeMs).toUTCString());
  res.json(body); 
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if(err.type === 'entity.parse.failed') {
    res.status(400);
  }
  if(res.statusCode === 200) {
    res.status(500);
  }
  res.json({ message: err.message, stack: err.stack });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

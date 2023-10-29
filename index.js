import path from "path";
import ejs from "ejs";
import express from 'express';
import compression from 'compression';
import baidu from './engines/baidu.js'
import Adjust from './plugins/Adjust.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

app.use(compression());
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/search', async function(req, res){
  const query = req.query.query.split(/\s+/).join('+');
  const page = req.query.page??1;
  const pageSize = req.query.pageSize??10;
  const adjust = new Adjust(query, { page, pageSize });
  const results = await adjust.results();

  res.render('search', { results, query, page, pageSize });
});

app.listen(3000, () => {
  console.log('http://localhost:3000')
});
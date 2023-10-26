import express from 'express';
import compression from 'compression';
import baidu from './engines/baidu.js'
import Adjust from './plugins/Adjust.js';
var app = express();
app.use(compression());

app.get('/search', async function(req, res){
  const query = req.query.query;
  const page = req.query.page??1;
  const pageSize = req.query.pageSize??10;

  const adjust = new Adjust(query, { page, pageSize });
  

  console.log(adjust.results)

  res.send(await adjust.results())
});

app.listen(3000, () => {
  console.log('http://localhost:3000/search?query=?')
});
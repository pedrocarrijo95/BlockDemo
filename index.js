const express = require('express');
const app = express();

const PORT=3000; 
app.use(express.static(__dirname + '/public'));

app.get('/fazenda',function(req,res) {
  res.type('text/html');
  res.sendFile(__dirname+'/public/html/indexFazenda.html');
  
});

app.get('/fabrica',function(req,res) {
  res.type('text/html');
  res.sendFile(__dirname+'/public/html/indexFabrica.html');
  
});

app.get('/distribuidora',function(req,res) {
  res.type('text/html');
  res.sendFile(__dirname+'/public/html/indexDistribuidora.html');
  
});

app.get('/maps',function(req,res) {
  res.type('text/html');
  res.sendFile(__dirname+'/public/html/indexMapsCerto.html');
  
});

app.get('/graph',function(req,res) {
  res.type('text/html');
  res.sendFile(__dirname+'/public/html/graph.html');
  
});

app.get('/smartcontract',function(req,res) {
  res.type('text/html');
  res.sendFile(__dirname+'/public/html/indexSmart.html');
  
});
//kill process linux " sudo kill -9 $(sudo lsof -t -i:3000) "
app.listen(process.env.port || PORT);
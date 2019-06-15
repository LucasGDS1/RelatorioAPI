var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get('/', function (req, res) {
  return res.send({ error: true, message: 'hello' })
});

app.get('/teste', function (req, res) {
  return res.send({ error: true, message: 'teste'})
});


var dbConn = mysql.createConnection({
  host: 'remotemysql.com',
  user: 'J9Sl5XhnVY',
  password: 'VP1azJHWBM',
  database: 'J9Sl5XhnVY'
});


dbConn.connect();


//Return all reports
app.get('/relatorios', function (req, res) {
  dbConn.query('SELECT * FROM relatorios', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Lista de relatorios.'});
  });
});


//Create a new report
app.post('/relatorio', function (req, res) {

  var relatorio = req.body.relatorio;

  if (!relatorio) {
    return res.status(400).send({ error:true, message: 'Erro, relatorio incompleto' });
  }

  dbConn.query("INSERT INTO relatorios SET ? ", [ relatorio ], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Relatorio salvo com sucesso'});
  });

});


//Update report with idRelatorio
app.put('/relatorio', function (req, res) {

  var id_report = req.body.id_report;
  var relatorio = req.body.relatorio;

  if (!id_report || !relatorio) {
    return res.status(400).send({ error: relatorio, message: 'Preencher relatorio e id do relatorio'});
  }

  dbConn.query("UPDATE relatorios SET ? WHERE idRelatorio = ?" , [relatorio, id_report], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Relatorio atualizado'});
  });
});


//Delete user bu id
app.delete('/deleterelatorio/:id', function (req, res) {

  var id_report = req.params.id;

  if (!id_report) {
    return res.status(400).send({ error: true, message: 'Preencher id_report' });
  }
  dbConn.query('DELETE FROM relatorios WHERE idRelatorio = ?', [id_report], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Relatorio excluido com sucesso.'});
  });
});



// app.listen(8080, function () {
//   console.log('Rodando')
// });

app.listen(process.env.PORT || 8080, function () {
  console.log("Rodando porta:", this.address().port, app.settings.env);
});

module.exports = app;

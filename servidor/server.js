//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var controller = require('./controlador/controlador')
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


app.get('/competencias',controller.traercompetencias);
app.get('/competencias/:id',controller.competencia);
app.get('/competencias/:id/peliculas',controller.traerpeliscompetencia);
app.get('/generos',controller.traergeneros);
app.get('/directores',controller.traerdirectores);
app.get('/actores',controller.traeractores);


app.post('/competencias/:idCompetencia/voto/',controller.votarunacompetencia);
app.post('/competencias',controller.crearcompetencia);

app.get('/competencias/:id/resultados',controller.traerresultadoscompetencia);



app.delete('/competencias/:idCompetencia/votos',controller.borrarvotos);
app.delete('/competencias/:idCompetencia',controller.borrarcompetencia);

app.put('/competencias/:idCompetencia',controller.editarcompetencia);

app.get('/',function (req, res) {
  res.send('¡Bienvenido a Peli vs Peli!');
});
//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = process.env.PORT || 8080;


app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

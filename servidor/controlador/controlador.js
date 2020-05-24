var con = require("../dba/conexionbd");


function traercompetencias(req, res) {
    var sql = "select * from competencias"

            con.query(sql, function(error, resultado) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }


        res.send(JSON.stringify(resultado));
    });
}


function traergeneros(req, res) {
    var sql = "select * from genero"
    con.query(sql, function(error, result) {
        if (error) {
            console.log(error)
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("No pudo crearse la competencia");
        }
        res.send(result);
    });
}


function traerdirectores(req, res) {
    var sql = "select * from director"
    con.query(sql, function(error, result) {
        if (error) {
            console.log(error)
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("No pudo crearse la competencia");
        }
        res.send(result);
    });
}


function traeractores(req, res) {
    var sql = "select * from actor"
    con.query(sql, function(error, result) {
        if (error) {
            console.log(error)
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("No pudo crearse la competencia");
        }
        res.send(result);
    });
}


function competencia(req, res) {
    var idCompetencia = req.params.id;
    var sql = "select competencias.nombre as 'nombre', genero.nombre as 'genero_nombre', actor.nombre as 'actor_nombre', director.nombre as 'director_nombre' from competencias "
            + "left outer join genero on competencias.genero_id = genero.id left outer join actor on competencias.actor_id = actor.id left outer join director on competencias.director_id = director.id "
            + " where competencias.id = " + idCompetencia
            con.query(sql, function(error, resultado) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        res.send(JSON.stringify(resultado));
    });
}


function traerpeliscompetencia(req, res) {


        var idCompetencia = req.params.id;

        var sql = `SELECT nombre, genero_id, director_id, actor_id FROM competencias WHERE id = ` + idCompetencia;


        con.query(sql, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }


           var genero_id = resultado[0].genero_id;
           var director_id = resultado[0].director_id;
           var actor_id = resultado[0].actor_id;

            sql =   "SELECT DISTINCT pelicula.id AS 'peliculaId', pelicula.genero_id AS 'generoId', "
                  + "pelicula.titulo, pelicula.poster, pelicula.anio "
                  + "FROM pelicula "

                  var sqlJoin = "";

                  //agregar los join segun corresponda
                  if ((genero_id) || (director_id) || (actor_id)) {

                      //genero los joins segun esten informados los criterios
                      if (genero_id)   {sqlJoin = sqlJoin + " left join genero as G on (pelicula.genero_id = G.id) ";}
                      if (director_id) {sqlJoin = sqlJoin + " left join director_pelicula as DP on (pelicula.id = DP.pelicula_id) ";}
                      if (actor_id)    {sqlJoin = sqlJoin + " left join actor_pelicula as AP on (pelicula.id = AP.pelicula_id) ";}

                  }

           var sqlWhere = "";

           //agregar palabra where si se informa algun criterio
           if ((genero_id) || (director_id) || (actor_id)) {

               sqlWhere = " where ";

               //genero el where segun esten informados los criterios
               if (genero_id)   {sqlWhere = sqlWhere + " G.id = " + genero_id + " and";}
               if (director_id) {sqlWhere = sqlWhere + " DP.director_id = " + director_id + " and";}
               if (actor_id)    {sqlWhere = sqlWhere + " AP.actor_id = " + actor_id + " and";}

               //eliminar and final del where
               sqlWhere = sqlWhere.substr(0, sqlWhere.length - 3)
           }

           //agrego el order by y el limit 2
           sql = sql + sqlJoin + sqlWhere + "Order by rand() limit 2 "

         con.query(sql, function(error, resultadoRamdom, fields) {
             if (error) {
                 console.log("Hubo un error en la consulta", error.message);
                 return res.status(500).send("Hubo un error en la consulta");
             }
             //validacion de consulta vacia
             if (resultadoRamdom.length == 0) {
                 console.log("nro de competencia no encontrado: " + idCompetencia);
                 return res.status(404).send("nro de competencia no encontrado: " + idCompetencia);
             } else {
               var response = {'competencia': resultado[0].nombre,
                               'peliculas': resultadoRamdom};
             }



             res.send(JSON.stringify(response));
         });

        });

}


function votarunacompetencia(req, res) {


var idCompetencia = req.params.idCompetencia;
            var votoPeli = req.body.idPelicula;

            var sql = "INSERT INTO `voto` VALUES (NULL," + votoPeli + "," + idCompetencia +")"

        con.query(sql, function(error, result) {
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(404).send("Hubo un error en la consulta");
                }

                res.send("Voto Ok");
            });


    }


function traerresultadoscompetencia(req, res) {


                var idCompetencia = req.params.id;
                var sql = "SELECT * FROM competencias WHERE id = " + idCompetencia;

                con.query(sql, function(error, resultado, fields) {
                    if (error) {
                        console.log("Hubo un error en la consulta", error.message);
                        return res.status(404).send("Hubo un error en la consulta");
                    }

                    if (resultado.length === 0) {
                        console.log("No se encontro ninguna competencia con este id");
                        return res.status(404).send("No se encontro ninguna competencia con este id");
                    }

                    var competencia = resultado[0];

                    var sql = "SELECT voto.pelicula_id, pelicula.poster, pelicula.titulo, COUNT(pelicula_id) As votos FROM voto INNER JOIN pelicula ON voto.pelicula_id = pelicula.id WHERE voto.competencias_id = " + idCompetencia + " GROUP BY voto.pelicula_id ORDER BY COUNT(pelicula_id) DESC LIMIT 3";

                    con.query(sql, function(error, resultado, fields) {
                        if (error) {
                            console.log("Hubo un error en la consulta", error.message);
                            return res.status(404).send("Hubo un error en la consulta");
                        }

                        var response = {
                            "competencia": competencia.nombre,
                            "resultados": resultado
                        };

                        res.send(JSON.stringify(response));
                    });
                });

    }


function crearcompetencia(req, res) {

            const nombreCompetencia = req.body.nombre,
            idGenero = req.body.genero,
            idDirector = req.body.director,
            idActor = req.body.actor,
            anio = parseInt(req.body.anio);

            if (!nombreCompetencia) {
                console.log("Debe completar el nombre de la competencia");
                return res.status(422).send("Debe completar el nombre de la competencia");
            }

            let sql = "SELECT * FROM competencias WHERE nombre = '" + nombreCompetencia + "'";

            con.query(sql, function(error, resultado, fields) {
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(404).send("Hubo un error en la consulta");
                }

                if (resultado.length === 1) {
                    console.log("Ya hay una competencia con este nomnbre");
                    return res.status(422).send("Ya hay una competencia con este nomnbre");
                }

                let sql = "SELECT count(pelicula.id) As cantidad FROM pelicula", join = "", where = "", campos = "nombre", valores = ") VALUES ('" + nombreCompetencia + "'";

                if (idGenero > 0) {
                    if (where.length > 0){
                        where += " and ";
                    } else {
                        where += " WHERE ";
                    }

                    where += "pelicula.genero_id = " + idGenero;
                    campos += ",genero_id";
                    valores += "," + idGenero;
                }

                if (idDirector > 0) {
                    join += " INNER JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id" ;

                    if (where.length > 0){
                        where += " and ";
                    } else {
                        where += " WHERE ";
                    }

                    where +=  "director_pelicula.director_id = " + idDirector;
                    campos += ",director_id";
                    valores += "," + idDirector;
                }

                if (idActor > 0) {
                    join += " INNER JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id" ;

                    if (where.length > 0){
                        where += " and ";
                    } else {
                        where += " WHERE ";
                    }

                    where += "actor_pelicula.actor_id = " + idActor;
                    campos += ",actor_id";
                    valores += "," + idActor;
                }

                if (anio > 0) {
                    if (where.length > 0){
                        where += " and ";
                    } else {
                        where += " WHERE ";
                    }

                    where += "pelicula.anio = " + anio;
                    campos += ",anio";
                    valores += "," + anio;
                }

                sql += join + where;

                con.query(sql, function(error, resultado, fields) {
                    if (error) {
                        console.log("Hubo un error en la consulta", error.message);
                        return res.status(404).send("Hubo un error en la consulta");
                    }

                    if (resultado.length === 0 || resultado[0].cantidad <= 1) {
                        console.log("Con este criterio no hay 2 peliculas como minimo");
                        return res.status(422).send("Con este criterio no hay 2 peliculas como minimo");
                    }

                    sql = "INSERT INTO competencias ("+ campos + valores + ")";

                    con.query(sql, function(error, resultado, fields) {
                        if (error) {
                            console.log("Hubo un error en la consulta", error.message);
                            return res.status(404).send("Hubo un error en la consulta");
                        }

                        res.status(200).send();
                    });
                });
            });

    }


function borrarcompetencia(req, res) {
        var idCompetencia = req.params.idCompetencia;
        var sql = "DELETE FROM competencias WHERE id =" + idCompetencia + ";"
        con.query(sql, function(error, result) {
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(404).send("No pudo borrarse la competencia");
                }
                res.send("Competencia Borrada Exitosamente");
            });
    }


function editarcompetencia(req, res) {
        var idCompetencia = req.params.idCompetencia;
        var competencia = req.body;
        var sql =   "UPDATE competencias SET "
                +   "nombre = '" + competencia.nombre + "'"
                /*+   ", genero_id = '" + competencia.genero + "' , "
                +   "director_id = '" + competencia.director + "' , "
                +   "actor_id = '" + competencia.actor + "' , "  */
                +   " WHERE id =" + idCompetencia + ";"

        con.query(sql, function(error, result) {
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(404).send("No pudo editarse la competencia");
                }
                res.send("Competencia Editada Exitosamente");
            });
    }


function borrarvotos(req, res) {
        var idCompetencia = req.params.idCompetencia;

        var sql = "DELETE FROM voto WHERE competencias_id = " + idCompetencia
        con.query(sql, function(error, result) {
            if (error) {
                console.log(error)
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("La competencia no existe");
            }
            res.send("Competencia Reiniciada exitosamente");
        });
    }




module.exports = {
    competencia: competencia,

    traerpeliscompetencia: traerpeliscompetencia,
    traerresultadoscompetencia: traerresultadoscompetencia,

    votarunacompetencia:votarunacompetencia,
    borrarvotos:borrarvotos,

    crearcompetencia: crearcompetencia,
    borrarcompetencia: borrarcompetencia,
    editarcompetencia: editarcompetencia,

    traercompetencias: traercompetencias,
    traergeneros: traergeneros,
    traerdirectores: traerdirectores,
    traeractores: traeractores
};

require("dotenv").config();
const { Pool } = require('pg')

const configuracion = {
  host: process.env.HOST_PSQL,
  user: process.env.USER_PSQL,
  password: process.env.PASSWORD_PSQL,
  database: process.env.DB_PSQL,
  port: process.env.PORT_PSQL,
}

const psqlConnection = new Pool(configuracion)
try {
  console.log("Base de datos correctamente enlazada");
} catch (error) {
  console.log("Erro al conectar la DB");
  console.log(error);
}

module.exports = psqlConnection;


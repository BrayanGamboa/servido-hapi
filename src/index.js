const hapi = require("@hapi/hapi");
const hapiSwagger = require("hapi-swagger");
const inert = require("@hapi/inert");
const vision = require("@hapi/vision");
const package = require("../package.json");

const { createServer } = require("http");
const { Server } = require("socket.io");

const mysqlConnection = require("./database");
const psqlConnection = require("./database");
const cors = require("cors");
const uploadFile = require("../configMulter");
require("dotenv").config();

const {
  vehiculoSchemmaNew,
  vehiculoSchemmaEdit,
} = require("./models/vehiculo");
const marcaSchemmaEdit = require("./models/marca");
const lineaSchemmaEdit = require("./models/linea");
const { userSchemmaNew } = require("./models/users");
const { userSchemmaEdit } = require("./models/users");

const init = async () => {
  const servidor = new hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: true,
    },
  });

  const swaggerOptions = {
    info: {
      title: "Semillero S.A.S",
      description:
        "Por medio de esta documentación buscamos como empresa dar a conocer a nuestros usuarios la manera correcta de cómo usar nuestros servicios. Esperamos les ayude.",
      version: package.version,
    },
  };

  await servidor.register([
    inert,
    vision,
    {
      plugin: hapiSwagger,
      options: swaggerOptions,
    },
  ]);

  await servidor.start();
  console.log("Servidor corriendo en la ruta:", servidor.info.uri);

  servidor.route({
    method: "GET",
    path: "/",
    handler: async (request, h) => {
      try {
        return h
          .response(
            "<center> <h1>La empresa 'Semillero S.A.S' les da una cordial bienvenida.<br><br>(⌐■_■)</h1></center>"
          )
          .code(200);
      } catch (error) {
        return h.response(error).code(500);
      }
    },
  });


  servidor.route({
    method: "GET",
    path: "/marca",
    handler: async (request, h) => {
      const { rows } = await psqlConnection.query(`SELECT * FROM marca;`);
      try {
        if (!rows == []) {
          return h.response(JSON.stringify(rows)).code(200);
        } else {
          return h.response(`Sin datos`).code(204);
        }
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description: "Get Marcas",
      notes: "Obtienes todas las marcas registradas en el sistema",
      tags: ["api", "Marcas"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });

  servidor.route({
    method: "GET",
    path: "/vehiculo",
    handler: async (request, h) => {
      try {
        const { rows } = await psqlConnection.query(`SELECT * FROM vehiculo;`);
        if (!rows == []) {
          return h.response(JSON.stringify(rows)).code(200);
        } else {
          return h.response(`Sin datos`).code(204);
        }
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description: "Get Vehículos",
      notes: "Obtiene todos los vehículos registrados en el sistema",
      tags: ["api", "Vehículos"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });

  servidor.route({
    method: "GET",
    path: "/linea",
    handler: async (request, h) => {
      try {
        const { rows } = await psqlConnection.query(`SELECT * FROM linea;`);
        if (!rows == []) {
          return h.response(rows).code(200);
        } else {
          return h.response(`Sin datos`).code(204);
        }
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description: "Get Líneas",
      notes: "Obtiene todas las líneas registradas en el sistema",
      tags: ["api", "Líneas"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });

  servidor.route({
    method: "GET",
    path: "/minmax",
    handler: async (request, h) => {
      try {
        const { rows } = await psqlConnection.query(
          `SELECT MIN(modelo), MAX(modelo) FROM vehiculo;`
        );
        if (!rows[0] == "") {
          return h.response(JSON.stringify(rows[0])).code(200);
        } else {
          return h.response(`Sin datos`).code(204);
        }
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description:
        "Get valores mínimos y máximos en los modelos de los vehículos",
      tags: ["api", "Auxiliares", "Vehículos"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });
  servidor.route({
    method: "GET",
    path: "/sum",
    handler: async (request, h) => {
      try {
        const { rows } = await psqlConnection.query(
          `SELECT SUM(id_linea) FROM linea;`
        );
        if (!rows[0] == "") {
          return h.response(JSON.stringify(rows[0])).code(200);
        } else {
          return h.response(`Sin datos`).code(204);
        }
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description: "Get de suma sobre los id de las líneas",
      notes: "Página de inicio",
      tags: ["api", "Auxiliares", "Líneas"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });
  servidor.route({
    method: "GET",
    path: "/prom",
    handler: async (request, h) => {
      try {
        const { rows } = await psqlConnection.query(
          `SELECT AVG(id_linea) FROM linea;`
        );
        if (!rows[0] == "") {
          return h.response(JSON.stringify(rows[0])).code(200);
        } else {
          return h.response(`Sin datos`).code(204);
        }
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description: "Get de promedio sobre los id de las líneas",
      tags: ["api", "Auxiliares", "Líneas"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });

  // Por coregir

  servidor.route({
    method: "GET",
    path: "/activos",
    handler: async (request, h) => {
      try {
        const { rows } = await psqlConnection.query(
          `SELECT COUNT(estado) FROM linea;`
        );
        if (!rows[0] == "") {
          return h.response(JSON.stringify(rows[0])).code(200);
        } else {
          return h.response(`Sin datos`).code(204);
        }
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description: "Get de cantidad de líneas activas",
      tags: ["api", "Auxiliares", "Líneas"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });

  servidor.route({
    method: "GET",
    path: "/filter_seguro/{fecha1}/{fecha2}",
    handler: async (request, h) => {
      try {
        const { rows } = await psqlConnection.query(
          `SELECT * FROM vehiculo WHERE fch_vence_seg >= '${request.params.fecha1}' AND fch_vence_seg <= '${request.params.fecha2}';`
        );
        if (!rows[0] == "") {
          return h.response(JSON.stringify(rows)).code(200);
        } else {
          return h.response(`Sin datos`).code(204);
        }
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description: "Filtro de vehículos con seguros vencidos.",
      tags: ["api", "Auxiliares", "Vehículos"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });
  servidor.route({
    method: "GET",
    path: "/filter_modelo/{fecha1}/{fecha2}",
    handler: async (request, h) => {
      try {
        const { rows } = await psqlConnection.query(
          `SELECT * FROM vehiculo WHERE modelo >= '${request.params.fecha1}' AND modelo <= '${request.params.fecha2}';`
        );
        if (!rows[0] == "") {
          return h.response(JSON.stringify(rows)).code(200);
        } else {
          return h.response(`Sin datos`).code(204);
        }
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description: "Filtro de vehículos por modelo.",
      tags: ["api", "Auxiliares", "Vehículos"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });
  servidor.route({
    method: "GET",
    path: "/consultcarr",
    handler: async (request, h) => {
      try {
        const { rows } = await psqlConnection.query(`
                    SELECT vehiculo.num_placa, vehiculo.modelo, linea.descripcion, marca.descripcion
                    FROM ( ( linea INNER JOIN vehiculo ON vehiculo.linea = linea.id_linea)
                    INNER JOIN marca ON marca.nombre = linea.nombre_marca);`);
        if (rows) {
          return h.response(JSON.stringify(rows)).code(200);
        } else {
          return h.response(`Sin datos`).code(204);
        }
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description: "Consulta de vehículos por marca y línea.",
      tags: ["api", "Auxiliares"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });
  servidor.route({
    method: "GET",
    path: "/marca/{nombre_marca}",
    handler: async (request, h) => {
      try {
        const { rows } = await psqlConnection.query(
          `SELECT * FROM marca WHERE nombre = '${request.params.nombre_marca}';`
        );
        if (!rows[0] == "") {
          return h.response(JSON.stringify(rows[0])).code(200);
        } else {
          return h.response(`Sin datos`).code(204);
        }
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description: "Obtener los datos de una marca por su nombre.",
      tags: ["api", "Marcas"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });
  servidor.route({
    method: "GET",
    path: "/linea/{id}",
    handler: async (request, h) => {
      try {
        const { rows } = await psqlConnection.query(
          `SELECT * FROM linea WHERE id_linea = ${request.params.id};`
        );
        if (!rows[0] == "") {
          return h.response(JSON.stringify(rows[0])).code(200);
        } else {
          return h.response(`Sin datos`).code(204);
        }
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description: "Obtener los datos de una línea por su id.",
      tags: ["api", "Líneas"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });
  servidor.route({
    method: "GET",
    path: "/vehiculo/{placa}",
    handler: async (request, h) => {
      try {
        const { rows } = await psqlConnection.query(
          `SELECT * FROM vehiculo WHERE num_placa = '${request.params.placa}';`
        );
        if (rows) {
          return h.response(JSON.stringify(rows[0])).code(200);
        } else {
          return h.response(`Sin datos`).code(204);
        }
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description: "Obtener los datos de un vehículo por su placa.",
      tags: ["api", "Vehículos"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });

  servidor.route({
    method: "POST",
    path: "/vehiculo",
    options: {
      handler: async (request, h) => {
        const {
          num_placa,
          fch_vence_seg,
          modelo,
          fch_vence_tecno,
          linea,
          url_img,
        } = request.payload;
        await psqlConnection.query(`INSERT INTO vehiculo (num_placa,  modelo,fch_vence_seg, 
          fch_vence_tecno, linea, url_img) VALUES ('${num_placa}', '${modelo}','${fch_vence_seg}',  '${fch_vence_tecno}', 
          ${linea}, '${url_img}');`);
        try {
          return h.response("Vehículo registrado correctamente").code(200);
        } catch (error) {
          console.log(error);
          return h.response(error).code(409);
        }
      },
      description: "Crear un vehículo.",
      tags: ["api", "Vehículos"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
      validate: {
        payload: vehiculoSchemmaNew,
      },
    },
  });


  servidor.route({
    method: "POST",
    path: "/vehi",
    handler: async (request, h) => {
      uploadFile((err) => {
        if (err) {
          console.log(err);
          err.message = "Error al subir archivo";
          res.send(err);
        }
        if (req.file) console.log(req.file);
        else if (req.files) console.log(req.files);
        res.send("Archivo subido").status(200);
      });

      try {
        return h.response(tareaGuardada).code(200);
      } catch (error) {
        console.log(error);
        return h.response(error).code(409);
      }
    },
  });

  servidor.route({
    method: "DELETE",
    path: "/vehiculo/{placa}",
    handler: async (request, h) => {
      try {
        await psqlConnection.query(
          `DELETE FROM vehiculo WHERE num_placa = '${request.params.placa}';`
        );
        return h.response(`Vehículo eliminado correctamente`).code(200);
      } catch (error) {
        return h.response(error).code(409);
      }
    },
    options: {
      description: "Borrar un vehículo por su placa.",
      tags: ["api", "Vehículos"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
    },
  });


  servidor.route({
    method: "PUT",
    path: "/vehiculo/{placa}",
    options: {
      handler: async (request, h) => {
        const placa = request.params.placa;
        const { fch_vence_seg, modelo, fch_vence_tecno, linea, url_img } =
          request.payload;
        await psqlConnection.query(
          `UPDATE vehiculo SET modelo = '${modelo}', fch_vence_seg = '${fch_vence_seg}', fch_vence_tecno = '${fch_vence_tecno}', linea = ${linea}, url_img = '${url_img}' WHERE num_placa = '${placa}';`
        );
        try {
          return h.response("Vehículo actualizado correctamente").code(200);
        } catch (error) {
          console.log(error);
          return h.response(error).code(409);
        }
      },
      description: "Actualizar un vehículo por su placa.",
      tags: ["api", "Vehículos"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
      validate: {
        payload: vehiculoSchemmaEdit,
      },
    },
  });

  servidor.route({
    method: "PUT",
    path: "/marca/{nombre_marca}",
    options: {
      handler: async (request, h) => {
        const nombre_marca = request.params.nombre_marca;
        const { descripcion, estado } = request.payload;
        await psqlConnection.query(
          `UPDATE marca SET descripcion = '${descripcion}', estado = '${estado}' WHERE nombre = '${nombre_marca}';`
        );
        try {
          return h
            .response(`La marca '${nombre_marca}' se actualizó correctamente`)
            .code(200);
        } catch (error) {
          console.log(error);
          return h.response(error).code(409);
        }
      },
      description: "Actualizar una marca por su nombre.",
      tags: ["api", "Marcas"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
      validate: {
        payload: marcaSchemmaEdit,
      },
    },
  });

  servidor.route({
    method: "PUT",
    path: "/linea/{id_linea}",
    options: {
      handler: async (request, h) => {
        const id_linea = request.params.id_linea;
        const { descripcion, estado } = request.payload;
        await psqlConnection.query(
          `UPDATE linea SET descripcion = '${descripcion}', estado = '${estado}' WHERE id_linea = ${id_linea};`
        );
        try {
          return h
            .response(
              `La linea con el id '${id_linea}' se actualizó correctamente`
            )
            .code(200);
        } catch (error) {
          console.log(error);
          return h.response(error).code(409);
        }
      },
      description: "Actualizar una linea por su id.",
      tags: ["api", "Líneas"],
      plugins: {
        "hapi-swagger": {
          responses: {
            200: { description: "Petición correcta" },
            204: { descripcion: "Sin datos registrados" },
            409: { descripcion: "Conflicto de datos" },
            500: { descripcion: "Error interno del servidor" },
          },
        },
      },
      validate: {
        payload: lineaSchemmaEdit,
      },
    },
  });

};

init();


// routes/calendarRoutes.js
const { ObjectId } = require('mongodb');
const { format } = require('date-fns');
const { es } = require('date-fns/locale');
const {
  registrarQuestDiaria,
  obtenerCalendario,
  calcularRachaActual
} = require("../controllers/calendarController.js");

async function calendarRoutes(fastify, options) {
  const db = fastify.mongo.db;

  // 🔹 Obtener calendario del jugador filtrado por año y mes (por defecto, el mes actual)
  fastify.get("/calendar", { preValidation: [fastify.authenticate] }, async (req, reply) => {
    const user = req.user;

    if (!user || !user.jugadorId) {
      return reply.code(401).send({ error: "No autorizado o sin jugador asociado" });
    }

    let { año, mes } = req.query;

    if (!año || !mes) {
      const hoy = new Date();
      año = hoy.getFullYear();
      mes = format(hoy, "LLLL", { locale: es }).toLowerCase();
    }

    try {
      const calendario = await obtenerCalendario(user.jugadorId, año, mes);
      return reply.send({ calendario });
    } catch (error) {
      console.error(error);
      return reply.code(404).send({ error: error.message });
    }
  });

  // 🔹 Registrar quest diaria (agrega la fecha actual si no está en el calendario)
  fastify.post("/calendar/complete", { preValidation: [fastify.authenticate] }, async (req, reply) => {
    const user = req.user;

    if (!user || !user.jugadorId) {
      return reply.code(401).send({ error: "No autorizado o sin jugador asociado" });
    }

    try {
      const calendarioActualizado = await registrarQuestDiaria(user.jugadorId);
      return reply.send({ success: true, calendario: calendarioActualizado });
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Error al registrar la quest diaria" });
    }
  });

  // 🔹 Obtener la racha actual de días consecutivos con quest completada
  fastify.get("/calendar/racha", { preValidation: [fastify.authenticate] }, async (req, reply) => {
    const user = req.user;

    if (!user || !user.jugadorId) {
      return reply.code(401).send({ error: "No autorizado o sin jugador asociado" });
    }

    try {
      const racha = await calcularRachaActual(user.jugadorId);
      return reply.send({ racha });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: "Error al calcular la racha" });
    }
  });
}

module.exports = calendarRoutes;

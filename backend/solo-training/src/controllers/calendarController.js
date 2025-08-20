//controllers/calendarController.js
const { ObjectId } = require('mongodb');
const { format, parseISO, subDays, isSameDay } = require('date-fns');

// 🔹 Funcion para obtener el calendario
async function obtenerCalendario(db, jugadorId, año, mes) {
  const player = await db.collection('players').findOne({ _id: new ObjectId(jugadorId) });

  if (!player) throw new Error("Jugador no encontrado");

  const fechasFiltradas = (player.calendar || []).filter(fechaISO => {
    const fecha = new Date(fechaISO);
    return fecha.getFullYear() == año && 
           fecha.toLocaleString('es-ES', { month: 'long' }).toLowerCase() === mes.toLowerCase();
  });

  return fechasFiltradas;
}

// 🔹 Funcion para registrar un dia en el calendario
async function registrarQuestDiaria(db, jugadorId) {
  const hoy = format(new Date(), "yyyy-MM-dd");

  const player = await db.collection("players").findOne({ _id: new ObjectId(jugadorId) });
  if (!player) throw new Error("Jugador no encontrado");

  // Inicializar calendario si no existe
  if (!player.calendar) player.calendar = [];

  // Evitar duplicados
  if (!player.calendar.includes(hoy)) {
    const updated = await db.collection("players").findOneAndUpdate(
      { _id: new ObjectId(jugadorId) },
      { $push: { calendar: hoy } },
      { returnDocument: "after" }
    );
    return updated.value.calendar;
  }

  return player.calendar; // Ya registrado hoy
}

// 🔹 Funcion para calcular la racha de días
async function calcularRachaActual(db, jugadorId) {
  const player = await db.collection("players").findOne({ _id: new ObjectId(jugadorId) });

  if (!player || !player.calendar || player.calendar.length === 0) return 0;

  const fechas = player.calendar
    .map(fecha => format(new Date(fecha), "yyyy-MM-dd"))
    .sort()
    .reverse();

  let racha = 0;
  let fechaEsperada = format(new Date(), "yyyy-MM-dd"); // Hoy

  for (const fecha of fechas) {
    if (fecha === fechaEsperada) {
      racha++;
      fechaEsperada = format(subDays(new Date(fechaEsperada), 1), "yyyy-MM-dd");
    } else {
      break; // se cortó la racha
    }
  }

  return racha;
}

module.exports = {
  obtenerCalendario,
  registrarQuestDiaria,
  calcularRachaActual
};
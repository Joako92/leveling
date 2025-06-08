const { ObjectId } = require('mongodb');
const { format } = require('date-fns');

async function agregarEjercicioAQuest(db, jugadorId, exerciseId) {
    const jugadores = db.collection('jugadores');
    const inventario = db.collection('inventario');
  
    const jugador = await jugadores.findOne({ _id: new ObjectId(jugadorId) });
    if (!jugador) throw new Error("Jugador no encontrado");
  
    const ejercicioInventario = await inventario.findOne({ _id: new ObjectId(exerciseId) });
    if (!ejercicioInventario) throw new Error("Ejercicio no encontrado en el inventario");
  
    const questActual = jugador.questDiaria || {
      fecha: format(new Date(), 'yyyy-MM-dd'),
      ejercicios: []
    };
  
    const yaExiste = questActual.ejercicios.some(ej => ej.exerciseId.toString() === exerciseId);
    if (yaExiste) throw new Error("El ejercicio ya está en la quest diaria");
  
    const xp = 0;
    const nivel = 1;
    const quantity = ejercicioInventario.niveles["1"];
  
    const nuevoEjercicio = {
      exerciseId: ejercicioInventario._id,
      nombre: ejercicioInventario.nombre,
      grupo: ejercicioInventario.grupo,
      xp,
      nivel,
      quantity,
      completado: false
    };
  
    questActual.ejercicios.push(nuevoEjercicio);
  
    await jugadores.updateOne(
      { _id: new ObjectId(jugadorId) },
      { $set: { questDiaria: questActual } }
    );
  
    return nuevoEjercicio;
  }

/**
 * Esta función actualiza la quest diaria si es un nuevo día:
 * - Suma XP a los ejercicios cumplidos
 * - Recalcula nivel
 * - Reinicia los checks
 * - Actualiza la fecha
 */
async function actualizarQuestDiaria(db, jugadorId) {
  const jugadores = db.collection('jugadores');

  const jugador = await jugadores.findOne({ _id: new ObjectId(jugadorId) });
  if (!jugador || !jugador.questDiaria) return;

  const hoy = new Date().toISOString().slice(0, 10);
  const ultimaFecha = jugador.questDiaria.fecha?.slice(0, 10);

  if (hoy === ultimaFecha) return; // Ya se actualizó hoy

  const ejerciciosActualizados = jugador.questDiaria.ejercicios.map((ej) => {
    const nuevoXP = ej.cumplido ? ej.xp + 1 : ej.xp;
    return {
      ...ej,
      xp: nuevoXP,
      nivel: Math.floor(nuevoXP / 3),
      cumplido: false
    };
  });

  await jugadores.updateOne(
    { _id: new ObjectId(jugadorId) },
    {
      $set: {
        'questDiaria.ejercicios': ejerciciosActualizados,
        'questDiaria.fecha': hoy
      }
    }
  );
}

async function agregarEjercicioAQuestDiaria(db, jugadorId, ejercicioId) {
  const jugadores = db.collection('jugadores');
  const inventory = db.collection('inventory');

  const jugador = await jugadores.findOne({ _id: new ObjectId(jugadorId) });
  if (!jugador) throw new Error('Jugador no encontrado');

  // Verificamos que ya tenga questDiaria
  if (!jugador.questDiaria || !Array.isArray(jugador.questDiaria.ejercicios)) {
    throw new Error('No hay questDiaria activa');
  }

  // Revisamos que no esté repetido
  const yaExiste = jugador.questDiaria.ejercicios.some(
    (ej) => ej.exerciseId?.toString() === ejercicioId
  );
  if (yaExiste) throw new Error('Ese ejercicio ya fue agregado');

  // Obtenemos datos del ejercicio desde el inventario
  const ejercicio = await inventory.findOne({ _id: new ObjectId(ejercicioId) });
  if (!ejercicio) throw new Error('Ejercicio no encontrado en el inventario');

  // Iniciamos el ejercicio con XP y cumplido en false
  const nuevoEjercicio = {
    _id: new ObjectId(), // ID interno para el array
    exerciseId: ejercicio._id,
    nombre: ejercicio.nombre,
    xp: 0,
    nivel: 0,
    cumplido: false
  };

  await jugadores.updateOne(
    { _id: new ObjectId(jugadorId) },
    { $push: { 'questDiaria.ejercicios': nuevoEjercicio } }
  );

  return nuevoEjercicio;
}

module.exports = {
  agregarEjercicioAQuest,
  actualizarQuestDiaria,
  agregarEjercicioAQuestDiaria,
}
const { ObjectId } = require( 'mongodb');

async function questRoutes(fastify, options) {
  const db = fastify.mongo.db;
  // 1. Agregar ejercicio a la quest del jugador
  fastify.post('/quest/add', {
    schema: {
      body: {
        type: 'object',
        required: ['exerciseId'],
        properties: {
          exerciseId: { type: 'string' }
        }
      }
    },
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      const { exerciseId } = request.body;
      const jugadorId = request.user.jugadorId;

      try {
        // Obtener el jugador del usuario autenticado
        const player = await db.collection('players').findOne({ _id: new ObjectId(jugadorId) });
        if (!player) return reply.code(404).send({ message: 'Jugador no encontrado', jugadorId });

        // Obtener el ejercicio desde la base
        const ejercicio = await fastify.mongo.db.collection('exercises').findOne({ _id: new ObjectId(exerciseId) });
        if (!ejercicio) return reply.code(404).send({ message: 'Ejercicio no encontrado' });

        // Armar estructura para guardar en la quest
        const ejercicioParaQuest = {
          _id: new ObjectId(), // id interno de la quest
          ejercicioId: ejercicio._id,
          nombre: ejercicio.nombre,
          grupo: ejercicio.grupo,
          nivel: 1,
          xp: 0,
          descripcion: ejercicio.descripcion,
          completado: false
        };

        // Agregar a la quest del jugador
        await db.collection('players').updateOne(
          { _id: new ObjectId(jugadorId) },
          { $push: { questDiaria: ejercicioParaQuest } }
        );

        reply.send({ message: 'Ejercicio agregado a la quest' });
      } catch (err) {
        console.error(err);
        reply.code(500).send({ message: 'Error al agregar ejercicio a la quest' });
      }
    }
  });

  // 2. Obtener la quest actual del jugador
  fastify.get('/quest', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      const { jugadorId } = request.user;

      if (!jugadorId || !ObjectId.isValid(jugadorId)) {
        return reply.code(400).send({ message: 'ID de jugador inválido' });
      }

      const player = await db.collection('players').findOne({ _id: new ObjectId(jugadorId) });

      if (!player) {
        return reply.code(404).send({ message: 'Jugador no encontrado' });
      }

      if (!player.questDiaria) {
        return reply.code(404).send({ message: 'El jugador no tiene quest diaria asignada' });
      }

      const enrichedQuest = await Promise.all(
        player.questDiaria.map(async (ej) => {
          const ejercicio = await db.collection('exercises').findOne({ _id: new ObjectId(ej.ejercicioId) });

          const nivelActual = ej.nivel || 1;
          const config = ejercicio?.niveles?.[nivelActual.toString()] || null;

          return {
            ...ej,
            repeticiones: config,
            descripcion: ejercicio.descripcion,
            grupo: ejercicio.grupo,
          };
        })
      );

      reply.send(enrichedQuest);
    }
  });


  // 3. Marcar ejercicio como completado
  fastify.put('/quest/complete', {
    schema: {
      body: {
        type: 'object',
        required: ['exerciseId'],
        properties: {
          exerciseId: { type: 'string' },
        }
      }
    },
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      const { exerciseId } = request.body;
      const jugadorId = request.user.jugadorId;

      try {
        const jugador = await db.collection('players').findOne({ _id: new ObjectId(jugadorId) });
        if (!jugador) return reply.code(404).send({ message: 'Jugador no encontrado' });

        const ejercicio = jugador.questDiaria.find(e => e._id.toString() === exerciseId);
        if (!ejercicio) return reply.code(404).send({ message: 'Ejercicio no encontrado' });

        const nuevaXp = (ejercicio.xp || 0) + 1;
        const nuevoNivel = Math.min(5, Math.floor(nuevaXp / 3) + 1);

        const result = await db.collection('players').updateOne(
          {
            _id: new ObjectId(jugadorId),
            'questDiaria._id': new ObjectId(exerciseId)
          },
          {
            $set: {
              'questDiaria.$.completado': true,
              'questDiaria.$.xp': nuevaXp,
              'questDiaria.$.nivel': nuevoNivel
            }
          }
        );

        reply.send({ message: 'Estado actualizado correctamente' });
      } catch (err) {
        console.error(err);
        reply.code(500).send({ message: 'Error al actualizar el estado del ejercicio' });
      }
    }
  });

  // 4. Eliminar ejercicio de la quest
  fastify.delete('/quest/remove/:questExerciseId', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      const jugadorId = request.user.jugadorId;
      const { questExerciseId } = request.params;

      if (!ObjectId.isValid(questExerciseId)) {
        return reply.code(400).send({ message: 'ID de ejercicio inválido' });
      }

      try {
        const result = await db.collection('players').updateOne(
          { _id: new ObjectId(jugadorId) },
          { $pull: { questDiaria: { _id: new ObjectId(questExerciseId) } } }
        );

        if (result.modifiedCount === 0) {
          return reply.code(404).send({ message: 'Ejercicio no encontrado en la quest', questExerciseId });
        }

        reply.send({ message: 'Ejercicio eliminado de la quest' });
      } catch (err) {
        console.error(err);
        reply.code(500).send({ message: 'Error al eliminar el ejercicio de la quest' });
      }
    }
  });

  // 5. Sumar xp a un ejercicio
  fastify.put('/quest/xpup', {
  schema: {
    body: {
      type: 'object',
      required: ['questExerciseId'],
      properties: {
        questExerciseId: { type: 'string' },
      }
    }
  },
  preHandler: [fastify.authenticate],
  handler: async (request, reply) => {
    const { questExerciseId } = request.body;
    const jugadorId = request.user.jugadorId;

    try {
      const jugador = await db.collection('players').findOne({ _id: new ObjectId(jugadorId) });
      if (!jugador) return reply.code(404).send({ message: 'Jugador no encontrado' });

      const ejercicio = jugador.questDiaria.find(e => e._id.toString() === questExerciseId);
      if (!ejercicio) return reply.code(404).send({ message: 'Ejercicio no encontrado' });

      const nuevaXp = (ejercicio.xp || 0) + 1;
      const nuevoNivel = Math.floor(nuevaXp / 3) + 1;

      const result = await db.collection('players').updateOne(
        {
          _id: new ObjectId(jugadorId),
          'questDiaria._id': new ObjectId(questExerciseId)
        },
        {
          $set: {
            'questDiaria.$.xp': nuevaXp,
            'questDiaria.$.nivel': nuevoNivel
          }
        }
      );

      reply.send({ message: 'XP y nivel actualizados', xp: nuevaXp, nivel: nuevoNivel });

    } catch (err) {
      console.error(err);
      reply.code(500).send({ message: 'Error al actualizar XP y nivel' });
    }
  }
});
}

module.exports = questRoutes;

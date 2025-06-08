//routes/exerciseRoutes.js
const { ObjectId } = require( 'mongodb');
const { exerciseSchema } = require('../schemas/exerciseSchema');

async function exerciseRoutes(fastify, options) {
  const db = fastify.mongo.db;
  const collection = db.collection('exercises');

  // 🔹 Ruta para crear un ejercicio
  fastify.post('/exercises', { schema: exerciseSchema }, async (req, reply) => {
    const ejercicio = req.body;

    try {
      const result = await collection.insertMany(ejercicio);
      return reply.code(201).send({ _id: result.insertedId, ...ejercicio });
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: 'Error al crear el ejercicio' });
    }
  });

  // 🔹 Ruta para obtener todos los ejercicios
  fastify.get('/exercises', async (req, reply) => {
    try {
      const ejercicios = await collection.find().toArray();
      return reply.send(ejercicios);
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: 'Error al obtener ejercicios' });
    }
  });

  // 🔹 Ruta para obtener un ejercicio por ID
  fastify.get('/exercises/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const ejercicio = await collection.findOne({ _id: new fastify.mongo.ObjectId(id) });
      if (!ejercicio) return reply.code(404).send({ error: 'Ejercicio no encontrado' });
      reply.send(ejercicio);
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: 'Error al obtener el ejercicio' });
    }
  });

  // 🔹 Ruta para eliminar ejercicio
  fastify.delete('/exercises/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await collection.deleteOne({ _id: new fastify.mongo.ObjectId(id) });
      if (result.deletedCount === 0) {
        return reply.code(404).send({ error: 'Ejercicio no encontrado' });
      }
      reply.send({ message: 'Ejercicio eliminado' });
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: 'Error al eliminar el ejercicio' });
    }
  });
}

module.exports = exerciseRoutes;

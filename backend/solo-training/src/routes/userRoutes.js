const { ObjectId } = require('mongodb');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { userSchema, loginSchema, updateUserSchema } = require('../schemas/userSchema');
const crypto = require('crypto');

async function userRoutes(fastify, options) {
  const db = fastify.mongo.db;

   // 🔹 Obtener todos los usuarios
   fastify.get('/users', async (request, reply) => {
    try {
      const users = await db.collection('users').find().toArray();
      return reply.send(users);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Error al obtener usuarios" });
    }
  });

  // 🔹 Registrar usuario
  fastify.post('/users/register', { schema: userSchema }, async (request, reply) => {
    try {
      const { email, password } = request.body;

      // Verificar si el usuario ya existe
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return reply.status(400).send({ error: "El email ya está registrado" });
      }

      // Crear nuevo usuario
      const user = new User(email, password);
      await user.hashPassword();
      const result = await db.collection('users').insertOne(user);

      // Generar token JWT
      const token = fastify.jwt.sign({ userId: result.insertedId });

      return reply.status(201).send({ 
        message: "Usuario registrado con éxito", 
        userId: result.insertedId,
        token
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Error al registrar usuario" });
    }
  });

  // 🔹 Login de usuario
  fastify.post('/users/login', { schema: loginSchema }, async (request, reply) => {
    try {
      const { email, password } = request.body;
      const user = await db.collection('users').findOne({ email });

      if (!user) return reply.status(400).send({ error: "Usuario no encontrado" });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return reply.status(400).send({ error: "Contraseña incorrecta" });

      // Generar token JWT con jugadorId incluido
      const token = fastify.jwt.sign({ userId: user._id, jugadorId: user.jugadorId });

      return reply.send({ message: "Login exitoso", token });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Error al iniciar sesión" });
    }
  });

  // 🔹 Actualizar perfil de usuario
  fastify.put('/users/profile', { preValidation: [fastify.authenticate], schema: updateUserSchema }, async (request, reply) => {
    try {
      const { email } = request.body;
      const userId = request.user.userId;

      // Validar que el usuario existe
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return reply.status(404).send({ error: "Usuario no encontrado" });
      }

      // Actualizar solo los campos que se envían en la solicitud
      const updateData = {};
      if (email) {
        // Verificar si el email ya está registrado por otro usuario
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
          return reply.status(400).send({ error: "El email ya está registrado" });
        }
        updateData.email = email;
      }

      await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

      reply.send({ message: "Perfil actualizado correctamente" });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Error al actualizar el perfil", details: error.message });
    }
  }); 

  // 🔹 Cambiar contraseña de usuario
  fastify.put('/users/change-password', { preValidation: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { currentPassword, newPassword } = request.body;
      const userId = request.user.userId;

      // Validar que el usuario existe
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return reply.status(404).send({ error: "Usuario no encontrado" });
      }

      // Verificar que la contraseña actual es correcta
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return reply.status(400).send({ error: "Contraseña actual incorrecta" });
      }

      // Encriptar la nueva contraseña
      const userToUpdate = new User(user.nombre, user.email, newPassword, user.jugadorId);
      await userToUpdate.hashPassword();

      // Actualizar la contraseña en la base de datos
      await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: { password: userToUpdate.password } });

      reply.send({ message: "Contraseña cambiada correctamente" });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Error al cambiar la contraseña", details: error.message });
    }
  });

  // 🔹 Recuperar contraseña (inicio)
  fastify.post('/users/forgot-password', async (request, reply) => {
    try {
      const { email } = request.body;

      const user = await db.collection('users').findOne({ email });
      if (!user) {
        return reply.status(404).send({ error: "No existe un usuario con ese email" });
      }

      // Generar token de reseteo (válido por 1 hora)
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hora

      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { resetToken, resetTokenExpiry } }
      );

      // Mostrar el link (simulando un email)
      const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`; // ajustá al dominio real de tu frontend
      console.log("🔗 Link de recuperación:", resetLink);

      return reply.send({ message: "Se envió un enlace de recuperación al email (simulado)", resetLink });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Error al procesar la solicitud de recuperación" });
    }
  });

  // 🔹 Resetear contraseña
  fastify.post('/users/reset-password', async (request, reply) => {
    try {
      const { token, newPassword } = request.body;

      const user = await db.collection('users').findOne({ resetToken: token });

      if (!user || !user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
        return reply.status(400).send({ error: "Token inválido o expirado" });
      }

      // Hash de la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña y limpiar el token
      await db.collection('users').updateOne(
        { _id: user._id },
        {
          $set: { password: hashedPassword },
          $unset: { resetToken: "", resetTokenExpiry: "" }
        }
      );

      return reply.send({ message: "Contraseña restablecida correctamente" });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Error al restablecer la contraseña" });
    }
  });
}

module.exports = userRoutes;

//schemas/exerciseSchema.js
const exerciseSchema = {
    body: {
      type: 'array',
      items: {
        type: 'object',
        required: ['nivelMinimo', 'grupo', 'nombre', 'descripcion', 'niveles'],
        properties: {
          nivelMinimo: { type: 'integer', minimum: 1 },
          grupo: { type: 'string', enum: ['core', 'upper body', 'lower body', 'cardio'] },
          nombre: { type: 'string' },
          descripcion: { type: 'string' },
          niveles: {
            type: 'object',
            required: ['1', '2', '3', '4', '5'],
            properties: {
              '1': { type: 'string' }, // ej: "3x10"
              '2': { type: 'string' },
              '3': { type: 'string' },
              '4': { type: 'string' },
              '5': { type: 'string' }
            }
          }
        }
      }
    }
  };
  
  module.exports = { exerciseSchema };
  
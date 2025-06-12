/**
 * Modelo de Post (Mongoose)
 * -------------------------
 * Representa una publicación de soporte técnico generada por un usuario.
 * Incluye:
 *  - asunto: título del post
 *  - descripcion: texto enriquecido
 *  - mensajes: array de respuestas entre usuario y administrador
 *  - ticket: código único generado cuando el admin responde por primera vez
 */

const mongoose = require('mongoose');

// Subdocumento para cada mensaje/respuesta en la conversación
const mensajeSchema = new mongoose.Schema({
  mensaje: {
    type: String,
    required: true
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  esAdmin: {
    type: Boolean,
    default: false // Indica si el mensaje lo escribió un admin
  },
  creado: {
    type: Date,
    default: Date.now
  }
});

// Esquema del Post principal
const postSchema = new mongoose.Schema({
  asunto: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  creado: {
    type: Date,
    default: Date.now
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  ticket: {
    type: String // Generado solo cuando hay respuesta del administrador
  },
  mensajes: [mensajeSchema]
});

module.exports = mongoose.model('Post', postSchema);

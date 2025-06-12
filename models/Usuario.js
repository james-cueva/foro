/**
 * Modelo de Usuario (Mongoose)
 * ----------------------------
 * Este esquema representa a los usuarios del sistema.
 * Puede ser un usuario común o un administrador (esAdmin = true).
 */

const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  correo: {
    type: String,
    required: true,
    unique: true // No se permiten correos duplicados
  },
  password: {
    type: String,
    required: true // Cifrado con bcrypt
  },
  esAdmin: {
    type: Boolean,
    default: false // False por defecto, true si es administrador
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);

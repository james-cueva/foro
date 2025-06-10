const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  esAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('Usuario', usuarioSchema);

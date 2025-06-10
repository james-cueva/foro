const mongoose = require('mongoose');

const respuestaSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  contenido: { type: String, required: true },
  autor: { type: String, default: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Respuesta', respuestaSchema);

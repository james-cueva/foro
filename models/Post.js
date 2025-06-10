const mongoose = require('mongoose');

// Subdocumento para la respuesta del administrador
const respuestaSchema = new mongoose.Schema({
  mensaje: { type: String, required: true },
  ticket: { type: String, required: true },
  creado: { type: Date, default: Date.now }
});

// Esquema principal del Post
const postSchema = new mongoose.Schema({
  asunto: { type: String, required: true },
  descripcion: { type: String, required: true },
  creado: { type: Date, default: Date.now },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  respuesta: respuestaSchema // Campo opcional con respuesta del admin
});

module.exports = mongoose.model('Post', postSchema);


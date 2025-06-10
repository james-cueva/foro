// crearAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario');
require('dotenv').config(); // para cargar la URI desde .env

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

async function crearAdmin() {
  try {
    const nombre = 'Admin';
    const correo = 'admin@foro.com';
    const contraseñaPlano = 'admin123';

    const contraseñaHasheada = await bcrypt.hash(contraseñaPlano, 10);

    const admin = new Usuario({
      nombre,
      correo,
      contraseña: contraseñaHasheada,
      esAdmin: true
    });

    await admin.save();
    console.log('✅ Usuario administrador creado correctamente.');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error al crear el administrador:', err);
    mongoose.disconnect();
  }
}

crearAdmin();

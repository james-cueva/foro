require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Importación de rutas
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const respuestaRoutes = require('./routes/respuestas');
const usuarioRoutes = require('./routes/usuarios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/respuestas', respuestaRoutes);
app.use('/', usuarioRoutes);

// Ruta de prueba
app.get('/prueba-directa', (req, res) => {
  res.send('✅ Ruta directa funcionando');
});

app.get('/api', (req, res) => {
  res.send('API funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

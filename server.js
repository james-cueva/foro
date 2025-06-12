/**
 * Servidor Principal (Express.js)
 * -------------------------------
 * Este archivo es el punto de entrada de la aplicación.
 * Inicializa el servidor Express, configura middlewares, conecta a la base de datos
 * y monta las rutas de autenticación y gestión de posts.
 */

require('dotenv').config(); // Carga variables de entorno desde .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Rutas principales del sistema
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------
// Middleware Global
// ---------------------------

// Habilita CORS para permitir solicitudes del frontend
app.use(cors());

// Soporte para solicitudes con cuerpo JSON y formularios extensos
// Se aumenta el límite a 10 MB para soportar contenido con imágenes o texto enriquecido
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------------------------
// Archivos estáticos
// ---------------------------
// Sirve los archivos frontend desde /public (HTML, CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------
// Conexión a MongoDB Atlas
// ---------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// ---------------------------
// Rutas de API
// ---------------------------

app.use('/api/auth', authRoutes); // Rutas de autenticación (registro/login)
app.use('/api/post', postRoutes); // Rutas de posts y respuestas

// Ruta de prueba simple para verificar que el backend funciona
app.get('/prueba-directa', (req, res) => {
  res.send('✅ Ruta directa funcionando');
});

// Ruta de prueba API general
app.get('/api', (req, res) => {
  res.send('API funcionando correctamente');
});

// ---------------------------
// Iniciar servidor
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

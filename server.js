require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Importación de rutas
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());

// 🔧 Aumentar el límite de carga del payload a 10MB (para texto enriquecido)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);

// Rutas de prueba
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

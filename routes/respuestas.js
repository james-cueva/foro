const express = require('express');
const router = express.Router();
const Respuesta = require('../models/Respuesta');

// Crear una respuesta
router.post('/', async (req, res) => {
  const { postId, contenido, autor } = req.body;

  if (!postId || !contenido) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const nuevaRespuesta = new Respuesta({
      postId,
      contenido,
      autor
    });

    await nuevaRespuesta.save();
    res.status(201).json(nuevaRespuesta);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar la respuesta' });
  }
});

// Obtener respuestas de un post
router.get('/:postId', async (req, res) => {
  try {
    const respuestas = await Respuesta.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.json(respuestas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener respuestas' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verificarToken = require('../middlewares/verificarToken');

// Crear post (solo usuarios logueados)
router.post('/', verificarToken, async (req, res) => {
  const { asunto, descripcion } = req.body;

  if (!asunto || !descripcion) {
    return res.status(400).json({ error: 'Asunto y descripción obligatorios' });
  }

  try {
    const nuevoPost = new Post({
      usuario: req.usuario.id,
      asunto,
      descripcion,
      creado: new Date()
    });

    await nuevoPost.save();
    res.status(201).json({ mensaje: 'Post creado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener posts del usuario actual
router.get('/mis-posts', verificarToken, async (req, res) => {
  try {
    const posts = await Post.find({ usuario: req.usuario.id }).sort({ creado: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los posts (solo administrador)
router.get('/todos', verificarToken, async (req, res) => {
  if (!req.usuario.esAdmin) {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
  }

  try {
    const posts = await Post.find().populate('usuario', 'correo').sort({ creado: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Responder a un post (solo administrador)
router.post('/:id/responder', verificarToken, async (req, res) => {
  if (!req.usuario.esAdmin) {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
  }

  const { mensaje } = req.body;
  const ticket = 'TCKT-' + Math.floor(Math.random() * 1000000);

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    if (post.respuesta) {
      return res.status(400).json({ error: 'Este post ya tiene una respuesta' });
    }

    post.respuesta = {
      mensaje,
      ticket,
      creado: new Date()
    };

    await post.save();
    res.json({ mensaje: 'Respuesta enviada con éxito', ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

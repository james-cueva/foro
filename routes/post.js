/**
 * Rutas para Manejo de Posts
 * ---------------------------
 * Permite crear posts, verlos, y responder mediante un sistema de conversación continua.
 * Protegido por el middleware de autenticación (verificarToken).
 */

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verificarToken = require('../middlewares/verificarToken');

/**
 * POST /
 * --------
 * Crear un nuevo post (ticket).
 * Requiere: asunto, descripción.
 * Solo puede ser usado por un usuario autenticado.
 */
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

/**
 * GET /mis-posts
 * ----------------
 * Devuelve los posts creados por el usuario autenticado.
 * Incluye las respuestas en formato de conversación.
 */
router.get('/mis-posts', verificarToken, async (req, res) => {
  try {
    const posts = await Post.find({ usuario: req.usuario.id })
      .sort({ creado: -1 })
      .populate('mensajes.autor', 'correo');

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /todos
 * -------------
 * Solo accesible por administradores.
 * Devuelve todos los posts del sistema con usuarios y respuestas.
 */
router.get('/todos', verificarToken, async (req, res) => {
  if (!req.usuario.esAdmin) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  try {
    const posts = await Post.find()
      .populate('usuario', 'correo')
      .populate('mensajes.autor', 'correo')
      .sort({ creado: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /:id/mensaje
 * -------------------
 * Agrega un nuevo mensaje (respuesta) a un post existente.
 * Si es la primera respuesta del admin, se genera un ticket.
 */
router.post('/:id/mensaje', verificarToken, async (req, res) => {
  const { mensaje } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    // Si aún no tiene ticket y responde un admin, se genera
    if (!post.ticket && req.usuario.esAdmin) {
      post.ticket = 'TCKT-' + Math.floor(Math.random() * 1000000);
    }

    post.mensajes.push({
      mensaje,
      autor: req.usuario.id,
      esAdmin: req.usuario.esAdmin
    });

    await post.save();
    res.json({ mensaje: 'Mensaje agregado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

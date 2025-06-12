/**
 * Rutas de Autenticación
 * -----------------------
 * Este archivo contiene las rutas para:
 * - Registro de nuevos usuarios (con contraseña cifrada)
 * - Inicio de sesión (login) y generación de JWT
 */

const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'clave-secreta';

/**
 * POST /registro
 * ----------------
 * Registro de nuevos usuarios (cliente o administrador).
 * Requiere: correo, contraseña.
 * Opcional: esAdmin (booleano).
 */
router.post('/registro', async (req, res) => {
  const { correo, password, esAdmin } = req.body;

  // Validación básica
  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  try {
    // Verifica si el correo ya existe
    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Cifra la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea y guarda el nuevo usuario
    const nuevoUsuario = new Usuario({
      correo,
      password: hashedPassword,
      esAdmin
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /login
 * -------------
 * Autenticación de usuarios.
 * Requiere: correo y contraseña.
 * Devuelve: JWT si las credenciales son válidas.
 */
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Genera el token JWT
    const token = jwt.sign(
      {
        id: usuario._id,
        correo: usuario.correo,
        esAdmin: usuario.esAdmin
      },
      SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ mensaje: 'Login exitoso', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

/**
 * Middleware de autenticación JWT
 * --------------------------------
 * Este archivo verifica si el token JWT enviado por el cliente es válido.
 * Si lo es, agrega el usuario decodificado a la solicitud (req.usuario).
 * Si no, devuelve un error 401 (no autorizado) o 403 (prohibido).
 */

const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  // Obtiene el encabezado Authorization: "Bearer TOKEN"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token

  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto123');
    req.usuario = decoded; // Agrega los datos del usuario al request
    next();
  } catch (err) {
    // Token inválido
    res.status(403).json({ error: 'Token inválido' });
  }
}

module.exports = verificarToken;

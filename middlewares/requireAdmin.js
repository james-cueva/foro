// middlewares/requireAdmin.js

module.exports = function (req, res, next) {
  if (req.usuario && req.usuario.esAdmin) {
    next(); // Es admin, continuar
  } else {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
  }
};

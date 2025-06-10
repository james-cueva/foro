const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: '68452b343d3a68f89b210800', nombre: 'Usuario de prueba' }, // payload
  'miclaveultrasecreta',                         // clave secreta (igual que tu .env)
  { expiresIn: '7d' }                            // duración del token
);

console.log(token);
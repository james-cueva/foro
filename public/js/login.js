// login.js
// Lógica de inicio de sesión: autenticación y redirección

const form = document.getElementById('formLogin');
const errorLogin = document.getElementById('errorLogin');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorLogin.textContent = '';

  const correo = document.getElementById('correo').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correo, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error de red o del servidor');
    }

    localStorage.setItem('token', data.token);

    const payload = JSON.parse(atob(data.token.split('.')[1]));
    if (payload.esAdmin) {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'panel.html';
    }

  } catch (err) {
    errorLogin.textContent = err.message;
  }
});

document.getElementById('formRegistro').addEventListener('submit', async function (e) {
  e.preventDefault();

  const correo = document.getElementById('correo').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorDiv = document.getElementById('errorRegistro');
  errorDiv.textContent = '';

  if (!correo || !password) {
    errorDiv.textContent = 'Todos los campos son obligatorios.';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/auth/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correo, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || 'Error al registrar usuario.');
    }

    alert('✅ Usuario registrado exitosamente.');
    window.location.href = 'login.html';
  } catch (error) {
    errorDiv.textContent = error.message;
  }
});

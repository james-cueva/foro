// public/js/admin.js

const token = localStorage.getItem('token');
const API = window.location.origin;

if (!token) window.location.href = 'login.html';

document.getElementById('cerrar-sesion').onclick = () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
};

const POSTS_POR_PAGINA = 5;
let paginaActual = 1;
let totalPaginas = 1;
let todosLosPosts = [];

function crearEditor(div) {
  return new Quill(div, {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }, { 'size': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        ['clean']
      ]
    }
  });
}

async function cargarPosts() {
  const res = await fetch(`${API}/api/post/todos`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  todosLosPosts = await res.json();
  totalPaginas = Math.ceil(todosLosPosts.length / POSTS_POR_PAGINA);
}

function mostrarPagina(pagina) {
  paginaActual = pagina;
  const contenedor = document.getElementById('lista-posts');
  contenedor.innerHTML = '';

  const inicio = (pagina - 1) * POSTS_POR_PAGINA;
  const fin = inicio + POSTS_POR_PAGINA;
  const posts = todosLosPosts.slice(inicio, fin);

  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `
      <h3>${post.asunto}</h3>
      <div class="ql-editor">${post.descripcion}</div>
      <p><strong>Usuario:</strong> ${post.usuario?.correo || 'Desconocido'}</p>
      <p><strong>Ticket:</strong> ${post.ticket || 'Se generará cuando haya respuesta'}</p>
      <p><em>Publicado: ${new Date(post.creado).toLocaleString()}</em></p>
    `;

    post.mensajes.forEach(m => {
      const divMsg = document.createElement('div');
      divMsg.className = `mensaje ${m.esAdmin ? 'admin' : 'usuario'}`;

      if (m.esAdmin) {
        divMsg.innerHTML = `
          <p><strong>Respuesta:</strong></p>
          <div class="ql-editor">${m.mensaje}</div>
          <footer>
            <p>Puede hacer el seguimiento de su solicitud a través del ticket <strong>${post.ticket}</strong>.</p>
            <p>Saludos cordiales.<br><strong>Administración</strong></p>
            <p><em>Respondido: ${new Date(m.creado).toLocaleString()}</em></p>
          </footer>
        `;
      } else {
        divMsg.innerHTML = `
          <div class="ql-editor">${m.mensaje}</div>
          <footer><em>Publicado: ${new Date(m.creado).toLocaleString()}</em></footer>
        `;
      }

      div.appendChild(divMsg);
    });

    const form = document.createElement('form');
    const editorDiv = document.createElement('div');
    editorDiv.className = 'editor';
    const boton = document.createElement('button');
    boton.textContent = 'Responder';

    form.onsubmit = async e => {
      e.preventDefault();
      const contenido = quill.root.innerHTML;
      await fetch(`${API}/api/post/${post._id}/mensaje`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ mensaje: contenido })
      });
      await cargarPosts();
      mostrarPagina(paginaActual);
    };

    const group = document.createElement('div');
    group.className = 'form-group';
    group.appendChild(editorDiv);
    form.appendChild(group);
    form.appendChild(boton);
    div.appendChild(form);

    const quill = crearEditor(editorDiv);
    contenedor.appendChild(div);
  });

  actualizarPaginacion();
}

function actualizarPaginacion() {
  document.getElementById('page-indicator').textContent = `Página ${paginaActual} de ${totalPaginas}`;
  document.getElementById('prev-page').disabled = paginaActual === 1;
  document.getElementById('next-page').disabled = paginaActual === totalPaginas;
}

document.getElementById('prev-page').addEventListener('click', () => {
  if (paginaActual > 1) mostrarPagina(paginaActual - 1);
});

document.getElementById('next-page').addEventListener('click', () => {
  if (paginaActual < totalPaginas) mostrarPagina(paginaActual + 1);
});

(async () => {
  await cargarPosts();
  mostrarPagina(1);
})();

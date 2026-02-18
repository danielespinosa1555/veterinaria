const API = 'https://veterinaria-1-1kjp.onrender.com/api';
let todosDuenos = [];
let todasMascotas = [];

const EMOJIS = { 'Perro': '🐶', 'Gato': '🐱', 'Ave': '🦜', 'Conejo': '🐰', 'Hamster': '🐹' };

async function cargarDatos() {
  try {
    const [resDuenos, resMascotas] = await Promise.all([
      fetch(`${API}/duenos`),
      fetch(`${API}/mascotas`)
    ]);
    const jDuenos = await resDuenos.json();
    const jMascotas = await resMascotas.json();
    todosDuenos = jDuenos.data || jDuenos;
    todasMascotas = jMascotas.data || jMascotas;
    renderDuenos(todosDuenos);
  } catch(e) {
    document.getElementById('duenos-lista').innerHTML = '<div class="empty">Error al cargar los datos.</div>';
  }
}

function filtrarDuenos() {
  const q = document.getElementById('busqueda').value.toLowerCase().trim();
  const filtrados = q ? todosDuenos.filter(d => d.nombre.toLowerCase().includes(q)) : todosDuenos;
  renderDuenos(filtrados);
}

function renderDuenos(duenos) {
  if (duenos.length === 0) {
    document.getElementById('duenos-lista').innerHTML = '<div class="empty">No se encontraron dueños.</div>';
    return;
  }
  let html = '';
  duenos.forEach(d => {
    const inicial = d.nombre.charAt(0).toUpperCase();
    const numMascotas = todasMascotas.filter(m => m.id_dueno == d.id).length;
    html += `<div class="dueno-item" onclick="verMascotas(${d.id})" id="dueno-${d.id}">
      <div class="dueno-avatar">${inicial}</div>
      <div class="dueno-info">
        <h4>${d.nombre}</h4>
        <p>${d.email} &nbsp;•&nbsp; ${numMascotas} mascota${numMascotas !== 1 ? 's' : ''}</p>
      </div>
    </div>`;
  });
  document.getElementById('duenos-lista').innerHTML = html;
}

function verMascotas(id) {
  document.querySelectorAll('.dueno-item').forEach(el => el.classList.remove('selected'));
  const el = document.getElementById(`dueno-${id}`);
  if (el) el.classList.add('selected');

  const dueno = todosDuenos.find(d => d.id == id);
  const mascotas = todasMascotas.filter(m => m.id_dueno == id);
  const inicial = dueno.nombre.charAt(0).toUpperCase();

  document.getElementById('dueno-header').innerHTML = `
    <div class="avatar-lg">${inicial}</div>
    <div>
      <h2 style="font-family:'Fraunces',serif;font-size:1.3rem">${dueno.nombre}</h2>
      <p style="font-size:0.85rem;color:var(--text-muted);margin-top:2px">📧 ${dueno.email} &nbsp;•&nbsp; 📱 ${dueno.telefono || 'Sin teléfono'}</p>
    </div>
  `;

  if (mascotas.length === 0) {
    document.getElementById('mascotas-result').innerHTML = `<div class="empty">Este dueño no tiene mascotas registradas.</div>`;
  } else {
    let html = `<p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:16px;font-weight:500">
      ${mascotas.length} mascota${mascotas.length !== 1 ? 's' : ''} registrada${mascotas.length !== 1 ? 's' : ''}
    </p>`;
    html += `<div class="mascotas-grid">`;
    mascotas.forEach(m => {
      const emoji = EMOJIS[m.especie] || '🐾';
      html += `<div class="mascota-card">
        <span class="emoji">${emoji}</span>
        <h4>${m.nombre}</h4>
        <span class="badge badge-${m.especie.toLowerCase()}">${m.especie}</span>
      </div>`;
    });
    html += `</div>`;
    document.getElementById('mascotas-result').innerHTML = html;
  }

  const resultCard = document.getElementById('result-card');
  resultCard.classList.add('visible');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Buscar al presionar Enter
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('busqueda').addEventListener('keyup', e => {
    if (e.key === 'Enter') filtrarDuenos();
  });
  cargarDatos();
});

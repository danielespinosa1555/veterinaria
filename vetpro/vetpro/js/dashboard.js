const API = 'https://veterinaria-1-1kjp.onrender.com/api';
let todasLasCitas = [];
let todasLasMascotas = [];

function showSection(name, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + name).classList.add('active');
  btn.classList.add('active');
}

async function fetchData(endpoint) {
  const res = await fetch(`${API}/${endpoint}`);
  const json = await res.json();
  return json.data || json;
}

// =================== HISTORIAL MÉDICO ===================
async function iniciarHistorial() {
  try {
    todasLasMascotas = await fetchData('mascotas');
    const sel = document.getElementById('sel-mascota');
    todasLasMascotas.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.nombre} (${m.especie})`;
      sel.appendChild(opt);
    });
  } catch(e) { console.error(e); }
}

async function cargarHistorial() {
  const id = document.getElementById('sel-mascota').value;
  if (!id) return;
  const mascota = todasLasMascotas.find(m => m.id == id);
  const result = document.getElementById('historial-result');
  result.innerHTML = `<div class="loading"><span class="spinner-dark"></span>Cargando...</div>`;

  try {
    const [vacunas, citas, todasVacunas] = await Promise.all([
      fetchData('mascota-vacunas'),
      fetchData('citas'),
      fetchData('vacunas')
    ]);

    const vacMascota = vacunas.filter(v => v.id_mascota == id);
    const citasMascota = citas.filter(c => c.id_mascota == id);

    let html = `<div style="margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--border)">
      <h3 style="font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:var(--green);margin-bottom:4px">🐾 ${mascota.nombre} — ${mascota.especie}</h3>
      <p style="font-size:0.78rem;color:var(--text-muted)">
        <b style="color:var(--text)">${vacMascota.length}</b> vacunas aplicadas &nbsp;•&nbsp; <b style="color:var(--text)">${citasMascota.length}</b> citas registradas
      </p>
    </div>`;

    if (vacMascota.length > 0) {
      html += `<p style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);font-weight:600;margin-bottom:10px">Vacunas aplicadas</p>`;
      html += `<div class="historial-grid">`;
      vacMascota.forEach(v => {
        const vacuna = todasVacunas.find(vv => vv.id == v.id_vacuna);
        html += `<div class="historial-item">
          <div class="date">📅 ${new Date(v.fecha_aplicacion).toLocaleDateString('es-CO')}</div>
          <h4>${vacuna ? vacuna.nombre_vacuna : 'Vacuna #' + v.id_vacuna}</h4>
          <p>Próxima dosis: ${new Date(v.proxima_dosis).toLocaleDateString('es-CO')}</p>
        </div>`;
      });
      html += `</div>`;
    }

    if (citasMascota.length > 0) {
      html += `<p style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);font-weight:600;margin:18px 0 10px">Citas médicas</p>`;
      html += `<div class="historial-grid">`;
      citasMascota.forEach(c => {
        const fecha = new Date(c.fecha_cita);
        const color = c.estado === 'completada' ? 'var(--green)' : 'var(--amber)';
        html += `<div class="historial-item" style="border-left-color:${color}">
          <div class="date" style="color:${color}">📅 ${fecha.toLocaleDateString('es-CO')} ${fecha.toLocaleTimeString('es-CO', {hour:'2-digit',minute:'2-digit'})}</div>
          <h4>${c.motivo}</h4>
          <p>Estado: ${c.estado}</p>
        </div>`;
      });
      html += `</div>`;
    }

    if (vacMascota.length === 0 && citasMascota.length === 0) {
      html += `<div class="empty"><div class="empty-icon">📂</div>No hay registros para esta mascota.</div>`;
    }

    result.innerHTML = `<div class="fade-in">${html}</div>`;
  } catch(e) {
    result.innerHTML = `<div class="empty">Error al cargar el historial.</div>`;
  }
}

// =================== VACUNAS PENDIENTES ===================
async function cargarVacunasPendientes() {
  try {
    const [vacunas, mascotaVacunas, mascotas] = await Promise.all([
      fetchData('vacunas'),
      fetchData('mascota-vacunas'),
      fetchData('mascotas')
    ]);

    const hoy = new Date(); hoy.setHours(0,0,0,0);
    const en30 = new Date(hoy); en30.setDate(en30.getDate() + 30);
    let vencidas = 0, proximas = 0, ok = 0;

    const items = mascotaVacunas.map(mv => {
      const proxima = new Date(mv.proxima_dosis);
      const mascota = mascotas.find(m => m.id == mv.id_mascota);
      const vacuna = vacunas.find(v => v.id == mv.id_vacuna);
      const diffDias = Math.ceil((proxima - hoy) / (1000*60*60*24));
      let estado, clase;
      if (proxima < hoy) { estado = `Vencida hace ${Math.abs(diffDias)} días`; clase = 'vencida'; vencidas++; }
      else if (proxima <= en30) { estado = `Vence en ${diffDias} días`; clase = 'proxima'; proximas++; }
      else { estado = 'Al día'; clase = 'ok'; ok++; }
      return { mascota, vacuna, proxima, estado, clase, diffDias };
    }).sort((a, b) => a.diffDias - b.diffDias);

    document.getElementById('stat-vencidas').textContent = vencidas;
    document.getElementById('stat-proximas').textContent = proximas;
    document.getElementById('stat-ok').textContent = ok;

    let html = '';
    items.forEach(item => {
      html += `<div class="vacuna-row">
        <div class="vacuna-info">
          <h4>${item.mascota ? item.mascota.nombre : 'Mascota'} — ${item.vacuna ? item.vacuna.nombre_vacuna : 'Vacuna'}</h4>
          <p>Próxima dosis: ${item.proxima.toLocaleDateString('es-CO')}</p>
        </div>
        <span class="dias-badge ${item.clase}">${item.estado}</span>
      </div>`;
    });

    document.getElementById('vacunas-result').innerHTML = html || `<div class="empty"><div class="empty-icon">💉</div>No hay vacunas registradas.</div>`;
  } catch(e) {
    document.getElementById('vacunas-result').innerHTML = `<div class="empty">Error al cargar vacunas.</div>`;
  }
}

// =================== CITAS POR FECHA ===================
async function cargarCitas() {
  try {
    const [citas, mascotas] = await Promise.all([
      fetchData('citas'),
      fetchData('mascotas')
    ]);
    todasLasCitas = citas.map(c => ({
      ...c,
      mascota: mascotas.find(m => m.id == c.id_mascota)
    })).sort((a, b) => new Date(a.fecha_cita) - new Date(b.fecha_cita));
    renderCitas(todasLasCitas);
  } catch(e) {
    document.getElementById('citas-result').innerHTML = `<div class="empty">Error al cargar citas.</div>`;
  }
}

function filtrarCitas() {
  const desde = document.getElementById('fecha-inicio').value;
  const hasta = document.getElementById('fecha-fin').value;
  let filtradas = todasLasCitas;
  if (desde) filtradas = filtradas.filter(c => new Date(c.fecha_cita) >= new Date(desde));
  if (hasta) filtradas = filtradas.filter(c => new Date(c.fecha_cita) <= new Date(hasta + 'T23:59:59'));
  renderCitas(filtradas);
}

function verTodas() {
  document.getElementById('fecha-inicio').value = '';
  document.getElementById('fecha-fin').value = '';
  renderCitas(todasLasCitas);
}

function renderCitas(citas) {
  if (citas.length === 0) {
    document.getElementById('citas-result').innerHTML = `<div class="empty"><div class="empty-icon">📅</div>No hay citas en ese rango de fechas.</div>`;
    return;
  }
  let html = '';
  citas.forEach(c => {
    const fecha = new Date(c.fecha_cita);
    const dia = fecha.getDate();
    const mes = fecha.toLocaleString('es-CO', { month: 'short' });
    const hora = fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    html += `<div class="cita-card ${c.estado}">
      <div class="cita-fecha">
        <div class="dia">${dia}</div>
        <div class="mes">${mes}</div>
      </div>
      <div class="cita-info">
        <h4>${c.motivo}</h4>
        <p>${c.mascota ? c.mascota.nombre : 'Mascota'} &nbsp;•&nbsp; ${hora}</p>
      </div>
      <span class="badge ${c.estado === 'pendiente' ? 'badge-amber' : 'badge-green'}">${c.estado}</span>
    </div>`;
  });
  document.getElementById('citas-result').innerHTML = html;
}

iniciarHistorial();
cargarVacunasPendientes();
cargarCitas();

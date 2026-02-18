const API = 'https://veterinaria-1-1kjp.onrender.com/api';

async function cargarMascotas() {
  try {
    const res = await fetch(`${API}/mascotas`);
    const json = await res.json();
    const mascotas = json.data || json;
    const sel = document.getElementById('id_mascota');
    sel.innerHTML = '<option value="">Selecciona una mascota...</option>';
    mascotas.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.nombre} (${m.especie})`;
      sel.appendChild(opt);
    });
  } catch(e) {
    document.getElementById('id_mascota').innerHTML = '<option value="">Error al cargar mascotas</option>';
  }
}

async function guardarCita() {
  const id_mascota = document.getElementById('id_mascota').value;
  const fecha_cita = document.getElementById('fecha_cita').value;
  const motivo = document.getElementById('motivo').value.trim();
  const estado = document.getElementById('estado').value;

  if (!id_mascota || !fecha_cita || !motivo) {
    mostrarAlerta('error', '❌ Por favor completa todos los campos.');
    return;
  }

  const btn = document.getElementById('btn-guardar');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Guardando...';

  try {
    const res = await fetch(`${API}/citas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_mascota: parseInt(id_mascota), fecha_cita, motivo, estado })
    });

    if (res.ok) {
      mostrarAlerta('success', '✅ ¡Cita registrada exitosamente!');
      document.getElementById('id_mascota').value = '';
      document.getElementById('fecha_cita').value = '';
      document.getElementById('motivo').value = '';
    } else {
      mostrarAlerta('error', '❌ Error al guardar la cita.');
    }
  } catch(e) {
    mostrarAlerta('error', '❌ Error de conexión con la API.');
  }

  btn.disabled = false;
  btn.innerHTML = 'Guardar cita';
}

function mostrarAlerta(tipo, msg) {
  document.getElementById('alert-success').style.display = 'none';
  document.getElementById('alert-error').style.display = 'none';
  const el = document.getElementById(`alert-${tipo}`);
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}

cargarMascotas();

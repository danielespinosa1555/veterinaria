const API = 'https://veterinaria-1-1kjp.onrender.com/api';

function selEspecie(el, valor) {
  document.querySelectorAll('.especie-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('especie').value = valor;
}

async function cargarDuenos() {
  try {
    const res = await fetch(`${API}/duenos`);
    const json = await res.json();
    const duenos = json.data || json;
    const sel = document.getElementById('id_dueno');
    sel.innerHTML = '<option value="">Selecciona un dueño...</option>';
    duenos.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.nombre;
      sel.appendChild(opt);
    });
  } catch(e) {
    document.getElementById('id_dueno').innerHTML = '<option value="">Error al cargar dueños</option>';
  }
}

async function guardarMascota() {
  const nombre = document.getElementById('nombre').value.trim();
  const especie = document.getElementById('especie').value;
  const id_dueno = document.getElementById('id_dueno').value;

  if (!nombre || !especie || !id_dueno) {
    mostrarAlerta('error', '❌ Por favor completa todos los campos.');
    return;
  }

  const btn = document.getElementById('btn-guardar');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Guardando...';

  try {
    const res = await fetch(`${API}/mascotas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, especie, id_dueno: parseInt(id_dueno) })
    });

    if (res.ok) {
      mostrarAlerta('success', '✅ ¡Mascota registrada exitosamente!');
      document.getElementById('nombre').value = '';
      document.getElementById('especie').value = '';
      document.getElementById('id_dueno').value = '';
      document.querySelectorAll('.especie-btn').forEach(b => b.classList.remove('selected'));
    } else {
      mostrarAlerta('error', '❌ Error al registrar la mascota.');
    }
  } catch(e) {
    mostrarAlerta('error', '❌ Error de conexión con la API.');
  }

  btn.disabled = false;
  btn.innerHTML = 'Registrar mascota';
}

function mostrarAlerta(tipo, msg) {
  document.getElementById('alert-success').style.display = 'none';
  document.getElementById('alert-error').style.display = 'none';
  const el = document.getElementById(`alert-${tipo}`);
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}

cargarDuenos();

const materias = document.querySelectorAll('.materia');
const resetBtn = document.getElementById('resetBtn');

// Marcar aprobadas y actualizar correlativas
materias.forEach(materia => {
    materia.addEventListener('click', () => {
        if (materia.classList.contains('bloqueada')) return;

        materia.classList.toggle('aprobada');
        guardarEstado();
        actualizarBloqueos();
    });
});

// Función: Actualizar estado bloqueado/desbloqueado
function actualizarBloqueos() {
    const aprobadas = Array.from(document.querySelectorAll('.aprobada')).map(m => m.dataset.id);

    materias.forEach(m => {
        const correlativas = m.dataset.correl ? JSON.parse(m.dataset.correl) : [];
        if (correlativas.length === 0 || correlativas.every(c => aprobadas.includes(c))) {
            m.classList.remove('bloqueada');
        } else if (!m.classList.contains('aprobada')) {
            m.classList.add('bloqueada');
        }
    });
}

// Guardar en localStorage
function guardarEstado() {
    const estado = Array.from(materias).map(m => ({
        id: m.dataset.id || m.textContent,
        aprobada: m.classList.contains('aprobada')
    }));
    localStorage.setItem('estadoMaterias', JSON.stringify(estado));
}

// Cargar estado desde localStorage
function cargarEstado() {
    const estado = JSON.parse(localStorage.getItem('estadoMaterias'));
    if (estado) {
        estado.forEach(item => {
            const materia = document.querySelector(`[data-id="${item.id}"]`);
            if (materia && item.aprobada) materia.classList.add('aprobada');
        });
        actualizarBloqueos();
    }
}

// Reiniciar progreso
resetBtn.addEventListener('click', () => {
    localStorage.removeItem('estadoMaterias');
    materias.forEach(m => m.classList.remove('aprobada'));
    actualizarBloqueos();
});

// Inicializar
cargarEstado();
actualizarBloqueos();
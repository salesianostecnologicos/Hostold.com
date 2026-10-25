const datos = {
  "Junín": {
    "Huancayo": {
      "Huancayo": [
        "Colegio Salesiano Santa Rosa",
        "Open Plaza Huancayo"
      ]
    }
  }
};

// --- Elementos del DOM del Login ---
const panelLogin = document.getElementById("panelLogin");
const panelMapas = document.getElementById("panelMapas");
const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");
const btnIngresar = document.getElementById("btnIngresar");
const mensajeLogin = document.getElementById("mensajeLogin");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

// --- Elementos del DOM del Buscador y Visor ---
const region = document.getElementById("region");
const provincia = document.getElementById("provincia");
const distrito = document.getElementById("distrito");
const lugar = document.getElementById("lugar");

const guardar = document.getElementById("guardar");
const mensaje = document.getElementById("mensaje");

const visorMapa = document.getElementById("visorMapa");
const cerrarMapa = document.getElementById("cerrarMapa");
const imagenMapa = document.getElementById("imagenMapa");
const descargarMapa = document.getElementById("descargarMapa");
const errorImagen = document.getElementById("errorImagen");

// Nombres de los archivos de imagen correspondientes
const mapaSalesiano = "IMG-20261001-WA0020.jpg";
const mapaOpenPlaza = "image_35840f16.jpg";

// --- CONTROL DE INICIO DE SESIÓN ---
const USUARIO_VALIDO = "admin";
const PASSWORD_VALIDO = "1234";

btnIngresar.addEventListener("click", iniciarSesion);

// Permitir ingresar presionando Enter en los inputs
inputUsuario.addEventListener("keydown", (e) => { if (e.key === "Enter") iniciarSesion(); });
inputPassword.addEventListener("keydown", (e) => { if (e.key === "Enter") iniciarSesion(); });

function iniciarSesion() {
  const user = inputUsuario.value.trim();
  const pass = inputPassword.value;

  if (user === USUARIO_VALIDO && pass === PASSWORD_VALIDO) {
    sessionStorage.setItem("sesionHOSTOLD", "activa");
    mensajeLogin.textContent = "";
    inputUsuario.value = "";
    inputPassword.value = "";
    
    mostrarPanelMapas();
  } else {
    mensajeLogin.textContent = "Usuario o contraseña incorrectos.";
  }
}

function mostrarPanelMapas() {
  panelLogin.hidden = true;
  panelMapas.hidden = false;
  
  // Reiniciar selectores por si acaso y cargar base
  limpiarSelect(region);
  agregarOpciones(region, Object.keys(datos));
  
  // Ejecutar la restauración si tiene una ubicación previa guardada en LocalStorage
  cargarUbicacionPersistente();
}

btnCerrarSesion.addEventListener("click", () => {
  sessionStorage.removeItem("sesionHOSTOLD");
  panelMapas.hidden = true;
  panelLogin.hidden = false;
  mensaje.textContent = "Seleccione una ubicación.";
});

function verificarSesion() {
  const sesion = sessionStorage.getItem("sesionHOSTOLD");
  if (sesion === "activa") {
    mostrarPanelMapas();
  } else {
    panelLogin.hidden = false;
    panelMapas.hidden = true;
    agregarOpciones(region, Object.keys(datos));
  }
}


// --- LÓGICA DE SELECTORES Y MAPAS ---
function limpiarSelect(select) {
  select.innerHTML = '<option value="">Seleccione...</option>';
  select.disabled = true;
}

function agregarOpciones(select, opciones) {
  // Evitar duplicados al inicializar o recargar
  select.innerHTML = '<option value="">Seleccione...</option>';
  opciones.forEach(opcion => {
    const elemento = document.createElement("option");
    elemento.value = opcion;
    elemento.textContent = opcion;
    select.appendChild(elemento);
  });

  select.disabled = false;
}

// Cambio de región
region.addEventListener("change", () => {
  limpiarSelect(provincia);
  limpiarSelect(distrito);
  limpiarSelect(lugar);
  mensaje.textContent = "Seleccione una ubicación.";

  if (region.value) {
    agregarOpciones(
      provincia,
      Object.keys(datos[region.value])
    );
  }
});

// Cambio de provincia
provincia.addEventListener("change", () => {
  limpiarSelect(distrito);
  limpiarSelect(lugar);
  mensaje.textContent = "Seleccione una ubicación.";

  if (provincia.value) {
    agregarOpciones(
      distrito,
      Object.keys(datos[region.value][provincia.value])
    );
  }
});

// Cambio de distrito
distrito.addEventListener("change", () => {
  limpiarSelect(lugar);
  mensaje.textContent = "Seleccione una ubicación.";

  if (distrito.value) {
    agregarOpciones(
      lugar,
      datos[region.value][provincia.value][distrito.value]
    );
  }
});

// Guardar ubicación y abrir el mapa correspondiente
guardar.addEventListener("click", () => {
  if (
    !region.value ||
    !provincia.value ||
    !distrito.value ||
    !lugar.value
  ) {
    mensaje.textContent = "Complete toda la ubicación.";
    return;
  }

  const ubicacion = {
    region: region.value,
    provincia: provincia.value,
    distrito: distrito.value,
    lugar: lugar.value
  };

  try {
    localStorage.setItem(
      "ubicacionHOSTOLD",
      JSON.stringify(ubicacion)
    );
  } catch (error) {
    // Continuar si LocalStorage está deshabilitado
  }

  const tituloVisor = visorMapa.querySelector(".visor-contenido h2");

  if (lugar.value === "Colegio Salesiano Santa Rosa") {
    mensaje.textContent = "Abriendo el mapa del colegio...";

    if (tituloVisor) tituloVisor.textContent = "Mapa del Colegio Salesiano Santa Rosa";
    
    errorImagen.hidden = true;
    imagenMapa.alt = "Mapa del Colegio Salesiano Santa Rosa";
    imagenMapa.src = mapaSalesiano;

    descargarMapa.href = mapaSalesiano;
    descargarMapa.download = mapaSalesiano;

    visorMapa.classList.add("activo");
    visorMapa.setAttribute("aria-hidden", "false");

  } else if (lugar.value === "Open Plaza Huancayo") {
    mensaje.textContent = "Abriendo plano de evacuación...";

    if (tituloVisor) tituloVisor.textContent = "Plano de Evacuación - Open Plaza Huancayo (Piso 1)";

    errorImagen.hidden = true;
    imagenMapa.alt = "Plano de Evacuación Open Plaza Huancayo Piso 1";
    imagenMapa.src = mapaOpenPlaza;

    descargarMapa.href = mapaOpenPlaza;
    descargarMapa.download = mapaOpenPlaza;

    visorMapa.classList.add("activo");
    visorMapa.setAttribute("aria-hidden", "false");
  }
});

// Detectar si no se encuentra la imagen
imagenMapa.addEventListener("load", () => {
  errorImagen.hidden = true;
  mensaje.textContent = "Mapa cargado correctamente.";
});

imagenMapa.addEventListener("error", () => {
  errorImagen.hidden = false;
  mensaje.textContent =
    "No se encontró la imagen. Revisa su nombre en GitHub.";
});

// Cerrar el visor
function cerrarVisor() {
  visorMapa.classList.remove("activo");
  visorMapa.setAttribute("aria-hidden", "true");
  imagenMapa.removeAttribute("src");
}

cerrarMapa.addEventListener("click", cerrarVisor);

visorMapa.addEventListener("click", evento => {
  if (evento.target === visorMapa) {
    cerrarVisor();
  }
});

document.addEventListener("keydown", evento => {
  if (evento.key === "Escape" &&
      visorMapa.classList.contains("activo")) {
    cerrarVisor();
  }
});

// Cargar ubicación guardada automáticamente al iniciar
function cargarUbicacionPersistente() {
  try {
    const datosGuardados = localStorage.getItem("ubicacionHOSTOLD");
    if (!datosGuardados) return;

    const ubicacion = JSON.parse(datosGuardados);

    if (ubicacion.region && datos[ubicacion.region]) {
      region.value = ubicacion.region;
      
      agregarOpciones(provincia, Object.keys(datos[ubicacion.region]));
      if (ubicacion.provincia && datos[ubicacion.region][ubicacion.provincia]) {
        provincia.value = ubicacion.provincia;

        agregarOpciones(distrito, Object.keys(datos[ubicacion.region][ubicacion.provincia]));
        if (ubicacion.distrito && datos[ubicacion.region][ubicacion.provincia][ubicacion.distrito]) {
          distrito.value = ubicacion.distrito;

          agregarOpciones(lugar, datos[ubicacion.region][ubicacion.provincia][ubicacion.distrito]);
          if (ubicacion.lugar && datos[ubicacion.region][ubicacion.provincia][ubicacion.distrito].includes(ubicacion.lugar)) {
            lugar.value = ubicacion.lugar;
            mensaje.textContent = "Última ubicación restaurada correctamente.";
          }
        }
      }
    }
  } catch (error) {
    // Evita romper la app si el localStorage está corrupto
  }
}

// Arrancar validando accesos
verificarSesion();

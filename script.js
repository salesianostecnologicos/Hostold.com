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

// --- Elementos del DOM del Login y Registro ---
const panelLogin = document.getElementById("panelLogin");
const panelMapas = document.getElementById("panelMapas");
const tabLogin = document.getElementById("tabLogin");
const tabRegistro = document.getElementById("tabRegistro");
const tituloAuth = document.getElementById("tituloAuth");
const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");
const grupoConfirmarPass = document.getElementById("grupoConfirmarPass");
const inputConfirmarPassword = document.getElementById("confirmarPassword");
const btnAuthAccion = document.getElementById("btnAuthAccion");
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

// Nombres de los archivos de imagen
const mapaSalesiano = "IMG-20261001-WA0020.jpg";
const mapaOpenPlaza = "image_35840f16.jpg";

// Estado de la pestaña actual: "login" o "registro"
let modoAuth = "login";

// --- CONTROL DE PESTAÑAS (LOGIN / REGISTRO) ---
tabLogin.addEventListener("click", () => {
  modoAuth = "login";
  tabLogin.classList.add("activa");
  tabRegistro.classList.remove("activa");
  tituloAuth.textContent = "Iniciar Sesión";
  btnAuthAccion.textContent = "Ingresar";
  grupoConfirmarPass.hidden = true;
  mensajeLogin.textContent = "";
});

tabRegistro.addEventListener("click", () => {
  modoAuth = "registro";
  tabRegistro.classList.add("activa");
  tabLogin.classList.remove("activa");
  tituloAuth.textContent = "Crear Cuenta";
  btnAuthAccion.textContent = "Registrarse";
  grupoConfirmarPass.hidden = false;
  mensajeLogin.textContent = "";
});

// --- PROCESAR AUTENTICACIÓN ---
btnAuthAccion.addEventListener("click", procesarAuth);

function procesarAuth() {
  const user = inputUsuario.value.trim().toLowerCase();
  const pass = inputPassword.value;
  const confirmPass = inputConfirmarPassword.value;

  if (!user || !pass) {
    mensajeLogin.textContent = "Por favor, complete todos los campos.";
    return;
  }

  // Obtener lista de usuarios registrados del LocalStorage (o inicializar vacía)
  let usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosHOSTOLD")) || {};

  // Incluir cuenta maestra por defecto por si acaso
  usuariosRegistrados["admin"] = "1234";

  if (modoAuth === "login") {
    // LÓGICA DE INICIO DE SESIÓN
    if (usuariosRegistrados[user] && usuariosRegistrados[user] === pass) {
      sessionStorage.setItem("sesionHOSTOLD", "activa");
      mensajeLogin.textContent = "";
      inputUsuario.value = "";
      inputPassword.value = "";
      mostrarPanelMapas();
    } else {
      mensajeLogin.textContent = "Usuario o contraseña incorrectos.";
    }
  } else {
    // LÓGICA DE REGISTRO
    if (usuariosRegistrados[user]) {
      mensajeLogin.textContent = "El nombre de usuario ya está registrado.";
      return;
    }

    if (pass.length < 4) {
      mensajeLogin.textContent = "La contraseña debe tener al menos 4 caracteres.";
      return;
    }

    if (pass !== confirmPass) {
      mensajeLogin.textContent = "Las contraseñas no coinciden.";
      return;
    }

    // Guardar nuevo usuario
    usuariosRegistrados[user] = pass;
    localStorage.setItem("usuariosHOSTOLD", JSON.stringify(usuariosRegistrados));

    mensajeLogin.style.color = "#00ffaa";
    mensajeLogin.textContent = "¡Registro exitoso! Ya puedes iniciar sesión.";
    
    // Cambiar automáticamente a la pestaña de Login después de 1.5 segundos
    setTimeout(() => {
      mensajeLogin.style.color = "#ff8b8b";
      tabLogin.click();
      inputUsuario.value = user;
    }, 1500);
  }
}

function mostrarPanelMapas() {
  panelLogin.hidden = true;
  panelMapas.hidden = false;
  limpiarSelect(region);
  agregarOpciones(region, Object.keys(datos));
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
  }
}

// --- LÓGICA DE SELECTORES Y MAPAS ---
function limpiarSelect(select) {
  select.innerHTML = '<option value="">Seleccione...</option>';
  select.disabled = true;
}

function agregarOpciones(select, opciones) {
  select.innerHTML = '<option value="">Seleccione...</option>';
  opciones.forEach(opcion => {
    const elemento = document.createElement("option");
    elemento.value = opcion;
    elemento.textContent = opcion;
    select.appendChild(elemento);
  });
  select.disabled = false;
}

region.addEventListener("change", () => {
  limpiarSelect(provincia);
  limpiarSelect(distrito);
  limpiarSelect(lugar);
  mensaje.textContent = "Seleccione una ubicación.";
  if (region.value) agregarOpciones(provincia, Object.keys(datos[region.value]));
});

provincia.addEventListener("change", () => {
  limpiarSelect(distrito);
  limpiarSelect(lugar);
  mensaje.textContent = "Seleccione una ubicación.";
  if (provincia.value) agregarOpciones(distrito, Object.keys(datos[region.value][provincia.value]));
});

distrito.addEventListener("change", () => {
  limpiarSelect(lugar);
  mensaje.textContent = "Seleccione una ubicación.";
  if (distrito.value) agregarOpciones(lugar, datos[region.value][provincia.value][distrito.value]);
});

guardar.addEventListener("click", () => {
  if (!region.value || !provincia.value || !distrito.value || !lugar.value) {
    mensaje.textContent = "Complete toda la ubicación.";
    return;
  }

  const ubicacion = {
    region: region.value,
    provincia: provincia.value,
    distrito: distrito.value,
    lugar: lugar.value
  };

  try { localStorage.setItem("ubicacionHOSTOLD", JSON.stringify(ubicacion)); } catch (e) {}

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

imagenMapa.addEventListener("load", () => { errorImagen.hidden = true; mensaje.textContent = "Mapa cargado correctamente."; });
imagenMapa.addEventListener("error", () => { errorImagen.hidden = false; mensaje.textContent = "No se encontró la imagen. Revisa su nombre en GitHub."; });

function cerrarVisor() {
  visorMapa.classList.remove("activo");
  visorMapa.setAttribute("aria-hidden", "true");
  imagenMapa.removeAttribute("src");
}

cerrarMapa.addEventListener("click", cerrarVisor);
visorMapa.addEventListener("click", e => { if (e.target === visorMapa) cerrarVisor(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && visorMapa.classList.contains("activo")) cerrarVisor(); });

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
  } catch (e) {}
}

verificarSesion();

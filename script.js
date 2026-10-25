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

// --- Elementos de Control del Panel Auth ---
const panelAuth = document.getElementById("panelAuth");
const panelMapas = document.getElementById("panelMapas");
const tabLogin = document.getElementById("tabLogin");
const tabRegistro = document.getElementById("tabRegistro");
const formLogin = document.getElementById("formLogin");
const formRegistro = document.getElementById("formRegistro");
const mensajeAuth = document.getElementById("mensajeAuth");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

// --- Inputs del Formulario Login ---
const loginUsuario = document.getElementById("loginUsuario");
const loginPassword = document.getElementById("loginPassword");
const btnIngresar = document.getElementById("btnIngresar");

// --- Inputs del Formulario Registro ---
const regUsuario = document.getElementById("regUsuario");
const regPassword = document.getElementById("regPassword");
const regConfirmarPassword = document.getElementById("regConfirmarPassword");
const btnRegistrar = document.getElementById("btnRegistrar");

// --- Elementos del Buscador de Ubicaciones ---
const region = document.getElementById("region");
const provincia = document.getElementById("provincia");
const distrito = document.getElementById("distrito");
const lugar = document.getElementById("lugar");
const guardar = document.getElementById("guardar");
const mensaje = document.getElementById("mensaje");

// --- Elementos del Visor de Mapa ---
const visorMapa = document.getElementById("visorMapa");
const cerrarMapa = document.getElementById("cerrarMapa");
const imagenMapa = document.getElementById("imagenMapa");
const descargarMapa = document.getElementById("descargarMapa");
const errorImagen = document.getElementById("errorImagen");

// Rutas de archivos correspondientes
const mapaSalesiano = "IMG-20261001-WA0020.jpg";
const mapaOpenPlaza = "image_35840f16.jpg";

// --- CONTROL DE PESTAÑAS INTERNAS ---
tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("activa");
  tabRegistro.classList.remove("activa");
  formLogin.hidden = false;
  formRegistro.hidden = true;
  mensajeAuth.textContent = "";
  mensajeAuth.style.color = "#ff8b8b";
});

tabRegistro.addEventListener("click", () => {
  tabRegistro.classList.add("activa");
  tabLogin.classList.remove("activa");
  formLogin.hidden = true;
  formRegistro.hidden = false;
  mensajeAuth.textContent = "";
  mensajeAuth.style.color = "#ff8b8b";
});

// --- ACCIÓN: INICIAR SESIÓN ---
btnIngresar.addEventListener("click", ejecutarLogin);

// Escuchar tecla Enter en el formulario de Login
loginUsuario.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarLogin(); });
loginPassword.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarLogin(); });

function ejecutarLogin() {
  const user = loginUsuario.value.trim().toLowerCase();
  const pass = loginPassword.value;

  if (!user || !pass) {
    mensajeAuth.style.color = "#ff8b8b";
    mensajeAuth.textContent = "Por favor, llene todos los campos.";
    return;
  }

  let dbUsuarios = JSON.parse(localStorage.getItem("usuariosHOSTOLD")) || {};
  dbUsuarios["admin"] = "1234"; // Cuenta por defecto de respaldo

  if (dbUsuarios[user] && dbUsuarios[user] === pass) {
    sessionStorage.setItem("sesionHOSTOLD", "activa");
    mensajeAuth.textContent = "";
    loginUsuario.value = "";
    loginPassword.value = "";
    mostrarBuscador();
  } else {
    mensajeAuth.style.color = "#ff8b8b";
    mensajeAuth.textContent = "Usuario o contraseña incorrectos.";
  }
}

// --- ACCIÓN: REGISTRARSE ---
btnRegistrar.addEventListener("click", ejecutarRegistro);

// Escuchar tecla Enter en el formulario de Registro
regUsuario.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarRegistro(); });
regPassword.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarRegistro(); });
regConfirmarPassword.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarRegistro(); });

function ejecutarRegistro() {
  const user = regUsuario.value.trim().toLowerCase();
  const pass = regPassword.value;
  const confirmPass = regConfirmarPassword.value;

  if (!user || !pass || !confirmPass) {
    mensajeAuth.style.color = "#ff8b8b";
    mensajeAuth.textContent = "Complete todos los campos del registro.";
    return;
  }

  let dbUsuarios = JSON.parse(localStorage.getItem("usuariosHOSTOLD")) || {};
  dbUsuarios["admin"] = "1234";

  if (dbUsuarios[user]) {
    mensajeAuth.style.color = "#ff8b8b";
    mensajeAuth.textContent = "Este nombre de usuario ya existe.";
    return;
  }

  if (pass.length < 4) {
    mensajeAuth.style.color = "#ff8b8b";
    mensajeAuth.textContent = "La contraseña debe tener mínimo 4 caracteres.";
    return;
  }

  if (pass !== confirmPass) {
    mensajeAuth.style.color = "#ff8b8b";
    mensajeAuth.textContent = "Las contraseñas no coinciden.";
    return;
  }

  // Guardar en el almacenamiento del navegador
  dbUsuarios[user] = pass;
  localStorage.setItem("usuariosHOSTOLD", JSON.stringify(dbUsuarios));

  // Limpiar campos de registro
  regUsuario.value = "";
  regPassword.value = "";
  regConfirmarPassword.value = "";

  // Mostrar éxito en verde y regresar automáticamente al Login
  mensajeAuth.style.color = "#00ffaa";
  mensajeAuth.textContent = "¡Registro exitoso! Redirigiendo...";

  setTimeout(() => {
    tabLogin.click();
    loginUsuario.value = user;
  }, 1500);
}

// --- MANEJO DE VISTAS Y LOGOUT ---
function mostrarBuscador() {
  panelAuth.hidden = true;
  panelMapas.hidden = false;
  limpiarSelect(region);
  agregarOpciones(region, Object.keys(datos));
  cargarUbicacionPersistente();
}

btnCerrarSesion.addEventListener("click", () => {
  sessionStorage.removeItem("sesionHOSTOLD");
  panelMapas.hidden = true;
  panelAuth.hidden = false;
  mensaje.textContent = "Seleccione una ubicación.";
});

function comprobarSesionActiva() {
  const sesion = sessionStorage.getItem("sesionHOSTOLD");
  if (sesion === "activa") {
    mostrarBuscador();
  } else {
    panelAuth.hidden = false;
    panelMapas.hidden = true;
  }
}

// --- LOGICA DEL BUSCADOR DE UBICACIONES ---
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

// Eventos de carga del mapa
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

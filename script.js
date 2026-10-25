const datos = { "Junín": { "Huancayo": { "Huancayo": ["Colegio Salesiano Santa Rosa", "Open Plaza Huancayo"] } } };
const region = document.getElementById("region"), provincia = document.getElementById("provincia"), distrito = document.getElementById("distrito"), lugar = document.getElementById("lugar");
const guardar = document.getElementById("guardar"), mensaje = document.getElementById("mensaje"), panelAuth = document.getElementById("panelAuth"), panelMapas = document.getElementById("panelMapas");
const tabLogin = document.getElementById("tabLogin"), tabRegistro = document.getElementById("tabRegistro"), formLogin = document.getElementById("formLogin"), formRegistro = document.getElementById("formRegistro"), mensajeAuth = document.getElementById("mensajeAuth");
const loginUsuario = document.getElementById("loginUsuario"), loginPassword = document.getElementById("loginPassword"), btnIngresar = document.getElementById("btnIngresar");
const regUsuario = document.getElementById("regUsuario"), regPassword = document.getElementById("regPassword"), regConfirmarPassword = document.getElementById("regConfirmarPassword"), btnRegistrar = document.getElementById("btnRegistrar");
const visorMapa = document.getElementById("visorMapa"), cerrarMapa = document.getElementById("cerrarMapa"), imagenMapa = document.getElementById("imagenMapa"), descargarMapa = document.getElementById("descargarMapa"), errorImagen = document.getElementById("errorImagen");
const mapaSalesiano = "IMG-20261001-WA0020.jpg", mapaOpenPlaza = "image_35840f16.jpg";

function alternarPestanas(loginActivo) {
  tabLogin.classList.toggle("activa", loginActivo); tabRegistro.classList.toggle("activa", !loginActivo);
  formLogin.hidden = !loginActivo; formRegistro.hidden = loginActivo; mensajeAuth.textContent = "";
}
tabLogin.addEventListener("click", () => alternarPestanas(true));
tabRegistro.addEventListener("click", () => alternarPestanas(false));

function ejecutarLogin() {
  const u = loginUsuario.value.trim().toLowerCase(), p = loginPassword.value;
  if (!u || !p) return mensajeAuth.textContent = "Llene todos los campos.";
  let db = JSON.parse(localStorage.getItem("usuariosHOSTOLD")) || {}; db["admin"] = "1234";
  if (db[u] && db[u] === p) { sessionStorage.setItem("sesionHOSTOLD", "activa"); mostrarBuscador(); }
  else { mensajeAuth.textContent = "Usuario o contraseña incorrectos."; }
}
btnIngresar.addEventListener("click", ejecutarLogin);
loginUsuario.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarLogin(); });
loginPassword.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarLogin(); });

function ejecutarRegistro() {
  const u = regUsuario.value.trim().toLowerCase(), p = regPassword.value, cp = regConfirmarPassword.value;
  if (!u || !p || !cp) return mensajeAuth.textContent = "Complete todos los campos.";
  let db = JSON.parse(localStorage.getItem("usuariosHOSTOLD")) || {}; db["admin"] = "1234";
  if (db[u]) return mensajeAuth.textContent = "El usuario ya existe.";
  if (p.length < 4) return mensajeAuth.textContent = "Mínimo 4 caracteres.";
  if (p !== cp) return mensajeAuth.textContent = "Las contraseñas no coinciden.";
  db[u] = p; localStorage.setItem("usuariosHOSTOLD", JSON.stringify(db));
  regUsuario.value = ""; regPassword.value = ""; regConfirmarPassword.value = "";
  mensajeAuth.style.color = "#00ffaa"; mensajeAuth.textContent = "¡Registro exitoso! Redirigiendo...";
  setTimeout(() => { mensajeAuth.style.color = "#ff8b8b"; alternarPestanas(true); loginUsuario.value = u; }, 1500);
}
btnRegistrar.addEventListener("click", ejecutarRegistro);
regUsuario.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarRegistro(); });
regPassword.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarRegistro(); });
regConfirmarPassword.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarRegistro(); });

function mostrarBuscador() {
  panelAuth.hidden = true; panelMapas.hidden = false; limpiarSelect(region); agregarOpciones(region, Object.keys(datos)); cargarUbicacionPersistente();
}
document.getElementById("btnCerrarSesion").addEventListener("click", () => { sessionStorage.removeItem("sesionHOSTOLD"); panelMapas.hidden = true; panelAuth.hidden = false; });

function limpiarSelect(s) { s.innerHTML = '<option value="">Seleccione...</option>'; s.disabled = true; }
function agregarOpciones(s, ops) { s.innerHTML = '<option value="">Seleccione...</option>'; ops.forEach(o => { const el = document.createElement("option"); el.value = o; el.textContent = o; s.appendChild(el); }); s.disabled = false; }

region.addEventListener("change", () => { limpiarSelect(provincia); limpiarSelect(distrito); limpiarSelect(lugar); if (region.value) agregarOpciones(provincia, Object.keys(datos[region.value])); });
provincia.addEventListener("change", () => { limpiarSelect(distrito); limpiarSelect(lugar); if (provincia.value) agregarOpciones(distrito, Object.keys(datos[region.value][provincia.value])); });
distrito.addEventListener("change", () => { limpiarSelect(lugar); if (distrito.value) agregarOpciones(lugar, datos[region.value][provincia.value][distrito.value]); });

guardar.addEventListener("click", () => {
  if (!region.value || !provincia.value || !distrito.value || !lugar.value) return mensaje.textContent = "Complete la ubicación.";
  try { localStorage.setItem("ubicacionHOSTOLD", JSON.stringify({ region: region.value, provincia: provincia.value, distrito: distrito.value, lugar: lugar.value })); } catch(e){}
  const tit = visorMapa.querySelector(".visor-contenido h2");
  if (lugar.value === "Colegio Salesiano Santa Rosa") { abrirMapa(mapaSalesiano, "Mapa del Colegio Salesiano Santa Rosa", tit); }
  else if (lugar.value === "Open Plaza Huancayo") { abrirMapa(mapaOpenPlaza, "Plano de Evacuación - Open Plaza Huancayo (Piso 1)", tit); }
});

function abrirMapa(src, alt, titEv) {
  errorImagen.hidden = true; imagenMapa.alt = alt; imagenMapa.src = src; descargarMapa.href = src; descargarMapa.download = src;
  if (titEv) titEv.textContent = alt; visorMapa.classList.add("activo"); visorMapa.setAttribute("aria-hidden", "false");
}

imagenMapa.addEventListener("load", () => { errorImagen.hidden = true; mensaje.textContent = "Mapa cargado correctamente."; });
imagenMapa.addEventListener("error", () => { errorImagen.hidden = false; imagenMapa.removeAttribute("src"); mensaje.textContent = "Error al cargar la imagen en GitHub."; });

function cerrarVisor() { visorMapa.classList.remove("activo"); visorMapa.setAttribute("aria-hidden", "true"); imagenMapa.removeAttribute("src"); }
cerrarMapa.addEventListener("click", cerrarVisor);
visorMapa.addEventListener("click", (e) => { if (e.target === visorMapa) cerrarVisor(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && visorMapa.classList.contains("activo")) cerrarVisor(); });

function cargarUbicacionPersistente() {
  try {
    const g = localStorage.getItem("ubicacionHOSTOLD"); if (!g) return; const u = JSON.parse(g);
    if (u.region && u.provincia && u.distrito && u.lugar && datos[u.region]?.[u.provincia]?.[u.distrito]?.includes(u.lugar)) {
      region.value = u.region; agregarOpciones(provincia, Object.keys(datos[u.region])); provincia.value = u.provincia;
      agregarOpciones(distrito, Object.keys(datos[u.region][u.provincia])); distrito.value = u.distrito;
      agregarOpciones(lugar, datos[u.region][u.provincia][u.distrito]); lugar.value = u.lugar; mensaje.textContent = "Ubicación restaurada.";
    }
  } catch(e){}
}

if (sessionStorage.getItem("sesionHOSTOLD") === "activa") { mostrarBuscador(); } else { panelAuth.hidden = false; panelMapas.hidden = true; }

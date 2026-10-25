const datos = { "Junín": { "Huancayo": { "Huancayo": ["Colegio Salesiano Santa Rosa", "Open Plaza Huancayo", "I.E. 31554 José Carlos Mariátegui"] } } };
const region = document.getElementById("region"), provincia = document.getElementById("provincia"), distrito = document.getElementById("distrito"), lugar = document.getElementById("lugar");
const guardar = document.getElementById("guardar"), mensaje = document.getElementById("mensaje"), panelAuth = document.getElementById("panelAuth"), panelMapas = document.getElementById("panelMapas");
const tabLogin = document.getElementById("tabLogin"), tabRegistro = document.getElementById("tabRegistro"), formLogin = document.getElementById("formLogin"), formRegistro = document.getElementById("formRegistro"), mensajeAuth = document.getElementById("mensajeAuth");
const loginUsuario = document.getElementById("loginUsuario"), loginPassword = document.getElementById("loginPassword"), btnIngresar = document.getElementById("btnIngresar");
const regUsuario = document.getElementById("regUsuario"), regPassword = document.getElementById("regPassword"), regConfirmarPassword = document.getElementById("regConfirmarPassword"), btnRegistrar = document.getElementById("btnRegistrar");
const visorMapa = document.getElementById("visorMapa"), cerrarMapa = document.getElementById("cerrarMapa"), imagenMapa = document.getElementById("imagenMapa"), descargarMapa = document.getElementById("descargarMapa"), errorImagen = document.getElementById("errorImagen");
const selectorPisos = document.getElementById("selectorPisos"), btnPiso1 = document.getElementById("btnPiso1"), btnPiso2 = document.getElementById("btnPiso2");
const mapasConfig = {
  "Colegio Salesiano Santa Rosa": { alt: "Mapa del Colegio Salesiano Santa Rosa", pisos: { 1: "IMG-20261001-WA0020.jpg" } },
  "Open Plaza Huancayo": { alt: "Plano de Evacuación - Open Plaza Huancayo (Piso 1)", pisos: { 1: "image_35840f16.jpg" } },
  "I.E. 31554 José Carlos Mariátegui": { alt: "Plano de Evacuación - I.E. Mariátegui", pisos: { 1: "image_730ff32a.jpg", 2: "mariategui_piso2.jpg" } }
};
let mapaActual = null; let intentoExtension = 0; let intentoQR = 0;

function alternarPestanas(loginActivo) {
  tabLogin.classList.toggle("activa", loginActivo); tabRegistro.classList.toggle("activa", !loginActivo);
  formLogin.hidden = !loginActivo; formRegistro.hidden = loginActivo; mensajeAuth.textContent = "";
}
if (tabLogin) tabLogin.addEventListener("click", () => alternarPestanas(true));
if (tabRegistro) tabRegistro.addEventListener("click", () => alternarPestanas(false));

function ejecutarLogin() {
  const u = loginUsuario.value.trim().toLowerCase(), p = loginPassword.value;
  if (!u || !p) { mensajeAuth.textContent = "Llene todos los campos."; return; }
  let db = JSON.parse(localStorage.getItem("usuariosHOSTOLD")) || {}; db["admin"] = "1234";
  if (db[u] && db[u] === p) { sessionStorage.setItem("sesionHOSTOLD", "activa"); mostrarBuscador(); }
  else { mensajeAuth.textContent = "Usuario o contraseña incorrectos."; }
}
if (btnIngresar) btnIngresar.addEventListener("click", ejecutarLogin);
loginUsuario.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarLogin(); });
loginPassword.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarLogin(); });

function ejecutarRegistro() {
  const u = regUsuario.value.trim().toLowerCase(), p = regPassword.value, cp = regConfirmarPassword.value;
  if (!u || !p || !cp) { mensajeAuth.textContent = "Complete todos los campos."; return; }
  let db = JSON.parse(localStorage.getItem("usuariosHOSTOLD")) || {}; db["admin"] = "1234";
  if (db[u]) { mensajeAuth.textContent = "El usuario ya existe."; return; }
  if (p.length < 4) { mensajeAuth.textContent = "Mínimo 4 caracteres."; return; }
  if (p !== cp) { mensajeAuth.textContent = "Las contraseñas no coinciden."; return; }
  db[u] = p; localStorage.setItem("usuariosHOSTOLD", JSON.stringify(db));
  regUsuario.value = ""; regPassword.value = ""; regConfirmarPassword.value = "";
  mensajeAuth.style.color = "#00ffaa"; mensajeAuth.textContent = "¡Registro exitoso! Ya puedes ingresar.";
  setTimeout(() => { mensajeAuth.style.color = "#ff8b8b"; alternarPestanas(true); loginUsuario.value = u; }, 1200);
}
if (btnRegistrar) btnRegistrar.addEventListener("click", ejecutarRegistro);
regUsuario.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarRegistro(); });
regPassword.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarRegistro(); });
regConfirmarPassword.addEventListener("keyup", (e) => { if (e.key === "Enter") ejecutarRegistro(); });

function mostrarBuscador() {
  panelAuth.hidden = true; panelMapas.hidden = false; limpiarSelect(region); agregarOpciones(region, Object.keys(datos)); cargarUbicacionPersistente();
  const imgQR = document.querySelector(".contenedor-qr img"); if (imgQR) { imgQR.src = "codigo_qr.jpeg"; }
}
const btnLogout = document.getElementById("btnCerrarSesion");
if (btnLogout) btnLogout.addEventListener("click", () => { sessionStorage.removeItem("sesionHOSTOLD"); panelMapas.hidden = true; panelAuth.hidden = false; });

function limpiarSelect(s) { s.innerHTML = '<option value="">Seleccione...</option>'; s.disabled = true; }
function agregarOpciones(s, ops) { s.innerHTML = '<option value="">Seleccione...</option>'; ops.forEach(o => { const el = document.createElement("option"); el.value = o; el.textContent = o; s.appendChild(el); }); s.disabled = false; }

region.addEventListener("change", () => { limpiarSelect(provincia); limpiarSelect(distrito); limpiarSelect(lugar); if (region.value) agregarOpciones(provincia, Object.keys(datos[region.value])); });
provincia.addEventListener("change", () => { limpiarSelect(distrito); limpiarSelect(lugar); if (provincia.value) agregarOpciones(distrito, Object.keys(datos[region.value][provincia.value])); });
distrito.addEventListener("change", () => { limpiarSelect(lugar); if (distrito.value) agregarOpciones(lugar, datos[region.value][provincia.value][distrito.value]); });

function cambiarPiso(num) {
  if (!mapaActual || !mapaActual.pisos[num]) return;
  btnPiso1.classList.toggle("activa", num === 1); btnPiso2.classList.toggle("activa", num === 2);
  errorImagen.hidden = true; intentoExtension = 0;
  const srcOriginal = mapaActual.pisos[num]; imagenMapa.src = srcOriginal; descargarMapa.href = srcOriginal; descargarMapa.download = srcOriginal;
}
if (btnPiso1) btnPiso1.addEventListener("click", () => cambiarPiso(1));
if (btnPiso2) btnPiso2.addEventListener("click", () => cambiarPiso(2));

guardar.addEventListener("click", () => {
  const lg = lugar.value;
  if (!region.value || !provincia.value || !distrito.value || !lg) { mensaje.textContent = "Complete la ubicación."; return; }
  try { localStorage.setItem("ubicacionHOSTOLD", JSON.stringify({ region: region.value, provincia: provincia.value, distrito: distrito.value, lugar: lg })); } catch(e){}
  if (mapasConfig[lg]) {
    mapaActual = mapasConfig[lg]; mensaje.textContent = "Abriendo plano...";
    const tit = visorMapa.querySelector(".visor-contenido h2"); if (tit) tit.textContent = mapaActual.alt;
    selectorPisos.hidden = Object.keys(mapaActual.pisos).length <= 1;
    cambiarPiso(1); visorMapa.classList.add("activo"); visorMapa.setAttribute("aria-hidden", "false");
  }
});

imagenMapa.addEventListener("load", () => { errorImagen.hidden = true; mensaje.textContent = "Mapa cargado correctamente."; });
imagenMapa.addEventListener("error", () => {
  const formatos = [".JPG", ".png", ".PNG", ".jpeg"];
  if (intentoExtension < formatos.length) {
    const ext = formatos[intentoExtension]; intentoExtension++;
    const base = imagenMapa.src.substring(0, imagenMapa.src.lastIndexOf('.'));
    imagenMapa.src = base + ext; descargarMapa.href = base + ext;
  } else { errorImagen.hidden = false; imagenMapa.removeAttribute("src"); mensaje.textContent = "Error de archivo en GitHub."; }
});

const imgQR = document.querySelector(".contenedor-qr img");
if (imgQR) {
  imgQR.addEventListener("error", () => {
    const formatosQR = [".jpg", ".JPG", ".png", ".PNG"];
    if (intentoQR < formatosQR.length) {
      const ext = formatosQR[intentoQR]; intentoQR++;
      const base = imgQR.src.substring(0, imgQR.src.lastIndexOf('.')); imgQR.src = base + ext;
    }
  });
}

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

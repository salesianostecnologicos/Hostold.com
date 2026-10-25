
const datos = {
  "Junín": {
    "Huancayo": {
      "Huancayo": [
        "Colegio Salesiano Santa Rosa"
      ]
    }
  }
};

// Elementos de ubicación
const region = document.getElementById("region");
const provincia = document.getElementById("provincia");
const distrito = document.getElementById("distrito");
const lugar = document.getElementById("lugar");

const guardar = document.getElementById("guardar");
const mensaje = document.getElementById("mensaje");

// Elementos del mapa
const visorMapa = document.getElementById("visorMapa");
const cerrarMapa = document.getElementById("cerrarMapa");
const imagenMapa = document.getElementById("imagenMapa");
const descargarMapa = document.getElementById("descargarMapa");

// Nombre exacto del archivo del mapa
const nombreMapa =
  "Gemini_Generated_Image_n2uqnfn2uqnfn2uq.jpeg";

// Limpiar un selector
function limpiarSelect(select) {
  select.innerHTML =
    '<option value="">Seleccione...</option>';
  select.disabled = true;
}

// Añadir opciones a un selector
function agregarOpciones(select, opciones) {
  opciones.forEach(opcion => {
    const elemento = document.createElement("option");

    elemento.value = opcion;
    elemento.textContent = opcion;

    select.appendChild(elemento);
  });

  select.disabled = false;
}

// Cargar las regiones disponibles
agregarOpciones(region, Object.keys(datos));

// Seleccionar región
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

// Seleccionar provincia
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

// Seleccionar distrito
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

// Guardar ubicación y abrir el mapa
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

  localStorage.setItem(
    "ubicacionHOSTOLD",
    JSON.stringify(ubicacion)
  );

  mensaje.textContent =
    `Ubicación guardada: ${lugar.value}`;

  if (lugar.value === "Colegio Salesiano Santa Rosa") {
    imagenMapa.src = nombreMapa;

    imagenMapa.alt =
      "Mapa del Colegio Salesiano Santa Rosa";

    descargarMapa.href = nombreMapa;

    descargarMapa.download =
      "Hostold-Colegio-Salesiano-Santa-Rosa.jpeg";

    visorMapa.classList.add("activo");
  }
});

// Cerrar el mapa
function cerrarVisor() {
  visorMapa.classList.remove("activo");
}

cerrarMapa.addEventListener("click", cerrarVisor);

// Cerrar al pulsar fuera del mapa
visorMapa.addEventListener("click", evento => {
  if (evento.target === visorMapa) {
    cerrarVisor();
  }
});

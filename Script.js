const datos = {
  "Junín": {
    "Huancayo": {
      "Huancayo": [
        "Colegio Salesiano Santa Rosa"
      ]
    }
  }
};

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

function limpiarSelect(select) {
  select.innerHTML = '<option value="">Seleccione...</option>';
  select.disabled = true;
}

function agregarOpciones(select, opciones) {
  opciones.forEach(opcion => {
    const option = document.createElement("option");
    option.value = opcion;
    option.textContent = opcion;
    select.appendChild(option);
  });

  select.disabled = false;
}

// Cargar regiones
agregarOpciones(region, Object.keys(datos));

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

    const nombreMapa =
      "Gemini_Generated_Image_n2uqnfn2uqnfn2uq.jpeg";

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
cerrarMapa.addEventListener("click", () => {
  visorMapa.classList.remove("activo");
  imagenMapa.src = "";
});

// Cerrar haciendo clic fuera del mapa
visorMapa.addEventListener("click", (evento) => {

  if (evento.target === visorMapa) {
    visorMapa.classList.remove("activo");
    imagenMapa.src = "";
  }

});

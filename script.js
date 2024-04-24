document.addEventListener("DOMContentLoaded", function() {
    // Restaurar datos del localStorage si existen, o inicializar un objeto vacío
    const modelosPorMesa = JSON.parse(localStorage.getItem('modelosPorMesa')) || {};
    const modelosLista = document.getElementById("modelos-lista");
    const resetearBtn = document.getElementById("resetear-btn");
    const modeloInput = document.getElementById("modelo-input");
    const confirmarBtn = document.getElementById("confirmar-btn");
    const menuBtn = document.querySelector(".menu-btn");
    const menu = document.getElementById("menu");
    const mesaTitulo = document.getElementById("mesa-titulo");
    const buscarModeloBtn = document.getElementById("buscar-modelo-btn");
    const buscarModeloInput = document.getElementById("buscar-modelo-input");
    const mensajeResultado = document.getElementById("mensaje-resultado");
    const mensajeContainer = document.getElementById("mensaje-container");

    function toggleMenu() {
        menu.classList.toggle("show-menu");
    }

    function toggleMensaje(show) {
        if (show) {
            mensajeContainer.classList.add("show");
        } else {
            mensajeContainer.classList.remove("show");
        }
    }

    resetearBtn.addEventListener("click", function() {
        const confirmModal = document.getElementById("confirmModal");
        const confirmYes = document.getElementById("confirmYes");
        const confirmNo = document.getElementById("confirmNo");

        confirmModal.style.display = "block";

        confirmYes.onclick = function() {
            modelosLista.innerHTML = "";
            modelosPorMesa[currentTable] = [];
            actualizarListaModelos();
            confirmModal.style.display = "none";
            guardarDatosLocalStorage(); // Guardar datos en el localStorage
        };

        confirmNo.onclick = function() {
            confirmModal.style.display = "none";
        };
    });

    confirmarBtn.addEventListener("click", function() {
        const modeloNombre = modeloInput.value.trim();
        if (modeloNombre) {
            if (!modelosPorMesa[currentTable]) {
                modelosPorMesa[currentTable] = [];
            }
            let modelo = modelosPorMesa[currentTable].find(bebida => bebida.nombre === modeloNombre);
            if (!modelo) {
                modelo = { nombre: modeloNombre }; // No se establece cantidad inicial
                modelosPorMesa[currentTable].push(modelo);
            }
            actualizarListaModelos();
            modeloInput.value = "";
            guardarDatosLocalStorage(); // Guardar datos en el localStorage
        }
    });

    document.querySelectorAll(".menu a").forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const mesa = event.target.textContent;
            currentTable = mesa;
            actualizarListaModelos();
            mesaTitulo.textContent = mesa;
            toggleMenu();
        });
    });

    buscarModeloBtn.addEventListener("click", function() {
        const modeloBuscado = buscarModeloInput.value.trim().toLowerCase();

        if (modeloBuscado) {
            const mesaEncontrada = buscarMesaPorModelo(modeloBuscado);
            if (mesaEncontrada) {
                mensajeResultado.textContent = `El modelo '${modeloBuscado}' se encuentra en ${mesaEncontrada}`;
            } else {
                mensajeResultado.textContent = `El modelo '${modeloBuscado}' no se encuentra en ninguna mesa.`;
            }
            toggleMensaje(true);
        } else {
            mensajeResultado.textContent = "Por favor, ingresa un modelo para buscar.";
            toggleMensaje(true);
        }
        
        // Limpiar el mensaje después de buscar
        setTimeout(function() {
            toggleMensaje(false);
            buscarModeloInput.value = ""; // Vaciar el input de búsqueda
        }, 3000); // Limpiar el mensaje después de 3 segundos
    });

    // Función para buscar el modelo en las mesas
    function buscarMesaPorModelo(modelo) {
        for (const mesa in modelosPorMesa) {
            const modelos = modelosPorMesa[mesa];
            if (modelos.some(modeloItem => modeloItem.nombre === modelo)) {
                return mesa;
            }
        }
        return null;
    }

    let currentTable = ""; // Inicializamos como cadena vacía para no mostrar modelos al inicio

    menuBtn.addEventListener("click", toggleMenu);

    document.addEventListener("click", function(event) {
        if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
            menu.classList.remove("show-menu");
        }
    });

    // Función para guardar los datos en el localStorage
    function guardarDatosLocalStorage() {
        localStorage.setItem('modelosPorMesa', JSON.stringify(modelosPorMesa));
    }

    // Función para actualizar la lista de modelos
    function actualizarListaModelos() {
        modelosLista.innerHTML = ""; // Limpiamos la lista de modelos al inicio
        const modelos = modelosPorMesa[currentTable] || [];
        modelos.forEach(function(modelo) {
            const li = document.createElement("li");
            const modeloSpan = document.createElement("span");
            const btnDelete = document.createElement("button");

            modeloSpan.textContent = modelo.nombre;

            btnDelete.textContent = "X";
            btnDelete.classList.add("btn-delete");

            btnDelete.addEventListener("click", function() {
                const index = modelosPorMesa[currentTable].indexOf(modelo);
                if (index !== -1) {
                    modelosPorMesa[currentTable].splice(index, 1);
                    actualizarListaModelos();
                    guardarDatosLocalStorage(); // Guardar datos en el localStorage
                }
            });

            li.appendChild(btnDelete);
            li.appendChild(modeloSpan);
            li.classList.add("modelo-container");

            modelosLista.appendChild(li);
        });

        guardarDatosLocalStorage(); // Guardar datos en el localStorage
    }

    // Actualizar lista de modelos al cargar la página
    actualizarListaModelos();
});
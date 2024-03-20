document.addEventListener("DOMContentLoaded", function() {
    const bebidasPorMesa = {}; // Objeto para almacenar las bebidas de cada mesa
    const bebidasLista = document.getElementById("bebidas-lista");
    const resetearBtn = document.getElementById("resetear-btn");
    const modal = document.getElementById("modal");
    const bebidaInput = document.getElementById("bebida-input");
    const confirmarBtn = document.getElementById("confirmar-btn");
    const closeBtn = document.getElementsByClassName("close")[0];
    const menuBtn = document.querySelector(".menu-btn");
    const menu = document.getElementById("menu");
    const mesaTitulo = document.getElementById("mesa-titulo");

    function toggleMenu() {
        menu.classList.toggle("show-menu");
    }

    // Agregamos el evento de clic al botón "Reset"
    resetearBtn.addEventListener("click", function() {
        bebidasLista.innerHTML = ""; // Elimina todos los elementos de la lista de bebidas
        bebidasPorMesa[currentTable] = []; // Borra las bebidas de la mesa actual
    });

    confirmarBtn.addEventListener("click", function() {
        const bebidaNombre = bebidaInput.value.trim();
        if (bebidaNombre) {
            // Verificar si existe la mesa en bebidasPorMesa, si no existe, crearla
            if (!bebidasPorMesa[currentTable]) {
                bebidasPorMesa[currentTable] = [];
            }
            let bebida = bebidasPorMesa[currentTable].find(bebida => bebida.nombre === bebidaNombre);
            if (!bebida) {
                bebida = { nombre: bebidaNombre, cantidad: 0 }; // Establecer la cantidad inicial en 0
                bebidasPorMesa[currentTable].push(bebida);
            }
            actualizarListaBebidas();
            bebidaInput.value = ""; // Borrar el contenido del input después de confirmar la bebida
        }
    });

    // Manejar el cambio de mesa
    document.querySelectorAll(".menu a").forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const mesa = event.target.textContent;
            currentTable = mesa;
            actualizarListaBebidas();
            mesaTitulo.textContent = mesa; // Mostrar el nombre de la mesa debajo del título
            toggleMenu(); // Ocultar el menú emergente al seleccionar una mesa
        });
    });

    // Función para actualizar la lista de bebidas según la mesa actual
    function actualizarListaBebidas() {
        bebidasLista.innerHTML = ""; // Limpiar la lista de bebidas
        const bebidas = bebidasPorMesa[currentTable] || []; // Obtener las bebidas de la mesa actual
        bebidas.forEach(function(bebida) {
            const li = document.createElement("li");
            const bebidaSpan = document.createElement("span");
            const btnDelete = document.createElement("button");

            bebidaSpan.textContent = bebida.nombre;

            btnDelete.textContent = "X";
            btnDelete.classList.add("btn-delete");

            btnDelete.addEventListener("click", function() {
                bebida.cantidad = 0; // Restablecer la cantidad a 0
                const index = bebidasPorMesa[currentTable].indexOf(bebida);
                if (index !== -1) {
                    bebidasPorMesa[currentTable].splice(index, 1);
                }
                actualizarListaBebidas();
            });

            li.appendChild(btnDelete);
            li.appendChild(bebidaSpan);
            li.classList.add("bebida-container");

            bebidasLista.appendChild(li);
        });
    }

    let currentTable = "Taula 1"; // Inicializar la mesa actual

    // Evento de clic para mostrar/ocultar el menú
    menuBtn.addEventListener("click", toggleMenu);

    document.addEventListener("click", function(event) {
        if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
            menu.classList.remove("show-menu");
        }
    });

    // Actualizar lista de bebidas al cargar la página
    actualizarListaBebidas();
});
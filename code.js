// Se ha partido de la base de una tabla/cuadrícula donde la serpiente se moverá (irá ocupando diferentes celdas)

$(document).ready(function () {
  // Variables del juego
  let direccion,
    velocidad,
    intervalo,
    celdaFruta,
    tamanioTabla,
    juegoEmpezado,
    celdaSnake,
    cabezaSnake;
  var puntuacionMasAlta = 0;
  var puntuacion;

  // Mapeo de direcciones en filas y columnas
  const coordenadasTabla = {
    ArrowRight: [0, 1],
    ArrowLeft: [0, -1],
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
  };

  // Función para inicializar o reiniciar el juego
  function prepararJuego() {
    direccion = "ArrowRight"; // Dirección inicial de la serpiente
    velocidad = 150; // Velocidad inicial del juego
    intervalo = null; // Intervalo de actualización de la serpiente
    celdaFruta = []; // Celda donde aparecerá la fruta
    puntuacion = 0; // Puntuación inicial
    tamanioTabla = 25; // Tamaño del tablero
    juegoEmpezado = false; // Indica si el juego está en marcha

    // Posiciones iniciales de la serpiente (cuerpo y cabeza)
    celdaSnake = [
      [2, 6],
      [2, 5],
      [2, 4],
      [2, 3],
      [2, 2],
    ];
    // Cabeza
    cabezaSnake = [2, 6];

    $("#puntuacion").html("Puntuación: 0");

    // Limpia el tablero de celdas anteriores
    $("td").removeClass("celdaSnake cabezaSnake celdaFruta");

    // Inicia serpierte y fruta
    pintarSnake();
    generarFruta();
  }

  // Genera el tablero de juego
  function pintarTabla() {
    // Crea las filas y columnas de la tabla
    let filas = "<td></td>".repeat(tamanioTabla);
    let tabla = Array(tamanioTabla).fill(`<tr>${filas}</tr>`).join("");

    $("#tablero").append(`<table>${tabla}</table>`);
  }

  // Pinta la serpiente
  function pintarSnake() {
    $("td").removeClass("celdaSnake cabezaSnake"); // Limpia la tabla

    // Pinta el cuerpo de la serpiente
    celdaSnake.forEach((cell) => {
      $("tr").eq(cell[0]).find("td").eq(cell[1]).addClass("celdaSnake");
    });

    // Pinta la cabeza de la serpiente
    $("tr")
      .eq(cabezaSnake[0])
      .find("td")
      .eq(cabezaSnake[1])
      .addClass("cabezaSnake");
  }
  // Genera una nueva fruta en una posición aleatoria
  function generarFruta() {
    celdaFruta = [getRandomNumber(tamanioTabla), getRandomNumber(tamanioTabla)];
    pintarFruta();
  }

  // Pinta la fruta en el tablero
  function pintarFruta() {
    $("td").removeClass("celdaFruta").empty(); // Elimina la clase y cualquier contenido previo
    $("tr")
      .eq(celdaFruta[0])
      .find("td")
      .eq(celdaFruta[1])
      .addClass("celdaFruta")
      .html('<img src="img/apple.png" width="7px" height="7px" alt="Fruta">'); // Agrega la imagen
  }

  // Finaliza el juego cuando la serpiente choca
  function gameOver() {
    juegoEmpezado = false; // Detiene el juego
    clearInterval(intervalo); // Detiene el intervalo
    if (puntuacion > puntuacionMasAlta) {
      puntuacionMasAlta = puntuacion;
    }
    $("#masAlta").html("Tu puntuación más alta: " + puntuacionMasAlta + "🏆");
    $(".botones").fadeIn();
    $("#btnRestart").fadeIn(3000); // Muestra el boton de reinicio
    $("#gameOver").fadeIn();
  }

  // Actualiza la posición de la serpiente
  function moverSnake() {
    if (!juegoEmpezado) return; // Si el juego no ha empezado, no hace nada

    let [movHorizontal, movVertical] = coordenadasTabla[direccion]; // Obtiene el movimiento en ambas direcciones
    let cabezaSnakeNueva = [
      cabezaSnake[0] + movHorizontal,
      cabezaSnake[1] + movVertical,
    ]; // Calcula la nueva posición de la cabeza

    // Verifica si la nueva posición está fuera de los límites o choca con el cuerpo
    if (
      cabezaSnakeNueva[0] < 0 ||
      cabezaSnakeNueva[1] < 0 ||
      cabezaSnakeNueva[0] >= tamanioTabla ||
      cabezaSnakeNueva[1] >= tamanioTabla ||
      $("tr")
        .eq(cabezaSnakeNueva[0])
        .find("td")
        .eq(cabezaSnakeNueva[1])
        .hasClass("celdaSnake")
    ) {
      gameOver();
      return;
    }

    // Si la serpiente come la fruta
    if (
      $("tr")
        .eq(cabezaSnakeNueva[0])
        .find("td")
        .eq(cabezaSnakeNueva[1])
        .hasClass("celdaFruta")
    ) {
      celdaSnake.push([]);
      generarFruta();
      puntuacion += 10;
      $("#puntuacion").html("Puntuación: " + puntuacion);
      velocidad = Math.max(50, velocidad - 20); // Aumenta la velocidad al comer una fruta, no puede ser menos de 50
      clearInterval(intervalo); // Detiene el intervalo actual
      intervalo = setInterval(moverSnake, velocidad); // Reinicia el intervalo con la nueva velocidad
    }

    // Mueve el cuerpo de la serpiente
    for (let i = celdaSnake.length - 1; i > 0; i--) {
      celdaSnake[i] = [...celdaSnake[i - 1]];
    }
    // Actualiza la cabeza de la serpiente
    celdaSnake[0] = cabezaSnake = cabezaSnakeNueva;

    // Redibuja la serpiente en la nueva posicion
    pintarSnake();
  }

  // Número aleatorio dentro de los limites de la tabla
  function getRandomNumber(limit) {
    return Math.floor(Math.random() * limit);
  }

  // Inicia el juego
  function startGame() {
    if (juegoEmpezado) return;
    juegoEmpezado = true;
    $(".botones").hide();
    $("#gameOver").fadeOut();
    intervalo = setInterval(moverSnake, velocidad);
  }

  // Carga la primera vez el tablero
  prepararJuego();
  pintarTabla();

  // Captura las teclas presionadas
  $(document).on("keydown", function (e) {
    // Cambia la dirección de la serpiente según la tecla presionada
    const newDirection = e.key;

    // Evita que la serpiente pueda girar en dirección opuesta, además tiene que ser una de las flechas
    if (
      coordenadasTabla[newDirection] &&
      !(
        (direccion === "ArrowUp" && newDirection === "ArrowDown") ||
        (direccion === "ArrowDown" && newDirection === "ArrowUp") ||
        (direccion === "ArrowLeft" && newDirection === "ArrowRight") ||
        (direccion === "ArrowRight" && newDirection === "ArrowLeft")
      )
    ) {
      direccion = newDirection;
    }
  });

  // Inicia el juego al hacer clic en el botón de inicio
  $(document).on("click", "#btnStart", function () {
    prepararJuego();
    startGame();
    $(this).fadeOut();
  });
  // Reinicia
  $(document).on("click", "#btnRestart", function () {
    prepararJuego();
    startGame();
  });
});

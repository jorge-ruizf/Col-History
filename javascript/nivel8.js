(function () {
  "use strict";

  /**
   * Generar una nuevo juego de sopa de letras dado un conjunto de palabras.
   * Puede generar automáticamente la sopa de letras más pequeña posible que
   * contenga todas las palabras, o generar una cuyo tamaño sea explícitamente
   * dado.
   */

  const SopaDeLetras = () => {
    // Letras usadas para rellenar el tablero
    const letras = "abcdefghijklmnoprstuvwxyz";

    // Lista de todos los nombres de orientaciones posibles
    const orientacionesPosibles = [
      "horizontal",
      "horizontalIzq",
      "vertical",
      "verticalArriba",
      "diagonal",
      "diagonalArriba",
      "diagonalIzq",
      "diagonalArribaIzq",
    ];

    // Defincion de la orientacion. Cada una de estas funciona calcula la siguiente casilla dada una casilla de inicio (x, y) y una distancia
    // desde esa casilla.
    const orientaciones = {
      horizontal: function (x, y, i) {
        return { x: x + i, y: y };
      },
      horizontalIzq: function (x, y, i) {
        return { x: x - i, y: y };
      },
      vertical: function (x, y, i) {
        return { x: x, y: y + i };
      },
      verticalArriba: function (x, y, i) {
        return { x: x, y: y - i };
      },
      diagonal: function (x, y, i) {
        return { x: x + i, y: y + i };
      },
      diagonalIzq: function (x, y, i) {
        return { x: x - i, y: y + i };
      },
      diagonalArriba: function (x, y, i) {
        return { x: x + i, y: y - i };
      },
      diagonalArribaIzq: function (x, y, i) {
        return { x: x - i, y: y - i };
      },
    };

    // Determina si una orientacion es posible dada una casilla de inicio (x, y), la altura (h) y el tamano (w) de la sopa de letras, y la longitud
    // de la palabra.
    // Retorna true si la palabra dada se podria ubicar en la casilla de inicio con la orientación indicada.
    const validarOrientaciones = {
      horizontal: function (x, y, h, w, l) {
        return w >= x + l;
      },
      horizontalIzq: function (x, y, h, w, l) {
        return x + 1 >= l;
      },
      vertical: function (x, y, h, w, l) {
        return h >= y + l;
      },
      verticalArriba: function (x, y, h, w, l) {
        return y + 1 >= l;
      },
      diagonal: function (x, y, h, w, l) {
        return w >= x + l && h >= y + l;
      },
      diagonalIzq: function (x, y, h, w, l) {
        return x + 1 >= l && h >= y + l;
      },
      diagonalArriba: function (x, y, h, w, l) {
        return w >= x + l && y + 1 >= l;
      },
      diagonalArribaIzq: function (x, y, h, w, l) {
        return x + 1 >= l && y + 1 >= l;
      },
    };

    // Determina la siguiente casilla valida en la que se podria ubicar una palabra de longitud (l) cuando la coordenada (x, y) dada es invalida.
    // Esto reduce el numero de casillas que deben ser validadadas, por ejemplo, si retornáramos {x: x+1, y: y} funcionaría, pero nos haría
    // validar casilla por casilla.
    const saltarOrientaciones = {
      horizontal: function (x, y, l) {
        return { x: 0, y: y + 1 };
      },
      horizontalIzq: function (x, y, l) {
        return { x: l - 1, y: y };
      },
      vertical: function (x, y, l) {
        return { x: 0, y: y + 100 };
      },
      verticalArriba: function (x, y, l) {
        return { x: 0, y: l - 1 };
      },
      diagonal: function (x, y, l) {
        return { x: 0, y: y + 1 };
      },
      diagonalIzq: function (x, y, l) {
        return { x: l - 1, y: x >= l - 1 ? y + 1 : y };
      },
      diagonalArriba: function (x, y, l) {
        return { x: 0, y: y < l - 1 ? l - 1 : y + 1 };
      },
      diagonalArribaIzq: function (x, y, l) {
        return { x: l - 1, y: x >= l - 1 ? y + 1 : y };
      },
    };

    /**
     * Inicializa el juega y ubica las palabras en el juego, una a la vez.
     *
     * Retorna un juego valido, o null si no fue posible armar el juego.
     *
     * @param palabras: La lista de palabras a acomodar
     * @param opciones: Las opciones a usar en el momento de rellenar la sopa de letras
     */
    const rellenarSopa = (palabras, opciones) => {
      const sopa = [];
      let i;
      let j;
      let len;
      console.log("opciones = ", opciones);

      // Primero inicializamos la sopa con caracteres vacios
      for (i = 0; i < opciones.alto; i++) {
        sopa.push([]);
        for (j = 0; j < opciones.ancho; j++) {
          sopa[i].push("");
        }
      }

      // Acto seguido, vamos ubicando cada palabra en la sopa de letras
      for (i = 0, len = palabras.length; i < len; i++) {
        if (!acomodarPalabraEnLaSopa(sopa, opciones, palabras[i])) {
          // Si una palabra no pudo ser acomodada, nos rendimos
          return null;
        }
      }

      // return the puzzle
      return sopa;
    };

    /**
     * Agrega la palabra especificada en la sopa de letras encontrando todas las posibles ubicaciones
     * donde la palabra cabría y seleccionamos una de estas al azar. El objeto opciones controla si
     * se debe usar superposicion de palabras.
     *
     * Retorna true si la palabra pudo ser ubicada, y falso si no.
     *
     * @param sopa: Estado actual de la sopa de letras
     * @param opciones: Objeto de opciones a usar al llenar la sopa de letras
     * @param palabra: La palabra a acomodar en la sopa de letras
     */
    var acomodarPalabraEnLaSopa = (sopa, opciones, palabra) => {
      // Buscar las ubicaciones posibles donde la palabra cabría
      const ubicaciones = buscarUbicacionesPosibles(sopa, opciones, palabra);

      if (ubicaciones.length === 0) {
        return false;
      }

      // Seleccionar una de ellas al azar
      const sel = ubicaciones[Math.floor(Math.random() * ubicaciones.length)];
      ubicarPalabra(
        sopa,
        palabra,
        sel.x,
        sel.y,
        orientaciones[sel.orientacion]
      );

      return true;
    };

    /**
     * Itera la sopa de letras para determinar todas las ubicaciones donde una palabra cabría.
     * En el objeto opciones se especifica si intentamos usar superposicion en la medida de lo posible.
     *
     *
     * Retorna una lista de objetos que representan una ubicación. Cada objeto contiene una coordenada
     * (x, y) donde comenzaría la palabra, su orientación y el número de letras que se suporpondrían
     * con letras de palabras previamente acomodadas en la sopa.
     *
     * @param tablero: El estado actual de la sopa de letras
     * @param opciones: Objeto de opciones con el que se creó la sopa de letras
     * @param palabra: La palabra a ubicar dentro de la sopa de letras
     */
    var buscarUbicacionesPosibles = (tablero, opciones, palabra) => {
      const ubicaciones = [];
      const { alto, ancho } = opciones;
      const tamanoPalabra = palabra.length;
      let superposicionMax = 0;

      // Recorremos todas las orientaciones posibles en esta posicion
      for (let k = 0, len = opciones.orientaciones.length; k < len; k++) {
        const orientacion = opciones.orientaciones[k];
        const verificarOrientacion = validarOrientaciones[orientacion];
        const siguiente = orientaciones[orientacion];
        const skipTo = saltarOrientaciones[orientacion];
        var x = 0;
        var y = 0;

        // Recorrermos cada posición del tablero
        while (y < alto) {
          // Verificamos si la orientación es posible en esta coordenada
          if (verificarOrientacion(x, y, alto, ancho, tamanoPalabra)) {
            // Determinamos si la palabra se puede acomodar en esta coordenada
            var superposicion = calcularSuperposicion(
              palabra,
              tablero,
              x,
              y,
              siguiente
            );

            // if the overlap was bigger than previous overlaps that we've seen
            if (
              superposicion >= superposicionMax ||
              (!opciones.superponer && superposicion > -1)
            ) {
              superposicionMax = superposicion;
              ubicaciones.push({ x, y, orientacion, superposicion });
            }

            x++;
            if (x >= ancho) {
              x = 0;
              y++;
            }
          } else {
              // Si la orientación no da en la posición actual, vamos a la siguiente celda donde la orientación sí sería posible.
              const siguientePosible = skipTo(x, y, tamanoPalabra);
            x = siguientePosible.x;
            y = siguientePosible.y;
          }
        }
      }

      // Si estamos usando superposicion, dejamos solo las ubicaciones con la superposicion maxima
      return opciones.superponer
        ? refinarUbicaciones(ubicaciones, superposicionMax)
        : ubicaciones;
    };

    /**
     * Determina si una palabra se puede acomodar en lo que va del tablero con la orientacion dada.
     *
     * Retorna el número de letras que se superponen con palabras previamente acomodadas siempre y cuando la palabra sí se pueda
     * acomodar en la posición (x, y) dada; -1 si la palabra ni siquiera cabe.
     *
     * @param palabra: La palabra a ubicar en la sopa de letras
     * @param tablero: El estado actual de la sopa de letras
     * @param x: Posición x a probar
     * @param y: Posición y a probar
     * @param fnSiguienteCasilla: Función que retorna la siguiente casilla
     */
    var calcularSuperposicion = (palabra, tablero, x, y, fnSiguienteCasilla) => {
      let superposicion = 0;

      // Recorremos el tablero para determinar si la palabra se puede acomodar
      for (let i = 0, len = palabra.length; i < len; i++) {
        const siguiente = fnSiguienteCasilla(x, y, i);
        const casilla = tablero[siguiente.y][siguiente.x];

        // Si la casilla ya contiene la letra que estamos buscando acomodar, incrementamos el contador de superposicion
        if (casilla === palabra[i]) {
          superposicion++;
        }
        // De lo contrario, significa que la palabra ni siquiera se puede acomodar aqui
        else if (casilla !== "") {
          return -1;
        }
      }

      return superposicion;
    };

    /**
     * Si se especificó que se debe usar superposición, se usa esta función para
     * descartar las ubicaciones validas que no arrojaron la máxima superposición.
     *
     * Retorna el conjuto de ubicaciones con el máximo de superposición.
     *
     * @param ubicaciones: El conjunto de ubicaciones a refinar
     * @param superposicion: El nivel de  superposición requerido
     */
    var refinarUbicaciones = (ubicaciones, superposicion) => {
      const ubicacionesOptimas = [];
      for (let i = 0, len = ubicaciones.length; i < len; i++) {
        if (ubicaciones[i].superposicion >= superposicion) {
          ubicacionesOptimas.push(ubicaciones[i]);
        }
      }

      return ubicacionesOptimas;
    };

    /**
     * Ubica una palabra en el tablero dada una posición (x, y) inicial y una orientación.
     *
     * @param tablero: Estado actual de la sopa de letras
     * @param palabra: La palabra a ubicar
     * @param x: Posición x a intentar
     * @param y: Posición y a intentar
     * @param fnSiguienteCasilla: Funcion que retorna la siguiente casilla
     */
    var ubicarPalabra = (tablero, palabra, x, y, fnSiguienteCasilla) => {
      for (let i = 0, len = palabra.length; i < len; i++) {
        const siguienteCasilla = fnSiguienteCasilla(x, y, i);
        tablero[siguienteCasilla.y][siguienteCasilla.x] = palabra[i];
      }
    };

    // API Publica
    return {
       orientacionesPosibles,

       orientaciones,

      /**
       * Genera un nuevo tablero de sopa de letras.
       *
       * Opciones:
       *
       * alto: Altura deseada del tablero. Por defecto: la más pequeña posible de acuerdo a las palabras y si se debe usar superposción
       * ancho:  Ancho deseado del tablero. Por defecto: el más pequeño posible de acuerdo a las palabras y si se debe usar superposción
       * orientaciones: Lista de las orientaciones a usar. Por defecto: todas
       * llenarEspacios: true si se deben llenar los espacios. Por defecto: true
       * superponer: Si se debe usar el máximo de superposición. Por defecto: true
       *
       * Returns the puzzle that was created.
       *
       * @param palabras: Lista de palabras a incluir en el tablero
       * @param opciones: Opciones para la creación del tablero
       */
      nuevoTablero: function (palabras, opciones) {
        let listaPalabras;
        let tablero;
        let intentos = 0;
        const opts = opciones || {};

        console.log("nuevoTablero() :: settings = ", opciones);

        // Copiamos y ordenamos las palabras por tamaño (de la más larga a la más corta), pues se deben ir acomodando las más largas
        // primero.
        listaPalabras = palabras.slice(0).sort((a, b) => a.length < b.length ? 1 : 0);

        const opcionesAUsar = {
          alto: opts.alto || listaPalabras[0].length,
          ancho: opts.ancho || listaPalabras[0].length,
          orientaciones: opts.orientaciones || orientacionesPosibles,
          llenarEspacios: opts.llenarEspacios !== undefined ? opts.llenarEspacios : true,
          intentos: opts.intentos || 3,
          superponer: opts.superponer !== undefined ? opts.superponer : true,
        };

        // Agregamos las palabras al tablero.
        // since puzzles are random, attempt to create a valid one up to
        // maxAttempts and then increase the puzzle size and try again
        while (!tablero) {
          while (!tablero && intentos++ < opcionesAUsar.intentos) {
            tablero = rellenarSopa(listaPalabras, opcionesAUsar);
          }

          if (!tablero) {
            opcionesAUsar.alto++;
            opcionesAUsar.ancho++;
            intentos = 0;
          }
        }

        // fill in empty spaces with random letters
        if (opcionesAUsar.llenarEspacios) {
          this.llenarEspacios(tablero, opcionesAUsar);
        }

        return tablero;
      },

      /**
       * Llena los espacios en blanco con letras al azar
       *
       * @param tablero: El estado actual de la sopa de letras
       */
      llenarEspacios: function (tablero) {
        for (let i = 0, alto = tablero.length; i < alto; i++) {
          const row = tablero[i];
          for (let j = 0, ancho = row.length; j < ancho; j++) {
            if (!tablero[i][j]) {
              var letraAleatoria = Math.floor(Math.random() * letras.length);
              tablero[i][j] = letras[letraAleatoria];
            }
          }
        }
      },

      /**
       * Retorna dos arrays de objetos, uno de ellos con la información de las palabras encontradas y el otro con el de las no encontradas. 
       * Cada objeto del array contiene la palabra en cuestión, la coordenada (x, y) de donde comienza  la palabra y la orientación.
       *
       * Returns
       *   x position of start of word
       *   y position of start of word
       *   orientacion of word
       *   word
       *   overlap (always equal to word.length)
       *
       * @param tablero: Estado actual de la sopa de letras
       * @param palabras: La lista de palabras a buscar
       */
      resolver: function (tablero, palabras) {
        const options = {
            alto: tablero.length,
            ancho: tablero[0].length,
            orientaciones: orientacionesPosibles,
            superponer: true,
          },
          encontradas = [],
          noEncontradas = [];

        for (let i = 0, len = palabras.length; i < len; i++) {
          const palabra = palabras[i];
          const ubicaciones = buscarUbicacionesPosibles(tablero, options, palabra);

          if (ubicaciones.length > 0 && ubicaciones[0].overlap === palabra.length) {
            ubicaciones[0].palabra = palabra;
            encontradas.push(ubicaciones[0]);
          } else {
            noEncontradas.push(palabra);
          }
        }

        return { encontradas, noEncontradas };
      },

      /**
       * Imprime el estado del tablero en el log de la consola.
       *
       * @param tablero: Estado actual de la sopa de letras.
       */
      imprimir: function (tablero) {
        let strTablero = "";
        for (let i = 0, alto = tablero.length; i < alto; i++) {
          const fila = tablero[i];
          for (let j = 0, ancho = fila.length; j < ancho; j++) {
            strTablero += `${fila[j] === "" ? " " : fila[j]} `;
          }
          strTablero += "\n";
        }

        console.log(strTablero);
        return strTablero;
      },
    };
  };

  window.SDL = SopaDeLetras();
}.call(this));



(function (document, $, SDL) {
  "use strict";

  /**
   * Juego en HTML creado usando sopa.js
   * 
   * Se selecciona haciendo clic y arrastrando.
   */

  /**
   * Initializes the WordFindGame object.
   *
   * @api private
   */
  const JuegoSopaDeLetras = () => {
    let palabrasPendientes;

    /**
     * Dibuja la sopa de letras insertando filas de botones en un elemento HTML.
     *
     * @param el: Elemento jQuery en el que se dibujará la sopa de letras
     * @param tablero: El tablero a dibujar.
     */
    const pintarTablero = (el, tablero) => {
      console.log("pintarTablero()");
      let htmlSopa = "";
      // for each row in the puzzle
      for (let i = 0, alto = tablero.length; i < alto; i++) {
        // append a div to represent a row in the puzzle
        const fila = tablero[i];
        htmlSopa += "<div>";
        // for each element in that row
        for (let j = 0, ancho = fila.length; j < ancho; j++) {
          // append our button with the appropriate class
          htmlSopa += `<button class="casilla" x="${j}" y="${i}">`;
          htmlSopa += fila[j] || "&nbsp;";
          htmlSopa += "</button>";
        }
        // close our div that represents a row
        htmlSopa += "</div>";
      }

      $(el).html(htmlSopa);
    };

    /**
     * Pinta las palabra en una lista no ordenada dentro del elemento especificado
     *
     * @param el: El elemento jQuery donde vamos a crear la lista
     * @param palabras: Las palabras a dibujar
     */
    const pintarPalabras = (el, palabras) => {
      let htmlPalabras = "<ul>";
      for (let i = 0, len = palabras.length; i < len; i++) {
          const palabra = palabras[i];
          htmlPalabras += `<li class="palabra ${palabra}">${palabra}`;
      }
      htmlPalabras += "</ul>";

      $(el).prepend(htmlPalabras);
    };

    /**
     * Eventos del juego.
     *
     * Los siguientes eventos gestionan los turnos, la selección de palabras, el marcar palabras como encontradas y el final del juego.
     *
     */

    // Estado del juego
    let casillaInicio;
    let casillasSeleccionadas = [];
    let orientacionActual;
    let palabraActual = "";

    /**
     * Este se dispara ante el evento mouse down. Inicializa el estado adel juego con la letra seleccionada.
     *
     */
    const iniciarTurno = function () {
      $(this).addClass("seleccionada");
      casillaInicio = this;
      casillasSeleccionadas.push(this);
      palabraActual = $(this).text();
    };

    /**
     * Este se dispara en el evento mouse over sobre una nueva casilla. Se asegura que la nueva casilla sea adyacente a la previa, y que
     * la nueva letra esté en el camino de una palabra de las que hay que encontrar.
     *
     */
    const seleccionar = (casillaSeleccionada) => {
      // Si el usuario aún no ha iniciado una selección (habiendo hecho clic en una casilla inicial), no hacemos nada
      if (!casillaInicio) {
        return;
      }

      // Si la nueva casilla es la misma anterior, tampoco hacemos nada
      let casillaAnterior = casillasSeleccionadas[casillasSeleccionadas.length - 1];
      if (casillaAnterior == casillaSeleccionada) {
        return;
      }

      // Verificamos si el usuario se devolvio a corregir las casillas seleccionadas para actualizar el estado acordemente.
      let corregirHasta;
      for (let i = 0, len = casillasSeleccionadas.length; i < len; i++) {
        if (casillasSeleccionadas[i] == casillaSeleccionada) {
          corregirHasta = i + 1;
          break;
        }
      }
      while (corregirHasta < casillasSeleccionadas.length) {
        $(casillasSeleccionadas[casillasSeleccionadas.length - 1]).removeClass("seleccionada");
        casillasSeleccionadas.splice(corregirHasta, 1);
        palabraActual = palabraActual.substr(0, palabraActual.length - 1);
      }

      // Miramos si esta seleccion se esta haciendo en una nueva orientacion con respecto a la seleccion inicial. Esto nos facilita
      // seleccionar palabras en diagonal
      const nuevaOrientacion = calcularOrientacion(
        $(casillaInicio).attr("x") - 0,
        $(casillaInicio).attr("y") - 0,
        $(casillaSeleccionada).attr("x") - 0,
        $(casillaSeleccionada).attr("y") - 0
      );

      if (nuevaOrientacion) {
        casillasSeleccionadas = [casillaInicio];
        palabraActual = $(casillaInicio).text();
        if (casillaAnterior !== casillaInicio) {
          $(casillaAnterior).removeClass("seleccionada");
          casillaAnterior = casillaInicio;
        }
        orientacionActual = nuevaOrientacion;
      }

      // Miramos si el movimiento conserva la misma orientacion del movimiento anterior
      const orientacion = calcularOrientacion(
        $(casillaAnterior).attr("x") - 0,
        $(casillaAnterior).attr("y") - 0,
        $(casillaSeleccionada).attr("x") - 0,
        $(casillaSeleccionada).attr("y") - 0
      );

      // Si la nueva casilla seleccionada no es una orientacion valida, simplemente la ignoramos. Esto hace que la seleccion diagonal sea
      // menos frustrante
      if (!orientacion) {
        return;
      }

      // Por ultimo, si no habia una orientacion previa, o si este moviento si conserva la misma orientacion del movimiento anterior,
      // entonces se acepta el movimiento
      if (!orientacionActual || orientacionActual === orientacion) {
        orientacionActual = orientacion;
        jugarTurno(casillaSeleccionada);
      }
    };

    const touchMove = (e) => {
      const xPos = e.originalEvent.touches[0].pageX;
      const yPos = e.originalEvent.touches[0].pageY;
      const targetElement = document.elementFromPoint(xPos, yPos);
      seleccionar(targetElement);
    };

    const moverMouse = function () {
      seleccionar(this);
    };

    /**
     * Actualiza el estado del juego cuando la seleccion previa fue válida.
     *
     * @param {el} casilla: Elemento jQuery seleccionado
     */
    var jugarTurno = (casilla) => {
      // Asegurarnos de que estemos formando una palabra válida
      for (let i = 0, len = palabrasPendientes.length; i < len; i++) {
        //if (palabrasPendientes[i].indexOf(palabraActual + $(casilla).text()) === 0) 
        {
          $(casilla).addClass("seleccionada");
          casillasSeleccionadas.push(casilla);
          palabraActual += $(casilla).text();
          break;
        }

      }
    };

    /**
     * Este se dispara en el evento mouse up on a square. Verifica si se seleccionó una palabra válida y actualiza las clases CSS de las
     * letras y de la palabra en caso positivo. Luego reestablece el estado del juego para iniciar con una nueva palabra.
     * resets the game state to start a new word.
     *
     */
    const finalizarTurno = () => {
      // Miramos si formamos una palabra válida
      for (let i = 0, len = palabrasPendientes.length; i < len; i++) {
        if (palabrasPendientes[i] === palabraActual) {
          $(".seleccionada").addClass("encontrada").addClass("_" + palabraActual);
          palabrasPendientes.splice(i, 1);
          $("." + palabraActual).addClass("palabraEncontrada");
        }

        if (palabrasPendientes.length === 0) {
          $(".casilla").addClass("completada");
        }
      }

      // Reestablecer el turno
      $(".seleccionada").removeClass("seleccionada");
      casillaInicio = null;
      casillasSeleccionadas = [];
      palabraActual = "";
      orientacionActual = null;
    };

    /**
     * Dados dos puntos, nos aseguramos que sean adyacentes y determinamos cuál es la orientación del segundo punto respecto al primero.
     *
     * @param x1: La coordenada x del primer punto
     * @param y1: La coordenada y del primer punto
     * @param x2: La coordenada x del segundo punto
     * @param y2: La coordenada y del segundo punto
     */
    var calcularOrientacion = (x1, y1, x2, y2) => {
      for (const orientacion in SDL.orientaciones) {
        const fnSiguiente = SDL.orientaciones[orientacion];
        const siguientePosicion = fnSiguiente(x1, y1, 1);

        if (siguientePosicion.x === x2 && siguientePosicion.y === y2) {
          return orientacion;
        }
      }

      return null;
    };

    return {
      /**
       * Crea un nuevo juego de sopa de letras, dibuja el tablero y la lista de palabras
       *
       * Retorna el tablero creado.
       *
       * @param palabras: Las palabras a agregar al tablero
       * @param elementoSopaDeLetras: Selector to use when inserting the puzzle
       * @param elementoListaPalabras: Selector to use when inserting the word list
       * @param options: WordFind options to use when creating the puzzle
       */
      crear: function (palabras, elementoSopaDeLetras, elementoListaPalabras, options) {
        palabrasPendientes = palabras.slice(0).sort();

        const tablero = SDL.nuevoTablero(palabras, options);

        console.log("tablero = ", tablero);

        // Dibujamos el tablero y las palabras
        pintarTablero(elementoSopaDeLetras, tablero);
        pintarPalabras(elementoListaPalabras, palabrasPendientes);

        // Enlazamos los eventos a los  botones de las casillas
        $(".casilla").mousedown(iniciarTurno);
        $(".casilla").mouseenter(moverMouse);
        $(".casilla").mouseup(finalizarTurno);
        $(".casilla").on("touchstart", iniciarTurno);
        $(".casilla").on("touchmove", touchMove);
        $(".casilla").on("touchend", finalizarTurno);

        return tablero;
      },

      /**
       * Resuelve la sopa de letras
       *
       * @param tablero: La sopa de letras a resolver
       * @param palabras: Las palabras a encontrar
       */
      solucionar: function (tablero, palabras) {
        const solucion = SDL.resolver(tablero, palabras).found;

        for (let i = 0, len = solucion.length; i < len; i++) {
          const { palabra, orientacion, x, y } = solucion[i];
          const buscarSiguiente = SDL.orientaciones[orientacion];

          if (!$("." + word).hasClass("palabraEncontrada")) {
            for (let j = 0, size = word.length; j < size; j++) {
              const siguienteCasilla = buscarSiguiente(x, y, j);
              $(`[x="${siguienteCasilla.x}"][y="${siguienteCasilla.y}"]`).addClass(
                "solved"
              );
            }

            $("." + word).addClass("palabraEncontrada");
          }
        }

        $("#solve").addClass("juegoResuelto");
      },
    };
  };

  /**
   * Allow game to be used within the browser
   */
  window.JSDL = JuegoSopaDeLetras();
})(document, jQuery, SDL);

$(() => {
  const universoDePalabras = [
      "Gaitan",
      "Rodrigo",
      "Peru",
      "Christopher",
      "simonBolivar",
      "Nariño",
      "Policarpa",
      "Boyaca",
      "SantaMarta",
      "Carbonelly",
      "CamiloTorres",
      "JoseGonzalez",
      "CerroAzul",
      "Colon",
      "Otero",
      "Bucaramanga",
      "Salgar",
      "Cundinamarca",
      "Esmeraldas",
      "Cafe",
      "Platano",
      "Riohacha",
      "Cartagena",
      "Granada",
      "GranColombia",
      "Pichincha",
      "Maracaibo",
      "neogranadina",
      "Bogotazo",
      "RojasPinilla",
      "Armero",
      // "coreadelsur"
  ];

  function shuffle(array) {
    let i = array.length;
    let randomIndex;
  
    while (i != 0) {
      randomIndex = Math.floor(Math.random() * i);
      i--;
      [array[i], array[randomIndex]] = [
        array[randomIndex], array[i]];
    }
  
    return array;
  }
  // start a word find game
  const juego = JSDL.crear(
    shuffle(universoDePalabras).slice(0, 7),
    "#sopa",
    "#lista-palabras",
    {ancho: 10, alto: 10}
  );
  $("#sig").click(() => {
      if ($(".completada").length == 0) {
        alert("ERRORRRRRRRRRRRRRRRRRRRR!!!!!!")
        return false;
      }
      else {
        // Hacer lo que se supone que debe hacer el boton de siguiente
        document.location.href = "nivel4.html";
      }
    });
  // Para saber si la sopa de letras ya fue resuelta, basta con consultar si existen elementos con la class "completada"
  // Esto se puede hacer así: document.getElementsByClassName("completada").length > 0
  // O así con jQuery: $(".completada").length > 0
});

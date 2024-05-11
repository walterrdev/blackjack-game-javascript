/**
 * Patrón de diseño Módulo de JS
 * 
 * Función anónima autoinvocada
 */
const modBlackJack = (() => {
    // Restricciones: Evaluar código de forma estricta
    'use strict'
    
    /**
     * 2C = Two of Clubs
     * 2D = Two of Diamonds
     * 2H = Two of Hearts
     * 2S = Two of Spades
     */
    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
          espaciales = ['A', 'J', 'Q', 'K'];

    // Puntos
    let puntosJugadores = [];

    // Referencias del HTML
    const btnNuevo  = document.querySelector('#btnNuevo'),
          btnPedir  = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener');

    const cartasJugador = document.querySelectorAll('.cartas'),
          puntosHTML = document.querySelectorAll('small');
    
    // Inicializa el juego
    const iniciarJuego = ( numJugadores = 2 ) => {
        // Crear nueva bajara de cartas
        deck = crearDeck();

        // Resetear puntos jugadores
        puntosJugadores = [];

        // 
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);            
        }
        
        // Limpiar puntos jugadores en la vista
        puntosHTML.forEach( elem => elem.innerText = 0 );

        // Limpiar cartas vista HTML
        cartasJugador.forEach( carta => carta.innerHTML = '' );

        // Habilitar botón Pedir carta
        btnPedir.disabled = false;

        // Habilitar botón Detener
        btnDetener.disabled = false;
    }

    /**
     * Función para crear una nueva baraja
     */
    const crearDeck = () => {
        // Limpiar deck
        deck = [];

        // Crear baraja de cartas
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push( i + tipo );
            }        
        }

        // Agregar cartas especiales a la baraja
        for (let tipo of tipos) {
            for (let esp of espaciales) {
                deck.push( esp + tipo );
            }
        }

        // Barajar cartas usando un algoritmo
        // algoritmo de Fisher-Yates que es el que se usa típicamente para barajar en los juegos de azar (por lo que pude investigar).
        // const barajar=(arreglo)=>{     let i = arreglo.length;     while(--i>0){         let randIndex = Math.floor(Math.random() * (i + 1));         [arreglo[randIndex], arreglo[i]] = [arreglo[i], arreglo[randIndex]];     }     return arreglo; }

        // Barajar cartas usando una librería y retornar resultado
        return _.shuffle( deck );
    }

    /**
     * Función para tomar carta
     */
    const pedirCarta = () => {
        if ( deck.length === 0 ) {
            throw 'No hay carta en el deck.';
        }
        
        // Remover última carta de la baraja y devoler
        return deck.pop();
    }

    /**
     * Obtener valor carta
     */
    const valorCarta = ( carta ) => {
        // Obtener string ignorando la última letra
        const valor = carta.substring(0, carta.length - 1);

        return ( isNaN( valor ) ) ? 
                ( valor === 'A' ) ? 11 : 10
                : valor * 1;
        
        // let puntos = 0;
        // // Si el valor de la letra es un número...
        // if ( isNaN( valor ) ) {
        //     puntos = ( valor === 'A' ) ? 11 : 10;
        // } else {
        //     puntos = valor * 1;
        // }
    }
    
    /**
     * Acumula puntos del jugador actual
     * 
     * 
     * @param {*} turno | La última pocisión del arreglo (0) será de la máquina y los primeros de los jugadores.
     */
    const acumularPuntos = ( carta, turno ) => {
        // Obtener valor carta y calcular puntaje actual de la máquina
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );

        // Actualizar puntaje en el la vista HTML
        puntosHTML[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];
    }

    // Crear carta
    const crearCarta = ( carta, turno ) => {
        // Crear elemento img para la carta
        const imgCarta = document.createElement('img');
            
        // Actualizar ruta imagen
        imgCarta.src = `assets/cartas/${ carta }.png`;

        // Agregar clase CSS al elemento img para la carta
        imgCarta.classList.add('carta');

        // Agregar elemento (imagen carta) al DOM
        cartasJugador[turno].append( imgCarta );
    }

    /**
     * Determinar ganador
     */
    const determinarGanador = () => {
        // Destructurar el arreglo
        const [ puntosMinimos, puntosMaquina ] = puntosJugadores;

        // Validar ganador y mostrar mensaje
        setTimeout(() => {
            if ( puntosMaquina === puntosMinimos ) {
                alert('Empate');
            } else if ( puntosMinimos > 21 ) {
                alert('Máquina ganó');
            } else if ( puntosMaquina > 21 ) {
                alert('Ganaste.');
            } else {
                alert('Máquina ganó');
            }
        }, 10);
    }

    /**
     * Lógica turno máquina
     */
    const turnoMaquina = ( puntosMinimos ) => {
        let puntosMaquina = 0;

        do {
            // Obtener carta
            const carta = pedirCarta();

            // Calcular puntos máquina
            puntosMaquina = acumularPuntos( carta, puntosJugadores.length - 1 );

            // Crear carta
            crearCarta( carta, puntosJugadores.length - 1 );

        } while ( ( puntosMaquina < puntosMinimos ) && ( puntosMinimos <= 21 ) );    
        
        // Validar ganador
        determinarGanador();
    }

    /** 
     * Botón Pedir carta
     * 
     * Escucha el evento Click en el botón Pedir carta.
     * 
    */
    btnPedir.addEventListener('click', () => {
        // Obtener carta
        const carta = pedirCarta();

        // Calcular puntos Jugador
        const puntosJugador = acumularPuntos( carta, 0 );

        // Crear carta
        crearCarta( carta, 0);

        // Validar si el jugador perdió
        if ( puntosJugador > 21 ) {
            // Deshabilitar botón Pedir carta
            btnPedir.disabled = true;
            
            // Deshabilitar botón Detener
            btnDetener.disabled = true;
            
            // Ejecutar turno máquina
            turnoMaquina( puntosJugador );        
        } else if ( puntosJugador === 21 ) {
            // Mostrar mensaje
            alert('21, genial');

            // Deshabilitar botón Pedir carta
            btnPedir.disabled = true;

            // Deshabilitar botón Detener
            btnDetener.disabled = true;

            // Ejecutar turno máquina
            turnoMaquina( puntosJugador );
        }
    });

    /** 
     * Botón Detener
     * 
     * Escucha el evento Click en el botón Detener.
     * 
    */
    btnDetener.addEventListener('click', () => {   
        // Deshabilitar botón Pedir carta
        btnPedir.disabled = true;

        // Deshabilitar botón Detener
        btnDetener.disabled = true;

        // Ejecutar turno máquina
        turnoMaquina( puntosJugadores[0] );
    });

    /**
     * Nuevo juego
     * 
     * Resetea todo para empezar un nuevo juego.
     */
    btnNuevo.addEventListener('click', () => {
        iniciarJuego();    
    });

    // Lo que aquí retorne es lo único que va hacer público/visible fuera de este módulo lo cual solo se podrá acceder a él mediante el módulo.
    return {
        newGame: iniciarJuego
    };

})();


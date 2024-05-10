/**
 * 2C = Two of Clubs
 * 2D = Two of Diamonds
 * 2H = Two of Hearts
 * 2S = Two of Spades
 */
let deck = [];
const tipos = ['C', 'D', 'H', 'S'];
const espaciales = ['A', 'J', 'Q', 'K'];

// Puntos
let puntosJugador = 0,
    puntosMaquina = 0;

// Referencias del HTML
const btnNuevo = document.querySelector('#btnNuevo');
const btnPedir = document.querySelector('#btnPedir');
const btnDetener = document.querySelector('#btnDetener');
const cartasJugador = document.querySelector('#cartasJugador');
const cartasMaquina = document.querySelector('#cartasMaquina');
const puntosHTML = document.querySelectorAll('small');

/**
 * Función para crear una nueva baraja
 */
const crearDeck = () => {
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

    // Mostrar baraja de cartas
    // console.log( deck );

    // Barajar cartas usando un algoritmo
    // algoritmo de Fisher-Yates que es el que se usa típicamente para barajar en los juegos de azar (por lo que pude investigar).
    // const barajar=(arreglo)=>{     let i = arreglo.length;     while(--i>0){         let randIndex = Math.floor(Math.random() * (i + 1));         [arreglo[randIndex], arreglo[i]] = [arreglo[i], arreglo[randIndex]];     }     return arreglo; }

    // Barajar cartas usando una librería
    deck = _.shuffle( deck );
    // Mostrar baraja de cartas revueltas
    console.log( deck );

    return deck;
}

crearDeck();

/**
 * Función para tomar carta
 */
const pedirCarta = () => {
    if ( deck.length === 0 ) {
        throw 'No hay carta en el deck.';
    }

    // Remover última carta de la baraja
    const carta = deck.pop();

    // console.log( deck );
    console.log( carta );

    // Devoler la última carta removida de la baraja
    return carta;
}

/**
 * Obtener valor carta
 */
const valorCarta = ( carta ) => {
    // Obtener string ignorando la última letra
    const valor = carta.substring(0, carta.length - 1);

    console.log( `valorCarta: ${ valor }` );

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

    // console.log( puntos );
}

/**
 * Lógica turno máquina
 */
const turnoMaquina = ( puntosMinimos ) => {
    do {
        // Obtener carta
        const carta = pedirCarta();

        // Obtener valor carta y calcular puntaje actual de la máquina
        puntosMaquina = puntosMaquina + valorCarta( carta );
        console.log( `puntosMaquina: ${ puntosMaquina }` );


        // Actualizar puntaje en el la vista HTML
        puntosHTML[1].innerText = puntosMaquina;

        // Crear elemento img para la carta
        const imgCarta = document.createElement('img');
        
        // Actualizar ruta imagen
        imgCarta.src = `assets/cartas/${ carta }.png`;

        // Agregar clase CSS al elemento img para la carta
        imgCarta.classList.add('carta');

        // Agregar elemento (imagen carta) al DOM
        cartasMaquina.append( imgCarta );

        // Romper ciclo si la máquina ya ganó, es decir tiene 21 puntos
        if ( puntosJugador > 21 ) {
            break;
        }
    } while ( ( puntosMaquina < puntosMinimos ) && ( puntosMinimos <= 21 ) );

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
 * Botón Pedir carta
 * 
 * Escucha el evento Click en el botón Pedir carta.
 * 
*/
btnPedir.addEventListener('click', () => {
    // Obtener carta
    const carta = pedirCarta();

    // Obtener valor carta y calcular puntaje actual del jugador
    puntosJugador = puntosJugador + valorCarta( carta );
    console.log( `puntosJugador: ${ puntosJugador }` );


    // Actualizar puntaje en el la vista HTML
    puntosHTML[0].innerText = puntosJugador;

    // Crear elemento img para la carta
    const imgCarta = document.createElement('img');
    
    // Actualizar ruta imagen
    imgCarta.src = `assets/cartas/${ carta }.png`;

    // Agregar clase CSS al elemento img para la carta
    imgCarta.classList.add('carta');

    // Agregar elemento (imagen carta) al DOM
    cartasJugador.append( imgCarta );


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
    turnoMaquina( puntosJugador );
});

/**
 * Nuevo juego
 * 
 * Resetea todo para empezar un nuevo juego.
 */
btnNuevo.addEventListener('click', () => {
    // Limpiar baraja
    deck = [];

    // Crear nueva bajara de cartas
    deck = crearDeck();

    puntosJugador = 0;
    puntosMaquina = 0;

    puntosHTML[0].innerText = 0;
    puntosHTML[1].innerText = 0;

    cartasJugador.innerHTML = '';
    cartasMaquina.innerHTML = '';

    // Habilitar botón Pedir carta
    btnPedir.disabled = false;

    // Habilitar botón Detener
    btnDetener.disabled = false;
});

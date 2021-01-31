var juego = new Phaser.Game(400, 540, Phaser.CANVAS, 'bloque_juego');

window.PhaserGlobal = {
    disableWebAudio: true
};

//Agregando los estados del juego
juego.state.add('Juego', Juego);
juego.state.add('Terminado', Terminado);

//Inicializamos juego en el estado Juego
juego.state.start('Juego');
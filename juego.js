var fondo;

var nave;
var balas;
var velocity_bala = 200;
var tiempoEntreBalas = 400;
var tiempo = 0;

var malos;
var velocity_malo = 100;
var timer;
var timer_level;

var puntos;
var txtPuntos;
var nivel;
var txtNivel;

var vidas;
var txtVidas;

var teclaDerecha;
var teclaIzquierda;
var teclaArriba;
var teclaAbajo;

var sound_explosion;
var sound_disparo;

var second_level = 1000;
var Juego = {
	preload: function () {

		juego.load.image('nave', 'img/redfighter0005_v2.png');
		juego.load.image('laser', 'img/laser.png');
		juego.load.image('malo', 'img/Spaceship-Drakir7_v2.png');
		juego.load.image('bg', 'img/bg.png');

		juego.load.audio('explosion', 'sonido/explosion.mp3');
		juego.load.audio('disparo', 'sonido/laser.mp3');
	},

	create: function () {
		fondo = juego.add.tileSprite(0, 0, 400, 540, 'bg');

		juego.physics.startSystem(Phaser.Physics.ARCADE);

		nave = juego.add.sprite(juego.width / 2, 485, 'nave');
		nave.anchor.setTo(0.5);

		juego.physics.arcade.enable(nave, true);

		// Timer mesage
		timer_level = juego.time.create(false);

		// Sonido
		sound_explosion = juego.add.audio('explosion');
		sound_disparo = juego.add.audio('disparo');
		//juego.sound.setDecodedCallback([ sound_explosion, sound_disparo], start, this);

		// balas
		balas = juego.add.group();
		balas.enableBody = true;
		balas.setBodyType = Phaser.Physics.ARCADE;
		balas.createMultiple(50, 'laser');
		balas.setAll('anchor.x', 0.5);
		balas.setAll('anchor.y', 0.5);
		balas.setAll('checkWorldBounds', true);
		balas.setAll('outOfBoundsKill', true);

		// malos
		malos = juego.add.group();
		malos.enableBody = true;
		malos.setBodyType = Phaser.Physics.ARCADE;
		malos.createMultiple(30, 'malo');
		malos.setAll('anchor.x', 0.5);
		malos.setAll('anchor.y', 0.5);
		malos.setAll('checkWorldBounds', true);
		malos.setAll('outOfBoundsKill', true);

		timer = juego.time.events.loop(2000, this.crearEnemigo, this);

		// Puntos
		puntos = 0;
		juego.add.text(20, 20, "Puntos: ", { font: "14px Arial", fill: "#FFF" });
		txtPuntos = juego.add.text(80, 20, "0", { font: "14px Arial", fill: "#FFF" });

		// Nivel
		nivel = 1;
		juego.add.text(170, 20, "Nivel: ", { font: "14px Arial", fill: "#FFF" });
		txtNivel = juego.add.text(210, 20, "1", { font: "14px Arial", fill: "#FFF" });

		// Vida
		vidas = 3;
		juego.add.text(310, 20, "Vidas:", { font: "14px Arial", fill: "#FFF" });
		txtVidas = juego.add.text(360, 20, "3", { font: "14px Arial", fill: "#FFF" });

		// Movimiento
		teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		teclaArriba = juego.input.keyboard.addKey(Phaser.Keyboard.UP);
		teclaAbajo = juego.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	},
	update: function () {
		// Movimiento del fondo
		fondo.tilePosition.y += 1;

		// rota la nave hacia el cursor
		nave.rotation = juego.physics.arcade.angleToPointer(nave) + Math.PI / 2;

		if (juego.input.activePointer.isDown) {
			this.disparar();
		}


		// Contador de vidas
		malos.forEachAlive(function (m) {
			if (m.position.y > 520) {
				vidas -= 1;
				m.kill();
				txtVidas.text = vidas;
			}
		});

		// Colision
		juego.physics.arcade.overlap(balas, malos, this.colision, null, this);

		// Game Over
		if (vidas == 0) {
			//juego.state.start('Terminado');
			juego.paused = true;

			txtGameOver = juego.add.text(juego.width / 2 - 103.5, juego.height / 2 - 25, "Game Over", { font: "40px Arial", fill: "#FFF" });
		}

		// Movimiento
		if (teclaDerecha.isDown) {
			nave.position.x += 2;
		}
		if (teclaIzquierda.isDown) {
			nave.position.x -= 2;
		};
		if (teclaArriba.isDown) {
			nave.position.y -= 2;
		};
		if (teclaAbajo.isDown) {
			nave.position.y += 2;
		};

		// Pasar de nivel
		if (puntos == 1) {
			nivel += 1;
			txtNivel.text = nivel;
			velocity_malo += 25;
			velocity_bala += 25;
			if (nivel < 10) {
				tiempoEntreBalas -= 15;
			}
			puntos = 0;
			txtPuntos.text = puntos;
			vidas = 3;
			txtVidas.text = vidas;

			malos.forEachAlive(function (m) {
				m.kill();
			});
		}

		if (nivel == 10) {
			juego.paused = true;
			txtWin = juego.add.text(juego.width / 2 - 103.5, juego.height / 2 - 25, "Ganaste", { font: "40px Arial", fill: "#FFF" });
		}
	},

	// Disparar
	disparar: function () {
		if (juego.time.now > tiempo && balas.countDead() > 0) {
			tiempo = juego.time.now + tiempoEntreBalas;

			let bala = balas.getFirstDead();
			bala.anchor.setTo(0.5);
			bala.reset(nave.x, nave.y);
			bala.rotation = juego.physics.arcade.angleToPointer(bala) + Math.PI / 2;
			juego.physics.arcade.moveToPointer(bala, velocity_bala);

			sound_disparo.stop();
			sound_disparo.play();
		}
	},
	// Crear Enemigo
	crearEnemigo: function () {
		var enem = malos.getFirstDead();
		var num = Math.floor(Math.random() * 5 + 1);
		enem.reset(num * 38, 0);
		enem.anchor.setTo(0.5);
		enem.body.velocity.y = velocity_malo;
		enem.checkWorldBounds = true;
		enem.outBoundsKill = true;
	},
	// Colision
	colision: function (bala, enemigo) {
		bala.kill();
		enemigo.kill();

		puntos++;
		txtPuntos.text = puntos;

		sound_explosion.stop();
		sound_explosion.play();
	},
	sleep: function (milliseconds) {
		return new Promise(resolve => setTimeout(resolve, milliseconds));
	}
};

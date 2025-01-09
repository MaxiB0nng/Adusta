// Dette kaldes, når alle elementer på siden er klar
window.onload = function () {
	// Hent canvas-elementerne og deres kontekster
	var canvas_player = document.getElementById('player');
	var context_player = canvas_player.getContext('2d');
	var canvas_arc = document.getElementById('arc');
	var context_arc = canvas_arc.getContext('2d');

	// Initialiser forskellige variabler
	var kanon = new Image();
	var skud = false; // Holder styr på om et skud er aktivt
	var skudX = tankX; // Starter X-position for skud
	var skudY = tankY; // Starter Y-position for skud
	var radius = 10; // Radius for skuddet
	var velocityX = 0; // Vandret hastighed
	var velocityY = 0; // Lodret hastighed
	var gravity = 20; // Gravitationsstyrke
	var tankX = 50; // Tankens start-position (X)
	var tankY = 600; // Tankens faste start-position (Y)
	var tankXmiddle = tankX + 50; // Midten af tanken (X)
	var tankYmiddle = tankY + 35; // Midten af tanken (Y)
	var movementSpeed = 5; // Hvor hurtigt tanken kan flytte sig
	var power = 75; // Hvor kraftig kanonen er
	var vinkel = 45; // Vinkel på skud (i grader)
	let upPressed = false;
	let downPressed = false;
	let rightPressed = false;
	let leftPressed = false;
	let ePressed = false;

	kanon.src = "./img/kanon.png"; // Indlæs kanonbilledet
	drawTrajectory();


	// Lyt til tastetryk for tankens bevægelse
	document.addEventListener('keydown', function (event) {
		if (event.key === 'a' || event.key === 'A') {
			leftPressed = true;
		} else if (event.key === 'd' || event.key === 'D') {
			rightPressed = true;
		} else if (event.key === 'w' || event.key === 'W') {
			upPressed = true;
		} else if (event.key === 's' || event.key === 'S') {
			downPressed = true;
		} else if (event.key === 'e' || event.key === 'E') {
			shoot()
		}
	});

	// Lyt til taster, der slippes
	document.addEventListener('keyup', function (event) {
		if (event.key === 'a' || event.key === 'A') {
			leftPressed = false;
		} else if (event.key === 'd' || event.key === 'D') {
			rightPressed = false;
		} else if (event.key === 'w' || event.key === 'W') {
			upPressed = false;
		} else if (event.key === 's' || event.key === 'S') {
			downPressed = false;
		} else if (event.key === 'e' || event.key === 'E') {
			ePressed = false;
		}
	});

	// Opdater vinkel, når "W" eller "S" tasten holdes nede
	function updateVinkel() {
		if (upPressed) {
			vinkel += 0.5;
			if (vinkel > 90) vinkel = 90; // Begræns vinkel til max 90 grader
			drawTrajectory();
		}
		if (downPressed) {
			vinkel -= 0.5;
			if (vinkel < 0) vinkel = 0; // Begræns vinkel til min 0 grader
			drawTrajectory();
		}
	}
	function shoot() {
		if (!skud) {
			// Beregn skudhastigheden og vinklen
			var speed = power / 7; // Brug "power"-variablen til at definere skudhastigheden
			var angle = vinkel * (Math.PI / 180); // Brug "vinkel"-variablen (omregnet til radianer)
			velocityX = speed * Math.cos(angle); // Vandret hastighed
			velocityY = -speed * Math.sin(angle); // Lodret hastighed
			skud = true;

			// Opdater position til midten af tanken
			tankXmiddle = tankX + 50;
			tankYmiddle = tankY + 35;
			skudX = tankXmiddle;
			skudY = tankYmiddle;

			animate(); // Start animationen
			drawTrajectory(); // Beregn og tegn fuld bane
		}
	}

	// Start funktionen til at tracke tankens bevægelse
	updateTankPosition();

	// Funktion til at opdatere tankens bevægelse
	function updateTankPosition() {
		if (leftPressed) {
			tankX -= movementSpeed;
			drawTrajectory(); // Opdatér banen, mens tanken bevæger sig
			if (tankX < 0) tankX = 0; // Undgå, at tanken forlader venstre grænse
		}
		if (rightPressed) {
			tankX += movementSpeed;
			drawTrajectory(); // Opdatér banen, mens tanken bevæger sig
			if (tankX + kanon.width > canvas_player.width) {
				tankX = canvas_player.width - kanon.width; // Undgå, at tanken forlader højre grænse
			}
		}



		// Ryd canvas og tegn tanken igen
		context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);
		context_player.drawImage(kanon, tankX, tankY);

		// Tjek og opdater vinklen
		updateVinkel();

		// Fortsæt med at opdatere med næste frame
		requestAnimationFrame(updateTankPosition);
	}

	// Funktion til at tegne banen for skuddet
	function drawTrajectory() {
		tankXmiddle = tankX + 50;
		tankYmiddle = tankY + 35;
		if (!skud) {
			skudX = tankXmiddle;
			skudY = tankYmiddle;
			context_arc.clearRect(0, 0, canvas_arc.width, canvas_arc.height);
			var speed = power / 7; // Brug "power"-variablen til at definere fart
			var angle = vinkel * (Math.PI / 180); // Brug "vinkel"-variablen til bane

			var initialVelocityX = speed * Math.cos(angle);
			var initialVelocityY = -speed * Math.sin(angle);

			var trajectoryX = skudX;
			var trajectoryY = skudY;

			context_arc.strokeStyle = "red";
			context_arc.beginPath();
			context_arc.moveTo(trajectoryX, trajectoryY);

			for (let t = 0; t < 200; t += 1) {
				trajectoryX = skudX + initialVelocityX * t;
				trajectoryY = skudY + initialVelocityY * t + 0.5 * gravity * Math.pow(t / 10, 2);

				if (trajectoryX > canvas_arc.width || trajectoryY > canvas_arc.height) break;

				context_arc.lineTo(trajectoryX, trajectoryY);
			}

			context_arc.stroke();
			requestAnimationFrame(drawTrajectory);
		}
	}

	// Funktion til at animere skuddet
	function animate() {
		if (skud) {
			skudX += velocityX; // Opdater vandret position
			velocityY += gravity / 100; // Opdater lodret hastighed grundet tyngdekraft
			skudY += velocityY; // Opdater lodret position

			// Ryd player-canvas og tegn igen
			context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);

			// Fjern rød bane, hvor skuddet er
			context_arc.clearRect(skudX - radius, skudY - radius, radius * 2, radius * 2);

			// Tegn skuddet
			context_player.beginPath();
			context_player.arc(skudX, skudY, radius, 0, 2 * Math.PI, false);
			context_player.fillStyle = 'black';
			context_player.fill();

			// Tjek, om skuddet er udenfor banen
			if (skudX > canvas_player.width || skudY > canvas_player.height) {
				skudX = tankX + 25; // Nulstil skuddet til kanonens position
				skudY = tankY;
				velocityX = 0;
				velocityY = 0;
				skud = false; // Markér skud som reset
			} else {
				requestAnimationFrame(animate); // Fortsæt animationen
			}

			// Tegn kanonen igen ved dens nuværende position
			context_player.drawImage(kanon, tankX, tankY);
			drawTrajectory(); // Tegn banen igen
		}
	}

	// Start med at tegne kanonen på den angivne position
	context_player.drawImage(kanon, tankX, tankY);
};
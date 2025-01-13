// Dette kaldes, når alle elementer på siden er klar
window.onload = function () {
	// Hent canvas-elementerne og deres kontekster
	var canvas_player = document.getElementById('player');
	var context_player = canvas_player.getContext('2d');
	var canvas_arc = document.getElementById('arc');
	var context_arc = canvas_arc.getContext('2d');
	var canvas_ground = document.getElementById('ground');
	var context_ground = canvas_ground.getContext('2d');

	// Initialiser forskellige variabler
	var kanon = new Image();
	var radius = 10; // Radius for skuddet
	var velocityX = 0; // Vandret hastighed
	var velocityY = 0; // Lodret hastighed
	var gravity = 20; // Gravitationsstyrke
	var tankX = 50; // Tankens start-position (X)
	var tankY = 600; // Tankens faste start-position (Y)
	var tankXmiddle = tankX + 50; // Midten af tanken (X)
	var tankYmiddle = tankY + 35; // Midten af tanken (Y)
	var movementSpeed = 5; // Hvor hurtigt tanken kan flytte sig
	var skud = false; // Holder styr på om et skud er aktivt
	var skud_cooldown = 250 //cooldown til skudet
	var skudX = tankX; // Starter X-position for skud
	var skudY = tankY; // Starter Y-position for skud
	var power = 85; // Hvor kraftig kanonen er
	var vinkel = 45; // Vinkel på skud (i grader)
	let upPressed = false;
	let downPressed = false;
	let rightPressed = false;
	let leftPressed = false;
	let ePressed = false;
	var ground_level = 680;
	var start_spot = 220;
	var start_spot_random = Math.random() * (100 - 20) + 20;
	var start = Math.min(start_spot + start_spot_random, canvas_ground.width);
	var random_length = Math.random() * (250 - 120) + 40;
	var random_length2 = Math.random() * (250 - 120) + 40;
	var number_pillars = Math.floor(Math.random() * (4 - 1)) + 1; // Generates 1 or 2 or 3.
	var pillars = [
		{height: Math.random() * (250 - 50) + 50, width: Math.random() * (80 - 20) + 40},
		{height: Math.random() * (250 - 50) + 50, width: Math.random() * (80 - 20) + 40},
		{height: Math.random() * (250 - 50) + 50, width: Math.random() * (80 - 20) + 40},
	];
	var firstpilar = start + pillars[0].width;

	kanon.src = "img/kanon.png";
	drawTrajectory()

	function make_ground() {
		context_ground.clearRect(0, 0, canvas_ground.width, canvas_ground.height);
		context_ground.beginPath();
		context_ground.moveTo(0, ground_level);
		context_ground.lineTo(start, ground_level);
		context_ground.lineTo(start, ground_level - pillars[0].height);
		context_ground.lineTo(firstpilar, ground_level - pillars[0].height);
		context_ground.lineTo(firstpilar, ground_level);
		context_ground.lineTo(firstpilar + random_length, ground_level);

		// Generate hitboxes array
		var hitboxes = [
			{x: start, y: ground_level - pillars[0].height, width: pillars[0].width, height: pillars[0].height},
		];

		if (number_pillars > 1) {
			context_ground.lineTo(firstpilar + random_length, ground_level - pillars[1].height);
			context_ground.lineTo(firstpilar + random_length + pillars[1].width, ground_level - pillars[1].height);
			context_ground.lineTo(firstpilar + random_length + pillars[1].width, ground_level);

			hitboxes.push({
				x: firstpilar + random_length,
				y: ground_level - pillars[1].height,
				width: pillars[1].width,
				height: pillars[1].height,
			});
		}

		if (number_pillars > 2) {
			context_ground.lineTo(firstpilar + random_length + pillars[1].width + random_length2, ground_level);
			context_ground.lineTo(
				firstpilar + random_length + pillars[1].width + random_length2,
				ground_level - pillars[2].height
			);
			context_ground.lineTo(
				firstpilar + random_length + pillars[1].width + random_length2 + pillars[2].width,
				ground_level - pillars[2].height
			);
			context_ground.lineTo(
				firstpilar + random_length + pillars[1].width + random_length2 + pillars[2].width,
				ground_level
			);

			hitboxes.push({
				x: firstpilar + random_length + pillars[1].width + random_length2,
				y: ground_level - pillars[2].height,
				width: pillars[2].width,
				height: pillars[2].height,
			});
		}
		context_ground.lineTo(canvas_ground.width, ground_level);

		// Draw hitboxes for testing
		context_ground.lineWidth = 5;
		context_ground.strokeStyle = "black";
		context_ground.stroke();

		hitboxes.forEach((box) => {
			context_ground.beginPath();
			context_ground.rect(box.x, box.y, box.width, box.height);
			context_ground.strokeStyle = "blue";
			context_ground.stroke();
		});

		// Prevent tank and bullet from entering hitboxes
		hitboxes.forEach((box) => {
			// Handle tank collision
			if (
				tankX + kanon.width > box.x &&
				tankX < box.x + box.width &&
				tankY + kanon.height > box.y &&
				tankY < box.y + box.height
			) {
				if (tankX + kanon.width / 2 < box.x + box.width / 2) {
					tankX = box.x - kanon.width; // Push tank to the left of the hitbox
				} else {
					tankX = box.x + box.width; // Push tank to the right of the hitbox
				}
			}

			// Handle bullet collision
			if (
				skud &&
				skudX + radius > box.x &&
				skudX - radius < box.x + box.width &&
				skudY + radius > box.y &&
				skudY - radius < box.y + box.height
			) {

				skud = false; // Mark bullet as inactive
				skudX = tankX + 25; // Reset bullet position
				skudY = tankY;
				velocityX = 0;
				velocityY = 0;
				drawTrajectory()


					// Genoptegn opdateret tilstand af banen
					make_ground();

			}
		});
	}





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
			if (vinkel > 88) vinkel = 88; // Begræns vinkel til max 90 grader
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
			if (skud_cooldown < 2) {
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
				skud_cooldown = 0;
				skud_cooldown += 250;

				animate(); // Start animationen
				drawTrajectory(); // Beregn og tegn fuld bane
			}
		}

	}

	//minser cooldown så den går ned af
	setInterval(() => {
		if (skud_cooldown > 0) {
			skud_cooldown = Math.max(0, skud_cooldown - 1); // Ensure cooldown doesn't go below 0
			console.log(skud_cooldown);
		}
	}, 10);


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

				context_arc.lineTo(trajectoryX, trajectoryY); // Ensure trajectory lines are drawn

				if (trajectoryX > canvas_arc.width || trajectoryY > ground_level) break;
			}

			context_arc.stroke();

		} else {
			context_arc.clearRect(0, 0, canvas_arc.width, canvas_arc.height); // Clear arc canvas if skud is active
		}
		make_ground();
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
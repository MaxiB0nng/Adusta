window.onload = function () {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var kanon = new Image();
	var skud = false;
	var x = 100;
	var y = 620;
	var radius = 10;
	var velocityX = 0; // Horisontal hastighed
	var velocityY = 0; // Vertikal hastighed
	var gravity = 20; // Gravitationsstyrke
	kanon.src = "./img/kanon.png";

	// Hastighedsslider
	var slider = document.getElementById("hastighed");
	var output = document.getElementById("hast");
	output.innerHTML = slider.value; // Viser den aktuelle hastighed
	slider.oninput = function () {
		output.innerHTML = this.value; // Opdaterer hastighed på siden
		drawTrajectory()
	};

	// Vinkelslider
	var vinkel = document.getElementById("vinkel");
	var vinkeloutput = document.getElementById("vink");
	vinkeloutput.innerHTML = vinkel.value; // Viser den aktuelle vinkel
	vinkel.oninput = function () {
		vinkeloutput.innerHTML = this.value; // Opdaterer vinkel på siden
		drawTrajectory()
	};

	// Skud
	var skudKnap = document.getElementById("skudKnap"); // Knappen til at skyde
	skudKnap.addEventListener("click", function () {
		if (!skud) { // Kun skyd, hvis der ikke allerede er et aktivt skud
			var speed = parseFloat(slider.value) / 7; // Beregn hastighed ud fra slideren
			var angle = parseFloat(vinkel.value) * (Math.PI / 180); // Konverter vinkel til radianer
			velocityX = speed * Math.cos(angle); // Initial horisontal hastighed
			velocityY = -speed * Math.sin(angle); // Initial vertikal hastighed (negativ for opadgående)
			skud = true;
			animate();
		}
	});


	// Viser kanonen, når siden loades
	kanon.onload = function () {
		context.drawImage(kanon, 10, 600); // Tegn kanonen på sin startposition
	};


	function drawTrajectory() {
		// Clear the canvas for a fresh start
		context.clearRect(0, 0, canvas.width, canvas.height);

		// Draw the cannon
		context.drawImage(kanon, 10, 600);

		// Get speed and angle
		var speed = parseFloat(slider.value) / 7; // Adjust speed from slider
		var angle = parseFloat(vinkel.value) * (Math.PI / 180); // Convert to radians

		// Initial velocity components
		var initialVelocityX = speed * Math.cos(angle);
		var initialVelocityY = -speed * Math.sin(angle);

		// Start position
		var trajectoryX = x; // Starting x position
		var trajectoryY = y; // Starting y position

		// Draw the arc as a series of small circles or dots
		context.strokeStyle = "green"; // Trajectory color
		context.beginPath();
		context.moveTo(trajectoryX, trajectoryY);

		for (let t = 0; t < 200; t += 1) { // Simulate for 200 frames or until the trajectory ends
			// Update trajectory positions based on time `t`
			trajectoryX = x + initialVelocityX * t;
			trajectoryY = y + initialVelocityY * t + 0.5 * gravity * Math.pow(t / 10, 2); // Gravity in action

			// Stop drawing if it goes off-screen
			if (trajectoryX > canvas.width || trajectoryY > canvas.height) break;

			// Draw a line to the next point
			context.lineTo(trajectoryX, trajectoryY);
		}

		context.stroke(); // Apply the trajectory drawing
	}



	function animate() {
		if (skud) {

			// Opdater kuglens position
			x += velocityX; // Horisontal bevægelse
			velocityY += gravity / 100; // Tyngdekraft tilføjes til vertikal hastighed
			y += velocityY; // Vertikal bevægelse

			// Ryd canvas
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Tegn kuglen
			context.beginPath();
			context.arc(x, y, radius, 0, 2 * Math.PI, false);
			context.fillStyle = 'black';
			context.fill();

			// Stop animationen, hvis kuglen forlader canvas
			if (x > canvas.width || y > canvas.height) {
				x = 100; // Reset kuglens startposition
				y = 620;
				velocityX = 0;
				velocityY = 0;
				skud = false; // Stop skuddet
			} else {
				requestAnimationFrame(animate); // Fortsæt animationen
			}
		}


		// Tegn kanonen igen
		context.drawImage(kanon, 10, 600);
	}

	// Initial visning af kanonen
	context.drawImage(kanon, 10, 600); // Tegn kanonen på dens startposition
};

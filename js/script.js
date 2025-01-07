window.onload = function () {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var kanon = new Image();
	var skud = false;
	var x = 100;
	var y = 720;
	var radius = 10;
	kanon.src = "./img/kanon.png";

	// Hastighedsslider
	var slider = document.getElementById("hastighed");
	var output = document.getElementById("hast");
	output.innerHTML = slider.value;
	slider.oninput = function () {
		output.innerHTML = this.value; // Viser hastigheden på siden
	};

	// Vinkelslider
	var vinkel = document.getElementById("vinkel");
	var vinkeloutput = document.getElementById("vink");
	vinkeloutput.innerHTML = vinkel.value;
	vinkel.oninput = function () {
		vinkeloutput.innerHTML = this.value; // Viser vinklen på siden
	};

	// Skud
	var skudKnap = document.getElementById("skudKnap"); // Knap til skud
	skudKnap.addEventListener("click", function () {
		skud = true;
		animate();
	});

	// Viser kanon når siden loades
	kanon.onload = function () {
		context.drawImage(kanon, 10, 700);
	};

	function animate() {
		// Kuglens koordinater
		x = x + 2; // Juster efter hastighed
		y = y - 1; // Juster efter vinkel
		if (skud == true) {
			context.clearRect(0, 0, 1024, 800);
			// Kuglen tegnes
			context.beginPath();
			context.arc(x, y, radius, 0, 2 * Math.PI, false);
			context.fillStyle = 'black';
			context.fill();

			if (x > 1040 || y < 0) { // Stop når kuglen er ude af skærmen
				x = 100;
				y = 720;
				skud = false;
			} else {
				requestAnimationFrame(animate); // Brug requestAnimationFrame for jævn animation
			}
		}
		context.drawImage(kanon, 10, 700);
	}

	// Initial visning af kanonen
	context.drawImage(kanon, 10, 700);
};

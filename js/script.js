window.onload=function(){
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var kanon = new Image();
	var skud = false;
	x = 100;
	y = 720;
	var radius = 10;
	kanon.src="./img/kanon.png";
	var skudKnap = $("#skudKnap");
	
	// Hastighedsslider
	var slider = document.getElementById("hastighed");
	var output = document.getElementById("hast");
	output.innerHTML = slider.value;
	slider.oninput = function() {
		output.innerHTML = this.value;// Viser hastigheden på siden
	}
	
	//Vinkelslider
	var vinkel = document.getElementById("vinkel");
	var vinkeloutput = document.getElementById("vink");
	vinkeloutput.innerHTML = vinkel.value;
	vinkel.oninput = function() {
		vinkeloutput.innerHTML = this.value; // Viser vinklen på siden
	}
	
	//Skud
	skudKnap.click(function(){
		skud = true;
		animate();
	});
	
	// Viser kanon når siden loades
	kanon.onload = function(){
		context.drawImage(kanon,10,700);
	}
	
	function animate(){
		// Kuglens koordinater
		x = x + 2;
		y = y - 1
		if (skud == true){
			context.clearRect(0,0,1024,800);
			// Kuglen tegnes
			context.beginPath();
			context.arc(x, y, radius, 0, 2 * Math.PI, false);
			context.fillStyle = 'black';
			context.fill();	
			setTimeout(animate,10);
			if (x > 1040){
				x = 100;
				y = 720;
				skud = false;
			};
		};
		context.drawImage(kanon,10,700);
	};
animate();
};


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
    var _1kanon = new Image();
    var radius = 10; // Radius for skuddet
    var velocityX = 0; // Vandret hastighed
    var velocityY = 0; // Lodret hastighed
    var gravity = 20; // Gravitationsstyrke
    var _1tankX = 50; // Tankens start-position (X)
    var _1tankY = 600; // Tankens faste start-position (Y)
    var _1tankXmiddle = _1tankX + 50; // Midten af tanken (X)
    var _1tankYmiddle = _1tankY + 35; // Midten af tanken (Y)
    var _1movementSpeed = 5; // Hvor hurtigt tanken kan flytte sig
    var _1skud = false; // Holder styr på om et skud er aktivt
    var _1charge_cooldown = 10 //såre for at der en buffer mellem at charge og at skyde
    var _1skud_cooldown = 100; // Cooldown til skuddet
    var _1skudX = _1tankX; // Starter X-position for skud
    var _1skudY = _1tankY; // Starter Y-position for skud
    var _1power = 80; // Hvor kraftig kanonen er
    var _1charge_power = 0 //hvor meget kraft exstra
    var _1vinkel = 45; // Vinkel på skud (i grader)
    var damageHeight = 60;
    let upPressed = false;
    let downPressed = false;
    let rightPressed = false;
    let leftPressed = false;
    let ePressed = false;
    var ground_level = 680;
    var start_spot = 300;
    var start_spot_random = Math.random() * (100 - 20) + 60;
    var start = Math.min(start_spot + start_spot_random, canvas_ground.width);
    var random_length = Math.random() * (550 - 320) + 150;
    var random_length2 = Math.random() * (550 - 320) + 150;
    var number_pillars = Math.floor(Math.random() * (4 - 1)) + 2; // Generates 1 or 2 or 3.
    var pillars = [
        {height: Math.random() * (250 - 50) + 50, width: Math.random() * (80 - 20) + 40},
        {height: Math.random() * (250 - 50) + 50, width: Math.random() * (80 - 20) + 40},
        {height: Math.random() * (250 - 50) + 50, width: Math.random() * (80 - 20) + 40},
    ];
    var firstpilar = start + pillars[0].width;

    _1kanon.src = "img/kanon.png";
    drawTrajectory();

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
                _1tankX + _1kanon.width > box.x &&
                _1tankX < box.x + box.width &&
                _1tankY + _1kanon.height > box.y &&
                _1tankY < box.y + box.height
            ) {
                if (_1tankX + _1kanon.width / 2 < box.x + box.width / 2) {
                    _1tankX = box.x - _1kanon.width; // Push tank to the left of the hitbox
                } else {
                    _1tankX = box.x + box.width; // Push tank to the right of the hitbox
                }
            }

            // Handle bullet collision
            if (
                _1skud &&
                _1skudX + radius > box.x &&
                _1skudX - radius < box.x + box.width &&
                _1skudY + radius > box.y &&
                _1skudY - radius < box.y + box.height
            ) {
                _1skud = false; // Mark bullet as inactive
                _1skudX = _1tankX + 25; // Reset bullet position
                _1skudY = _1tankY;
                velocityX = 0;
                velocityY = 0;
                drawTrajectory();

                // Find the pillar that was hit, based on the hitbox
                const pillarIndex = hitboxes.indexOf(box);

                if (pillarIndex !== -1 && pillars[pillarIndex]) {

                    console.log(_1charge_power);
                    console.log(damageHeight);


                    // Reduce the height of the impacted pillar
                    pillars[pillarIndex].height -= damageHeight;

                    // Adjust the bounding box
                    if (box) {
                        box.height -= damageHeight;
                        box.y += damageHeight;

                    }



                    // Redraw the landscape to reflect updated changes
                    make_ground();
                }
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
            shoot();
        } else if (event.key === 'q' || event.key === 'Q') {
            charge();
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
            _1vinkel += 0.5;
            if (_1vinkel > 88) _1vinkel = 88; // Begræns vinkel til max 90 grader
            drawTrajectory();
        }
        if (downPressed) {
            _1vinkel -= 0.5;
            if (_1vinkel < 0) _1vinkel = 0; // Begræns vinkel til min 0 grader
            drawTrajectory();
        }
    }

    function shoot() {
        if (!_1skud) {
            if (_1skud_cooldown < 2) {
                // Beregn skudhastigheden og vinklen
                var speed = (_1power / 7) + (_1charge_power /100); // Brug "power"-variablen til at definere fart
                var angle = _1vinkel * (Math.PI / 180); // Brug "vinkel"-variablen (omregnet til radianer)
                velocityX = speed * Math.cos(angle); // Vandret hastighed
                velocityY = -speed * Math.sin(angle); // Lodret hastighed
                _1skud = true;

                if (_1charge_power >= 50) {
                    damageHeight = 80;
                } else {
                    damageHeight = 50;
                }
                // Opdater position til midten af tanken
                _1tankXmiddle = _1tankX + 50;
                _1tankYmiddle = _1tankY + 35;
                _1skudX = _1tankXmiddle;
                _1skudY = _1tankYmiddle;
                _1skud_cooldown = 0;
                _1skud_cooldown += 100;
                _1charge_cooldown = 0;
                _1charge_cooldown += 10;
                _1charge_power = 0;

                animate(); // Start animationen
                drawTrajectory(); // Beregn og tegn fuld bane
            }
        }
    }

    function charge() {
        if (_1charge_cooldown < 2) {
            if (_1charge_power < 100) {
                _1charge_power += 1;
                console.log(_1charge_power);
                drawTrajectory()
            }
        }
    }

    //minser cooldown så den går ned af
    setInterval(() => {
        if (_1skud_cooldown > 0) {
            _1skud_cooldown = Math.max(0, _1skud_cooldown - 1); // Ensure cooldown doesn't go below 0
        }
        if (_1charge_cooldown > 0) {
            _1charge_cooldown = Math.max(0, _1charge_cooldown - 1); // Ensure cooldown doesn't go below 0
            console.log(_1charge_cooldown);
        }
    }, 10);

    // Start funktionen til at tracke tankens bevægelse
    updateTankPosition();

    // Funktion til at opdatere tankens bevægelse
    function updateTankPosition() {
        if (leftPressed) {
            _1tankX -= _1movementSpeed;
            drawTrajectory(); // Opdatér banen, mens tanken bevæger sig
            if (_1tankX < 0) _1tankX = 0; // Undgå, at tanken forlader venstre grænse
        }
        if (rightPressed) {
            _1tankX += _1movementSpeed;
            drawTrajectory(); // Opdatér banen, mens tanken bevæger sig
            if (_1tankX + _1kanon.width > canvas_player.width) {
                _1tankX = canvas_player.width - _1kanon.width; // Undgå, at tanken forlader højre grænse
            }
        }

        // Ryd canvas og tegn tanken igen
        context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);
        context_player.drawImage(_1kanon, _1tankX, _1tankY);

        // Tjek og opdater vinklen
        updateVinkel();

        // Fortsæt med at opdatere med næste frame
        requestAnimationFrame(updateTankPosition);
    }

    // Funktion til at tegne banen for skuddet
    function drawTrajectory() {
        _1tankXmiddle = _1tankX + 50;
        _1tankYmiddle = _1tankY + 35;

        if (!_1skud) {
            _1skudX = _1tankXmiddle;
            _1skudY = _1tankYmiddle;
            context_arc.clearRect(0, 0, canvas_arc.width, canvas_arc.height);
            var speed = (_1power / 7) + (_1charge_power /100); // Brug "power"-variablen til at definere fart
            var angle = _1vinkel * (Math.PI / 180); // Brug "vinkel"-variablen til bane

            var initialVelocityX = speed * Math.cos(angle);
            var initialVelocityY = -speed * Math.sin(angle);

            var trajectoryX = _1skudX;
            var trajectoryY = _1skudY;

            context_arc.strokeStyle = "orange";
            if (_1charge_power >= 50) {
                context_arc.strokeStyle = "red";
            }
            context_arc.lineWidth = 2;
            context_arc.lineCap = "round";
            context_arc.beginPath();
            context_arc.moveTo(trajectoryX, trajectoryY);

            for (let t = 0; t < 200; t += 1) {
                trajectoryX = _1skudX + initialVelocityX * t;
                trajectoryY = _1skudY + initialVelocityY * t + 0.5 * gravity * Math.pow(t / 10, 2);

                context_arc.lineTo(trajectoryX, trajectoryY); // Ensure trajectory lines are drawn

                if (trajectoryX > canvas_arc.width || trajectoryY > ground_level) break;
            }

            context_arc.stroke();
        } else {
            context_arc.clearRect(0, 0, canvas_arc.width, canvas_arc.height); // Clear arc canvas if _1skud is active
        }
        make_ground();
    }

    // Funktion til at animere skuddet
    function animate() {
        if (_1skud) {
            _1skudX += velocityX; // Opdater vandret position
            velocityY += gravity / 100; // Opdater lodret hastighed grundet tyngdekraft
            _1skudY += velocityY; // Opdater lodret position

            // Ryd player-canvas og tegn igen
            context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);

            // Fjern rød bane, hvor skuddet er
            context_arc.clearRect(_1skudX - radius, _1skudY - radius, radius * 2, radius * 2);

            // Tegn skuddet
            context_player.beginPath();
            context_player.arc(_1skudX, _1skudY, radius, 0, 2 * Math.PI, false);
            context_player.fillStyle = 'black';
            context_player.fill();

            // Tjek, om skuddet er udenfor banen
            if (_1skudX > canvas_player.width || _1skudY > canvas_player.height) {
                _1skudX = _1tankX + 25; // Nulstil skuddet til kanonens position
                _1skudY = _1tankY;
                velocityX = 0;
                velocityY = 0;
                _1skud = false; // Markér skud som reset
            } else {
                requestAnimationFrame(animate); // Fortsæt animationen
            }

            // Tegn kanonen igen ved dens nuværende position
            context_player.drawImage(_1kanon, _1tankX, _1tankY);
            drawTrajectory(); // Tegn banen igen
        }
    }

    // Start med at tegne kanonen på den angivne position
    context_player.drawImage(_1kanon, _1tankX, _1tankY);
};
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

    var gravity = 20; // Gravitationsstyrke
    var radius = 10; // Radius for skuddet


    //player 1 variables
    var _1kanon = new Image();
    var _1velocityX = 0; // Vandret hastighed
    var _1velocityY = 0; // Lodret hastighed
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
    var _1damageHeight = 60;
    let _1upPressed = false;
    let _1downPressed = false;
    let _1rightPressed = false;
    let _1leftPressed = false;
    let _1shootPressed = false;
    let _1chargePressed = false;

    // player 2 variables
    var _2kanon = new Image();
    var _2velocityX = 0; // Vandret hastighed
    var _2velocityY = 0; // Lodret hastighed
    var _2tankX = 1350; // Tankens start-position (X)
    var _2tankY = 600; // Tankens faste start-position (Y)
    var _2tankXmiddle = _2tankX + 50; // Midten af tanken (X)
    var _2tankYmiddle = _2tankY + 35; // Midten af tanken (Y)
    var _2movementSpeed = 5; // Hvor hurtigt tanken kan flytte sig
    var _2skud = false; // Holder styr på om et skud er aktivt
    var _2charge_cooldown = 10 //såre for at der en buffer mellem at charge og at skyde
    var _2skud_cooldown = 100; // Cooldown til skuddet
    var _2skudX = _2tankX; // Starter X-position for skud
    var _2skudY = _2tankY; // Starter Y-position for skud
    var _2power = 80; // Hvor kraftig kanonen er
    var _2charge_power = 0 //hvor meget kraft exstra
    var _2vinkel = 135; // Vinkel på skud (i grader)
    var _2damageHeight = 60;
    let _2upPressed = false;
    let _2rightPressed = false;
    let _2downPressed = false;
    let _2leftPressed = false;


    var ground_level = 680;
    var _1start_spot = 300;
    var _2start_spot = 1200;
    var start_spot_random = Math.random() * (100 - 20) + 60;
    var _1start = Math.min(_1start_spot + start_spot_random, canvas_ground.width);
    var _2start = Math.min(_2start_spot - start_spot_random, canvas_ground.width);
    var random_length = Math.random() * (250 - 100) + 100;
    var pillars = [
        {height: Math.random() * (250 - 50) + 50, width: Math.random() * (80 - 20) + 40},
        {height: Math.random() * (250 - 50) + 50, width: Math.random() * (80 - 20) + 40},
        {height: Math.random() * (250 - 50) + 50, width: Math.random() * (80 - 20) + 40},
        {height: Math.random() * (250 - 50) + 50, width: Math.random() * (80 - 20) + 40},
    ];
    var firstpilar = _1start + pillars[0].width;

    _1kanon.src = "img/kanon.png";
    _2kanon.src = "img/kanon.png";



    function make_ground() {
        //start 1
        context_ground.clearRect(0, 0, canvas_ground.width, canvas_ground.height);
        context_ground.beginPath();
        context_ground.moveTo(0, ground_level);
        context_ground.lineTo(1524, ground_level);

        // Generate hitboxes array
        var hitboxes = [
            {x: _1start, y: ground_level - pillars[0].height, width: pillars[0].width, height: pillars[0].height},
        ];

        hitboxes.push({
            x: firstpilar + random_length,
            y: ground_level - pillars[1].height,
            width: pillars[1].width,
            height: pillars[1].height,
        });

        hitboxes.push({
            x: _2start,
            y: ground_level - pillars[2].height,
            width: pillars[2].width,
            height: pillars[2].height,
        });

        hitboxes.push({
            x: _2start - random_length,
            y: ground_level - pillars[3].height,
            width: pillars[3].width,
            height: pillars[3].height,
        });

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
                _1velocityX = 0;
                _1velocityY = 0;
                context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);
                _1drawTrajectory();

                // Find the pillar that was hit, based on the hitbox
                const pillarIndex = hitboxes.indexOf(box);

                if (pillarIndex !== -1 && pillars[pillarIndex]) {
                    // Reduce the height of the impacted pillar
                    pillars[pillarIndex].height -= _1damageHeight;

                    // Adjust the bounding box
                    if (box) {
                        box.height -= _1damageHeight;
                        box.y += _1damageHeight;
                    }

                    make_ground();
                }
            }

            // Handle Player 2 tank collision with hitboxes
            hitboxes.forEach((box) => {
                if (
                    _2tankX + _2kanon.width > box.x &&
                    _2tankX < box.x + box.width &&
                    _2tankY + _2kanon.height > box.y &&
                    _2tankY < box.y + box.height
                ) {
                    if (_2tankX + _2kanon.width / 2 < box.x + box.width / 2) {
                        _2tankX = box.x - _2kanon.width; // Skub spiller 2 til venstre for hitbox
                    } else {
                        _2tankX = box.x + box.width; // Skub spiller 2 til højre for hitbox
                    }
                }
            });
            // Handle collision for Player 2's bullet with hitboxes
            hitboxes.forEach((box) => {
                if (
                    _2skud &&
                    _2skudX + radius > box.x &&
                    _2skudX - radius < box.x + box.width &&
                    _2skudY + radius > box.y &&
                    _2skudY - radius < box.y + box.height
                ) {
                    _2skud = false; // Markér spiller 2's skud som inaktivt
                    _2skudX = _2tankX + 25; // Nulstil skuddets position
                    _2skudY = _2tankY;
                    _2velocityX = 0;
                    _2velocityY = 0;

                    context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);
                    _2drawTrajectory();

                    // Find den ramte pillar baseret på hitboxen
                    const pillarIndex = hitboxes.indexOf(box);

                    if (pillarIndex !== -1 && pillars[pillarIndex]) {
                        // Reducér højden af den påvirkede pillar
                        pillars[pillarIndex].height -= _2damageHeight;

                        // Juster hitboxens størrelse og position
                        if (box) {
                            box.height -= _2damageHeight;
                            box.y += _2damageHeight;
                        }

                        make_ground(); // Opdater hele spillets jordsystem
                    }
                }
            });
        });


    }

    // Lyt til tastetryk for tankens bevægelse
    document.addEventListener('keydown', function (event) {
        if (event.key === 'a' || event.key === 'A') {
            _1leftPressed = true;
        } else if (event.key === 'd' || event.key === 'D') {
            _1rightPressed = true;
        } else if (event.key === 'w' || event.key === 'W') {
            _1upPressed = true;
        } else if (event.key === 's' || event.key === 'S') {
            _1downPressed = true;
        } else if (event.key === 'e' || event.key === 'E') {
            _1shootPressed = true;
        } else if (event.key === 'q' || event.key === 'Q') {
            _1chargePressed = true;
        } else if (event.key === 'j' || event.key === 'J') {
            _2rightPressed = true;
        } else if (event.key === 'k' || event.key === 'K') {
            _2downPressed = true;
        } else if (event.key === 'u' || event.key === 'U') {

        } else if (event.key === 'i' || event.key === 'I') {
            _2upPressed = true;
        } else if (event.key === 'o' || event.key === 'O') {

        } else if (event.key === 'l' || event.key === 'L') {
            _2leftPressed = true;
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.key === 'a' || event.key === 'A') {
            _1leftPressed = false;
        } else if (event.key === 'd' || event.key === 'D') {
            _1rightPressed = false;
        } else if (event.key === 'w' || event.key === 'W') {
            _1upPressed = false;
        } else if (event.key === 's' || event.key === 'S') {
            _1downPressed = false;
        } else if (event.key === 'e' || event.key === 'E') {
            _1shootPressed = false;
        } else if (event.key === 'q' || event.key === 'Q') {
            _1chargePressed = false;
        } else if (event.key === 'j' || event.key === 'J') {
            _2rightPressed = false;
        } else if (event.key === 'k' || event.key === 'K') {
            _2downPressed = false;
        } else if (event.key === 'u' || event.key === 'U') {

        } else if (event.key === 'i' || event.key === 'I') {
            _2upPressed = false;
        } else if (event.key === 'o' || event.key === 'O') {

        } else if (event.key === 'l' || event.key === 'L') {
            _2leftPressed = false;
        }
    });

    //minser cooldown så den går ned af
    setInterval(() => {
        if (_1skud_cooldown > 0) {
            _1skud_cooldown = Math.max(0, _1skud_cooldown - 1); // Ensure cooldown doesn't go below 0
        }
        if (_1charge_cooldown > 0) {
            _1charge_cooldown = Math.max(0, _1charge_cooldown - 1); // Ensure cooldown doesn't go below 0

        }
        if (_2skud_cooldown > 0) {
            _2skud_cooldown = Math.max(0, _2skud_cooldown - 1); // Ensure cooldown doesn't go below 0
        }
        if (_2charge_cooldown > 0) {
            _2charge_cooldown = Math.max(0, _2charge_cooldown - 1); // Ensure cooldown doesn't go below 0

        }
    }, 10);

    //player 1
    function player1() {
        _1update();

        // Opdater vinkel, når "W" eller "S" tasten holdes nede
        function _1updateVinkel() {
            if (_1upPressed) {
                _1vinkel += 0.5;
                _1drawTrajectory();
            }
            if (_1downPressed) {
                _1vinkel -= 0.5;
                _1drawTrajectory();
            }
            // Begræns vinkel inden for området [-15, 88]
            _1vinkel = Math.max(-15, Math.min(88, _1vinkel));

            // Tegn trajectory igen efter opdatering
        }

        function _1shoot() {
            if (!_1skud) {
                if (_1skud_cooldown < 2) {
                    // Beregn skudhastigheden og vinklen
                    var _1speed = (_1power / 7) + (_1charge_power / 100); // Brug "power"-variablen til at definere fart
                    var _1angle = _1vinkel * (Math.PI / 180); // Brug "vinkel"-variablen (omregnet til radianer)
                    _1velocityX = _1speed * Math.cos(_1angle); // Vandret hastighed
                    _1velocityY = -_1speed * Math.sin(_1angle); // Lodret hastighed
                    _1skud = true;

                    if (_1charge_power >= 35) {
                        _1damageHeight = 60;
                    } else if (_1charge_power >= 75) {
                        _1damageHeight = 75;
                    } else {
                        _1damageHeight = 50;
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
                    _1animate();
                }
            }
        }

        function _1charge() {
            if (_1charge_cooldown < 2) {
                if (_1charge_power < 100) {
                    _1charge_power += 1;
                    _1drawTrajectory();
                }
            }
        }

        // Funktion til at opdatere tankens bevægelse
        function _1updateTankPosition() {
            if (_1leftPressed) {
                _1tankX -= _1movementSpeed;
                _1drawTrajectory();
                if (_1tankX < 0) _1tankX = 0; // Undgå, at tanken forlader venstre grænse
            }
            if (_1rightPressed) {
                _1tankX += _1movementSpeed;
                _1drawTrajectory();
                if (_1tankX + _1kanon.width > canvas_player.width) {
                    _1tankX = canvas_player.width - _1kanon.width; // Undgå, at tanken forlader højre grænse
                }
            }
        }

        // Funktion til at tegne banen for skuddet
        function _1drawTrajectory() {
            _1tankXmiddle = _1tankX + 50;
            _1tankYmiddle = _1tankY + 35;

            if (!_1skud) {
                _1skudX = _1tankXmiddle;
                _1skudY = _1tankYmiddle;
                context_arc.clearRect(0, 0, canvas_arc.width, canvas_arc.height);
                var _1speed = (_1power / 7) + (_1charge_power / 100); // Brug "power"-variablen til at definere fart
                var _1angle = _1vinkel * (Math.PI / 180); // Brug "vinkel"-variablen til bane

                var _1initialVelocityX = _1speed * Math.cos(_1angle);
                var _1initialVelocityY = -_1speed * Math.sin(_1angle);

                var _1trajectoryX = _1skudX;
                var _1trajectoryY = _1skudY;


                if (_1charge_power >= 75) {
                    context_arc.strokeStyle = "red";
                } else if (_1charge_power >= 35) {
                    context_arc.strokeStyle = "orange";
                } else {
                    context_arc.strokeStyle = "green";
                }
                context_arc.lineWidth = 2;
                context_arc.lineCap = "round";
                context_arc.beginPath();
                context_arc.moveTo(_1trajectoryX, _1trajectoryY);

                for (let t = 0; t < 200; t += 1) {
                    _1trajectoryX = _1skudX + _1initialVelocityX * t;
                    _1trajectoryY = _1skudY + _1initialVelocityY * t + 0.5 * gravity * Math.pow(t / 10, 2);

                    context_arc.lineTo(_1trajectoryX, _1trajectoryY); // Ensure trajectory lines are drawn

                    if (_1trajectoryX > canvas_arc.width || _1trajectoryY > ground_level) break;
                }

                context_arc.stroke();
            } else {
                context_arc.clearRect(0, 0, canvas_arc.width, canvas_arc.height); // Clear arc canvas if _1skud is active
            }
            make_ground();
        }

        // Funktion til at animere skuddet
        function _1animate() {
            if (_1skud) {
                _1skudX += _1velocityX; // Opdater vandret position
                _1velocityY += gravity / 100; // Opdater lodret hastighed grundet tyngdekraft
                _1skudY += _1velocityY; // Opdater lodret position

                // Ryd player-canvas og tegn igen
                context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);
                context_player.drawImage(_2kanon, _2tankX, _2tankY);

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
                    _1velocityX = 0;
                    _1velocityY = 0;
                    _1skud = false; // Markér skud som reset
                } else {
                    requestAnimationFrame(_1animate); // Fortsæt animationen
                }
                // Tegn kanonen igen ved dens nuværende position
                context_player.drawImage(_1kanon, _1tankX, _1tankY);
                _1drawTrajectory();
            }
        }

        function _1update() {
            _1updateVinkel()
            _1updateTankPosition();

            if (_1shootPressed === true) {

            }

            requestAnimationFrame(_1update);
        }
    }


    //player 2



    function gameLoop() {
        // Opdater positioner for spillere
        player1();

    }

// Start loopet
    gameLoop();


};
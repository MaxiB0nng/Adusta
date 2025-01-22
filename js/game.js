// Dette kaldes, når alle elementer på siden er klar
window.onload = function () {
    // Hent canvas-elementerne og deres kontekster
    var canvas_player = document.getElementById('player');
    var context_player = canvas_player.getContext('2d');
    var canvas_arc1 = document.getElementById('arc1');
    var context_arc1 = canvas_arc1.getContext('2d');
    var canvas_arc2 = document.getElementById('arc2');
    var context_arc2 = canvas_arc2.getContext('2d');
    var canvas_ground = document.getElementById('ground');
    var context_ground = canvas_ground.getContext('2d');
    var canvas_bullet1 = document.getElementById('bullet1');
    var context_bullet1 = canvas_bullet1.getContext('2d');
    var canvas_bullet2 = document.getElementById('bullet2');
    var context_bullet2 = canvas_bullet2.getContext('2d');


    // Initialiser forskellige variabler

    var gravity = 20; // Gravitationsstyrke
    var radius = 10; // Radius for skuddet


    //player 1 variables
    var _1tank = new Image();
    var _1velocityX = 0; // Vandret hastighed
    var _1velocityY = 0; // Lodret hastighed
    var _1tankX = 50; // Tankens start-position (X)
    var _1tankY = 645; // Tankens faste start-position (Y)
    var _1tankXmiddle = _1tankX + 17;
    var _1tankYmiddle = _1tankY + 27 ;
    var _1movementSpeed = 5; // Hvor hurtigt tanken kan flytte sig
    var _1skud = false; // Holder styr på om et skud er aktivt
    var _1charge_cooldown = 10; //såre for at der en buffer mellem at charge og at skyde
    var _1shoot_cooldown = 50; //såre for at der en buffer for skudet
    var _1skudX = _1tankX; // Starter X-position for skud
    var _1skudY = _1tankY; // Starter Y-position for skud
    var _1power = 80; // Hvor kraftig kanonen er
    var _1charge_power = 0; //hvor meget kraft exstra
    var _1vinkel = 45; // Vinkel på skud (i grader)
    var _1damageHeight = 60;
    var _1playerhp = 100;
    let _1player_alive = true;
    let _1upPressed = false;
    let _1downPressed = false;
    let _1rightPressed = false;
    let _1leftPressed = false;
    let _1shootPressed = false;
    let _1chargePressed = false;
    let _1player_win = false;

    // player 2 variables
    var _2tank = new Image();
    var _2velocityX = 0; // Vandret hastighed
    var _2velocityY = 0; // Lodret hastighed
    var _2tankX = 1350; // Tankens start-position (X)
    var _2tankY = 645; // Tankens faste start-position (Y)
    var _2tankXmiddle = _2tankX + 17;
    var _2tankYmiddle = _2tankY + 27;
    var _2movementSpeed = 5; // Hvor hurtigt tanken kan flytte sig
    var _2skud = false; // Holder styr på om et skud er aktivt
    var _2charge_cooldown = 10; //såre for at der en buffer mellem at charge og at skyde
    var _2shoot_cooldown = 50; //såre for at der en buffer for skudet
    var _2skudX = _2tankX; // Starter X-position for skud
    var _2skudY = _2tankY; // Starter Y-position for skud
    var _2power = 80; // Hvor kraftig kanonen er
    var _2charge_power = 0; //hvor meget kraft exstra
    var _2vinkel = 135; // Vinkel på skud (i grader)
    var _2damageHeight = 60;
    var _2playerhp = 100;
    let _2player_alive = true;
    let _2upPressed = false;
    let _2rightPressed = false;
    let _2downPressed = false;
    let _2leftPressed = false;
    let _2shootPressed = false;
    let _2chargePressed = false;
    let _2player_win = false;


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

    _1tank.src = "assets/img/tank.png";
    _2tank.src = "assets/img/tank.png";


    function make_ground() {
        //start 1
        context_ground.clearRect(0, 0, canvas_ground.width, canvas_ground.height);
        context_ground.beginPath();
        context_ground.moveTo(0, ground_level);
        context_ground.lineTo(1524, ground_level);

        // Generate hitboxes array
        var hitboxes = [
            {
                x: _1start,
                y: ground_level - pillars[0].height,
                width: pillars[0].width,
                height: pillars[0].height}
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
                _1tankX + _1tank.width > box.x &&
                _1tankX < box.x + box.width &&
                _1tankY + _1tank.height > box.y &&
                _1tankY < box.y + box.height
            ) {
                if (_1tankX + _1tank.width / 2 < box.x + box.width / 2) {
                    _1tankX = box.x - _1tank.width; // Push tank to the left of the hitbox
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
                _1skudX = _1tankXmiddle; // Reset bullet position
                _1skudY = _1tankYmiddle;
                _1velocityX = 0;
                _1velocityY = 0;
                _1shoot_cooldown += 50;
                context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);
                context_bullet1.clearRect(0, 0, canvas_player.width, canvas_player.height);
                context_player.drawImage(_1tank, _1tankX, _1tankY);
                context_player.drawImage(_2tank, _2tankX, _2tankY);


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
                    _2tankX + _2tank.width > box.x &&
                    _2tankX < box.x + box.width &&
                    _2tankY + _2tank.height > box.y &&
                    _2tankY < box.y + box.height
                ) {
                    if (_2tankX + _2tank.width / 2 < box.x + box.width / 2) {
                        _2tankX = box.x - _2tank.width; // Skub spiller 2 til venstre for hitbox
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
                    _2skudX = _2tankXmiddle; // Reset bullet position
                    _2skudY = _2tankYmiddle;
                    _2velocityX = 0;
                    _2velocityY = 0;
                    _2shoot_cooldown += 50;
                    context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);
                    context_bullet2.clearRect(0, 0, canvas_player.width, canvas_player.height);
                    context_player.drawImage(_1tank, _1tankX, _1tankY);
                    context_player.drawImage(_2tank, _2tankX, _2tankY);


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
            _2leftPressed = true;
        } else if (event.key === 'k' || event.key === 'K') {
            _2downPressed = true;
        } else if (event.key === 'u' || event.key === 'U') {
            _2chargePressed = true;
        } else if (event.key === 'i' || event.key === 'I') {
            _2upPressed = true;
        } else if (event.key === 'o' || event.key === 'O') {
            _2shootPressed = true;
        } else if (event.key === 'l' || event.key === 'L') {
            _2rightPressed = true;
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
            _2leftPressed = false;
        } else if (event.key === 'k' || event.key === 'K') {
            _2downPressed = false;
        } else if (event.key === 'u' || event.key === 'U') {
            _2chargePressed = false;
        } else if (event.key === 'i' || event.key === 'I') {
            _2upPressed = false;
        } else if (event.key === 'o' || event.key === 'O') {
            _2shootPressed = false;
        } else if (event.key === 'l' || event.key === 'L') {
            _2rightPressed = false;
        }
    });

    gameLoop();

    //minser cooldown så den går ned af
    setInterval(() => {
        if (_1charge_cooldown > 0) {
            _1charge_cooldown = Math.max(0, _1charge_cooldown - 1); // Ensure cooldown doesn't go below 0

        }
        if (_1shoot_cooldown > 0) {
            _1shoot_cooldown = Math.max(0, _1shoot_cooldown - 1); // Ensure cooldown doesn't go below 0
        }
        if (_2charge_cooldown > 0) {
            _2charge_cooldown = Math.max(0, _2charge_cooldown - 1); // Ensure cooldown doesn't go below 0

        }
        if (_2shoot_cooldown > 0) {
            _2shoot_cooldown = Math.max(0, _2shoot_cooldown - 1); // Ensure cooldown doesn't go below 0

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
                if (_1shoot_cooldown === 0) {

                    // Beregn skudhastigheden og vinklen
                    var _1speed = (_1power / 7) + (_1charge_power / 100); // Brug "power"-variablen til at definere fart
                    var _1angle = _1vinkel * (Math.PI / 180); // Brug "vinkel"-variablen (omregnet til radianer)
                    _1velocityX = _1speed * Math.cos(_1angle); // Vandret hastighed
                    _1velocityY = -_1speed * Math.sin(_1angle); // Lodret hastighed
                    _1skud = true;

                    if (_1charge_power <= 35) {
                        _1damageHeight = 50;
                    }
                    if (_1charge_power >= 35) {
                        _1damageHeight = 65;
                    }
                    if (_1charge_power >= 75) {
                        _1damageHeight = 80;
                    }

                    // Opdater position til midten af tanken
                    _1tankXmiddle = _1tankX + 17;
                    _1tankYmiddle = _1tankY + 27 ;
                    _1skudX = _1tankXmiddle;
                    _1skudY = _1tankYmiddle;
                    _1charge_cooldown = 0;
                    _1charge_cooldown += 10;
                    _1charge_power = 0;

                    _1animate();

                }
            }
        }

        function _1charge() {
            if (!_1skud) {
                if (_1charge_cooldown < 2) {
                    if (_1charge_power < 100) {
                        _1charge_power += 1;
                        _1drawTrajectory();
                    }
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
                if (_1tankX + _1tank.width > canvas_player.width) {
                    _1tankX = canvas_player.width - _1tank.width; // Undgå, at tanken forlader højre grænse
                }
            }
        }

        function _1collisionDetection() {
            // Check if the bullet intersects player 2's tank
            if (
                _1skud && // Bullet must be active
                _1skudX + radius > _2tankX && // Check if bullet is within the right boundary of player 2
                _1skudX - radius < _2tankX + _2tank.width && // Check if bullet is within the left boundary of player 2
                _1skudY + radius > _2tankY && // Check if bullet is below the top boundary of player 2
                _1skudY - radius < _2tankY + _2tank.height // Check if bullet is above the bottom boundary of player 2
            ) {
                // Collision detected
                _2playerhp -= 25; // Reduce Player 2's HP by 25
                console.log("Player 2 HP:", _2playerhp);
                if (_1playerhp <= 0) {
                    _1player_alive = false;
                }

                // Reset bullet state
                _1skud = false;
                _1skudX = _1tankXmiddle; // Reset bullet position to player 1's tank
                _1skudY = _1tankYmiddle;
                _1velocityX = 0; // Reset velocity
                _1velocityY = 0;
                _1shoot_cooldown += 50;

                // Clear bullet and redraw players
                context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);
                context_bullet1.clearRect(0, 0, canvas_bullet1.width, canvas_bullet1.height);
                context_player.drawImage(_1tank, _1tankX, _1tankY);
                context_player.drawImage(_2tank, _2tankX, _2tankY);
            }
        }

        // Funktion til at tegne banen for skuddet
        function _1drawTrajectory() {

            _1tankXmiddle = _1tankX + 17;
            _1tankYmiddle = _1tankY + 27;

            context_player.clearRect(0, 0, canvas_player.width, canvas_player.height); // Ensure player canvas is cleared

            context_player.drawImage(_1tank, _1tankX, _1tankY);
            context_player.drawImage(_2tank, _2tankX, _2tankY);

            if (!_1skud) {
                _1skudX = _1tankXmiddle;
                _1skudY = _1tankYmiddle;

                var _1speed = (_1power / 7) + (_1charge_power / 100); // Calculating speed based on power
                var _1angle = _1vinkel * (Math.PI / 180); // Convert angle to radians

                var _1initialVelocityX = _1speed * Math.cos(_1angle);
                var _1initialVelocityY = -_1speed * Math.sin(_1angle);

                var _1trajectoryX = _1skudX;
                var _1trajectoryY = _1skudY;

                // Set stroke color based on charge power
                if (_1charge_power >= 75) {
                    context_arc1.strokeStyle = "red";
                } else if (_1charge_power >= 35) {
                    context_arc1.strokeStyle = "orange";
                } else {
                    context_arc1.strokeStyle = "green";
                }

                context_arc1.lineWidth = 2;
                context_arc1.lineCap = "round";
                context_arc1.beginPath();
                context_arc1.moveTo(_1trajectoryX, _1trajectoryY);

                for (let t = 0; t < 200; t += 1) {
                    _1trajectoryX = _1skudX + _1initialVelocityX * t;
                    _1trajectoryY = _1skudY + _1initialVelocityY * t + 0.5 * gravity * Math.pow(t / 10, 2);

                    context_arc1.lineTo(_1trajectoryX, _1trajectoryY); // Add calculated point to path

                    if (_1trajectoryX > canvas_arc1.width || _1trajectoryY > canvas_arc1.height || _1trajectoryY > ground_level) break;
                }
                context_arc1.clearRect(0, 0, canvas_arc1.width, canvas_arc1.height); // Ensure arc canvas is cleared first
                context_arc1.stroke(); // Draw the path

            }

            make_ground(); // Redraw the ground
        }

        // Funktion til at animere skuddet
        function _1animate() {
            if (_1skud) {

                _1skudX += _1velocityX; // Opdater vandret position
                _1velocityY += gravity / 100; // Opdater lodret hastighed grundet tyngdekraft
                _1skudY += _1velocityY; // Opdater lodret position

                context_bullet1.clearRect(0, 0, canvas_bullet1.width, canvas_bullet1.height);
                // Fjern rød bane, hvor skuddet er
                context_arc1.clearRect(_1skudX - radius, _1skudY - radius, radius * 2, radius * 2);


                // Tegn skuddet
                context_bullet1.beginPath();
                context_bullet1.arc(_1skudX, _1skudY, radius, 0, 2 * Math.PI, false);
                context_bullet1.fillStyle = 'blue';
                context_bullet1.fill();

                _1collisionDetection();

                // Tjek, om skuddet er udenfor banen
                if (_1skudX > canvas_player.width || _1skudY > canvas_player.height) {
                    _1skudX = _1tankX + 25; // Nulstil skuddet til kanonens position
                    _1skudY = _1tankY;
                    _1velocityX = 0;
                    _1velocityY = 0;
                    _1shoot_cooldown += 50;
                    _1skud = false; // Markér skud som reset
                } else {
                    requestAnimationFrame(_1animate); // Fortsæt animationen
                }
                // Tegn tanken igen ved dens nuværende position

                _1drawTrajectory();
            }
        }

        function _1update() {
            _1updateVinkel()
            _1updateTankPosition();
            _1drawTrajectory();

            if (_1shootPressed === true) {
                _1shoot()
            }
            if (_1chargePressed === true) {
                _1charge()
            }


            requestAnimationFrame(_1update);
        }
    }

    //player 2
    function player2() {
        _2update();

        // Update angle when up or down keys are pressed
        function _2updateVinkel() {
            if (_2upPressed) {
                _2vinkel -= 0.5;
                _2drawTrajectory();
            }
            if (_2downPressed) {
                _2vinkel += 0.5;
                _2drawTrajectory();
            }
            // Restrict angle within the range [-15, 88]
            _2vinkel = Math.max(92, Math.min(195, _2vinkel));
        }

        function _2shoot() {
            if (!_2skud) {
                if (_2shoot_cooldown === 0) {

                    // Calculate bullet speed and angle
                    let _2speed = (_2power / 7) + (_2charge_power / 100); // Determine bullet speed
                    let _2angle = _2vinkel * (Math.PI / 180); // Convert angle to radians

                    // Calculate velocities based on speed and angle
                    _2velocityX = _2speed * Math.cos(_2angle); // Horizontal velocity
                    _2velocityY = -_2speed * Math.sin(_2angle); // Vertical velocity

                    // Set bullet as active
                    _2skud = true;


                    // Adjust damage height based on charge power
                    if (_2charge_power <= 35) {
                        _2damageHeight = 50;
                    }
                    if (_2charge_power >= 35) {
                        _2damageHeight = 65;
                    }
                    if (_2charge_power >= 75) {
                        _2damageHeight = 80;
                    }

                    // Update bullet's starting position (center of player 2's tank)
                    _2tankXmiddle = _2tankX + 17;
                    _2tankYmiddle = _2tankY + 27;
                    _2skudX = _2tankXmiddle;
                    _2skudY = _2tankYmiddle;


                    _2charge_cooldown = 10;
                    _2charge_power = 0;

                    _2animate(); // Start bullet animation
                }
            }
        }

        function _2charge() {
            if (!_2skud) {

                if (_2charge_cooldown < 2) {
                    if (_2charge_power < 100) {
                        _2charge_power += 1;
                        _2drawTrajectory();
                    }
                }
            }
        }

        function _2updateTankPosition() {
            if (_2leftPressed) {
                _2tankX -= _2movementSpeed;
                _2drawTrajectory();
                if (_2tankX < 0) _2tankX = 0; // Prevent tank from leaving the left boundary
            }
            if (_2rightPressed) {
                _2tankX += _2movementSpeed;
                _2drawTrajectory();
                if (_2tankX + _2tank.width > canvas_player.width) {
                    _2tankX = canvas_player.width - _2tank.width; // Prevent tank from leaving the right boundary
                }
            }
        }

        function _2collisionDetection() {
            // Check if the bullet intersects player 1's tank
            if (
                _2skud && // Bullet must be active
                _2skudX + radius > _1tankX && // Check if bullet is within the right boundary of player 1
                _2skudX - radius < _1tankX + _1tank.width && // Check if bullet is within the left boundary of player 1
                _2skudY + radius > _1tankY && // Check if bullet is below the top boundary of player 1
                _2skudY - radius < _1tankY + _1tank.height // Check if bullet is above the bottom boundary of player 1
            ) {
                // Collision detected
                _1playerhp -= 25; // Reduce Player 1's HP by 25
                console.log("Player 1 HP:", _1playerhp);
                if (_2playerhp <= 0) {
                    _2player_alive = false;
                }

                // Reset bullet state
                _2skud = false;
                _2skudX = _2tankX + 25; // Reset bullet position to player 2's tank
                _2skudY = _2tankY;
                _2velocityX = 0; // Reset velocity
                _2velocityY = 0;
                _2shoot_cooldown += 50;

                // Clear bullet and redraw players
                context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);
                context_bullet2.clearRect(0, 0, canvas_bullet2.width, canvas_bullet2.height);
                context_player.drawImage(_1tank, _1tankX, _1tankY);
                context_player.drawImage(_2tank, _2tankX, _2tankY);
            }
        }

        function _2drawTrajectory() {
            _2tankXmiddle = _2tankX + 17;
            _2tankYmiddle = _2tankY + 27;

            context_player.clearRect(0, 0, canvas_arc2.width, canvas_arc2.height);
            context_player.drawImage(_1tank, _1tankX, _1tankY);
            context_player.drawImage(_2tank, _2tankX, _2tankY);

            if (!_2skud) {
                _2skudX = _2tankXmiddle;
                _2skudY = _2tankYmiddle;
                context_arc2.clearRect(0, 0, canvas_arc2.width, canvas_arc2.height);

                // Calculate trajectory
                let _2speed = (_2power / 7) + (_2charge_power / 100);
                let _2angle = _2vinkel * (Math.PI / 180);

                let _2initialVelocityX = _2speed * Math.cos(_2angle);
                let _2initialVelocityY = -_2speed * Math.sin(_2angle);

                let _2trajectoryX = _2skudX;
                let _2trajectoryY = _2skudY;

                // Trajectory color based on charge power
                if (_2charge_power >= 75) {
                    context_arc2.strokeStyle = "red";
                } else if (_2charge_power >= 35) {
                    context_arc2.strokeStyle = "orange";
                } else {
                    context_arc2.strokeStyle = "green";
                }
                context_arc2.lineWidth = 2;
                context_arc2.beginPath();
                context_arc2.moveTo(_2trajectoryX, _2trajectoryY);

                // Simulate trajectory points
                for (let t = 0; t < 200; t += 1) {
                    _2trajectoryX = _2skudX + _2initialVelocityX * t;
                    _2trajectoryY = _2skudY + _2initialVelocityY * t + 0.5 * gravity * Math.pow(t / 10, 2);

                    context_arc2.lineTo(_2trajectoryX, _2trajectoryY);

                    if (_2trajectoryX > canvas_arc2.width || _2trajectoryY > ground_level) break;
                }
                context_arc2.stroke();
            }
            make_ground();
        }

        function _2animate() {
            if (_2skud) {
                _2skudX += _2velocityX; // Update horizontal position
                _2velocityY += gravity / 100; // Update vertical velocity due to gravity
                _2skudY += _2velocityY; // Update vertical position

                context_bullet2.clearRect(0, 0, canvas_bullet2.width, canvas_bullet2.height);
                context_arc2.clearRect(_2skudX - radius, _2skudY - radius, radius * 2, radius * 2);

                // Draw bullet
                context_bullet2.beginPath();
                context_bullet2.arc(_2skudX, _2skudY, radius, 0, 2 * Math.PI, false);
                context_bullet2.fillStyle = 'red';
                context_bullet2.fill();

                _2collisionDetection(); // Check for collision

                // Check if bullet is out of bounds
                if (_2skudX > canvas_player.width || _2skudY > canvas_player.height) {
                    _2skudX = _2tankXmiddle;
                    _2skudY = _2tankYmiddle;
                    _2velocityX = 0;
                    _2velocityY = 0;
                    _2skud = false;
                    _2shoot_cooldown += 50;
                } else {
                    requestAnimationFrame(_2animate); // Continue animation
                }
            }
        }

        function _2update() {
            _2updateVinkel();
            _2updateTankPosition();
            _2drawTrajectory();

            if (_2shootPressed === true) {
                _2shoot();
            }
            if (_2chargePressed === true) {
                _2charge();
            }

            requestAnimationFrame(_2update);
        }
    }


    function gameLoop() {
        // Opdater positioner for spillere
        player1();
        player2();

        context_player.drawImage(_1tank, _1tankX, _1tankY);
        context_player.drawImage(_2tank, _2tankX, _2tankY);
    }

}
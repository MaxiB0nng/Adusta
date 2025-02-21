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


    //liste af alle vores variabler
    var gravity = 20; // Gravitationsstyrke
    var radius = 10; // Radius for skuddet

    //player 1 variables
    var _1velocityX = 0; // Vandret hastighed
    var _1velocityY = 0; // Lodret hastighed
    var _1tankX = 50; // Tankens start-position (X)
    var _1tankY = 645; // Tankens faste start-position (Y)
    var _1tankXmiddle = _1tankX + 17;
    var _1tankYmiddle = _1tankY + 27;
    var _1movementSpeed = 5; // Hvor hurtigt tanken kan flytte sig
    var _1skud = false; // Holder styr på om et skud er aktivt
    var _1charge_cooldown = 10; //såre for at der en buffer mellem at charge og at skyde
    var _1shoot_cooldown = 50; //såre for at der en buffer for skudet
    var _1skudX = _1tankX; // Starter X-position for skud
    var _1skudY = _1tankY; // Starter Y-position for skud
    var _1power = 80; // Hvor kraftig kanonen er
    var _1charge_power = 0; //hvor meget kraft exstra
    var _1vinkel = 45; // Vinkel på skud (i grader)
    var _1damageHeight = 60; //hvor meget vores pillars gå ned nå vi skyder den
    var _1playerhp = 100; //hvor meget hp vores spiler har
    let _1player_alive = true;
    //spiler 1 s keybinds (control kanpper)
    let _1upPressed = false;
    let _1downPressed = false;
    let _1rightPressed = false;
    let _1leftPressed = false;
    let _1shootPressed = false;
    let _1chargePressed = false;

    let _1lastAnimateTime = 0; // Gemmer det sidste tidspunkt, hvor _1animate blev udført
    const _1animateFrameDuration = 1000 / 60; // Målrammens varighed i millisekunder (60 FPS)

    // player 2 variables
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
    var _2damageHeight = 60; //hvor meget vores pillars gå ned nå vi skyder den
    var _2playerhp = 100;  //hvor meget hp vores spiler har
    let _2player_alive = true;
    //spiler 1 s keybinds (control kanpper)
    let _2upPressed = false;
    let _2rightPressed = false;
    let _2downPressed = false;
    let _2leftPressed = false;
    let _2shootPressed = false;
    let _2chargePressed = false;


    let _2lastAnimateTime = 0; // Gemmer det sidste tidspunkt, hvor _1animate blev udført
    const _2animateFrameDuration = 1000 / 60; // Målrammens varighed i millisekunder (60 FPS)

    //variabler som vi bruger til at lave hvor terang/pillars (pæle)
    var ground_level = 700;
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

    //de variabler vi bruger til at lave vores bilder (player 1 2 og pælene)
    var _1tank = new Image();
    var _2tank = new Image();
    const pillarImage = new Image();

    _1tank.src = "assets/img/tank.png";
    _2tank.src = "assets/img/tank.png";
    pillarImage.src = "assets/img/pillar.png"; //


    //vinder iconer  der vises når man vinder
    const player2WinsImage = new Image();
    const player1WinsImage = new Image();
    player1WinsImage.src = "assets/img/1wins.png";
    player2WinsImage.src = "assets/img/2wins.png";


    //vi bruger de here variabler til at sætte den specifik tid mellem spilets opdateringer.
    //så udasent hvilken pc den kører på de ville være samme hastihed
    let lastTime = 0;
    const fps = 60; //den mængte fps vi vil have
    const frameDuration = 1000 / fps;

    function make_ground() {

        // Start med at tegne jorden
        context_ground.clearRect(0, 0, canvas_ground.width, canvas_ground.height); // Ryd jorden (ground canvas), så vi kan starte forfra
        context_ground.beginPath(); // Start en ny sti (path) til tegning

        // Generer hitboxes (områder, hvor objekter kan kollidere)
        var hitboxes = [
            {
                x: _1start, // Startposition for den første hitbox
                y: ground_level - pillars[0].height, // Beregn y-position baseret på ground level minus søjlens højde
                width: pillars[0].width, // Bredde for den første hitbox
                height: pillars[0].height // Højde for den første hitbox
                //det samme gøre vi i vorse andre hitboxses
            }
        ];

        hitboxes.push({ //hitbox 2
            x: firstpilar + random_length,
            y: ground_level - pillars[1].height,
            width: pillars[1].width,
            height: pillars[1].height,
        });

        hitboxes.push({ //hitbox 3
            x: _2start,
            y: ground_level - pillars[2].height,
            width: pillars[2].width,
            height: pillars[2].height,
        });

        hitboxes.push({ //hitbox 4
            x: _2start - random_length,
            y: ground_level - pillars[3].height,
            width: pillars[3].width,
            height: pillars[3].height,
        });


        hitboxes.forEach((box) => { // Gennemgå hver hitbox så de samme regler tæller for dem alle
            // Tegn billedet af søjlen
            context_ground.drawImage(pillarImage, box.x, box.y, box.width, box.height);

            // Tegn rammer for hitboxsene
            context_ground.beginPath();
            context_ground.rect(box.x, box.y, box.width, box.height); // Tegn en firkant for hitbox
            context_ground.strokeStyle = "transparent"; // Gør rammerne usynlige
            context_ground.stroke();
        });

        // Håndter kollisioner mellem tanks og kugler
        hitboxes.forEach((box) => {
            // Håndter kollision mellem Player 1's tank og hitboxen
            if (
                _1tankX + _1tank.width > box.x &&
                _1tankX < box.x + box.width &&
                _1tankY + _1tank.height > box.y &&
                _1tankY < box.y + box.height
            ) {
                if (_1tankX + _1tank.width / 2 < box.x + box.width / 2) {
                    _1tankX = box.x - _1tank.width; // Skub tanken til venstre for hitboxen
                } else {
                    _1tankX = box.x + box.width; // Skub tanken til højre for hitboxen
                }
            }

            // Håndter kollision mellem Player 1's kugler og hitboxen
            if (
                _1skud &&
                _1skudX + radius > box.x &&
                _1skudX - radius < box.x + box.width &&
                _1skudY + radius > box.y &&
                _1skudY - radius < box.y + box.height
            ) {
                _1skud = false; // Markér kuglen som inaktiv
                _1skudX = _1tankXmiddle; // Nulstil kuglens position
                _1skudY = _1tankYmiddle;
                _1velocityX = 0;
                _1velocityY = 0;
                _1shoot_cooldown += 50; // Tilføj cooldown for næste skud
                context_player.clearRect(0, 0, canvas_player.width, canvas_player.height); // Ryd skærmen for kuglen
                context_bullet1.clearRect(0, 0, canvas_player.width, canvas_player.height);
                context_player.drawImage(_1tank, _1tankX, _1tankY); // Tegn spilleren igen
                context_player.drawImage(_2tank, _2tankX, _2tankY);

                // Find den søjle, der blev ramt
                const pillarIndex = hitboxes.indexOf(box);

                if (pillarIndex !== -1 && pillars[pillarIndex]) {
                    // Reducér højden af den ramte søjle
                    pillars[pillarIndex].height -= _1damageHeight;
                    if (pillars[pillarIndex].height <= 45) {
                        pillars[pillarIndex].height = 0; // Hvis højden er under 45, fjernes søjlen
                    }

                    // Justér bounding box
                    if (box) {
                        box.height -= _1damageHeight;
                        box.y += _1damageHeight;
                    }

                    make_ground(); // Tegn jorden igen
                }
            }
        });
        //det samme gøre vi for player 2
        hitboxes.forEach((box) => {

            if (
                _2tankX + _2tank.width > box.x &&
                _2tankX < box.x + box.width &&
                _2tankY + _2tank.height > box.y &&
                _2tankY < box.y + box.height
            ) {
                if (_2tankX + _2tank.width / 2 < box.x + box.width / 2) {
                    _2tankX = box.x - _2tank.width;
                } else {
                    _2tankX = box.x + box.width;
                }
            }

            if (
                _2skud &&
                _2skudX + radius > box.x &&
                _2skudX - radius < box.x + box.width &&
                _2skudY + radius > box.y &&
                _2skudY - radius < box.y + box.height
            ) {
                _2skud = false;
                _2skudX = _2tankXmiddle;
                _2skudY = _2tankYmiddle;
                _2velocityX = 0;
                _2velocityY = 0;
                _2shoot_cooldown += 50;
                context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);
                context_bullet2.clearRect(0, 0, canvas_player.width, canvas_player.height);
                context_player.drawImage(_1tank, _1tankX, _1tankY);
                context_player.drawImage(_2tank, _2tankX, _2tankY);


                const pillarIndex = hitboxes.indexOf(box);

                if (pillarIndex !== -1 && pillars[pillarIndex]) {

                    pillars[pillarIndex].height -= _2damageHeight;
                    if (pillars[pillarIndex].height <= 45) {
                        pillars[pillarIndex].height = 0;
                    }

                    if (box) {
                        box.height -= _2damageHeight;
                        box.y += _2damageHeight;
                    }
                    make_ground();
                }
            }
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
            _2shootPressed = true;
        } else if (event.key === 'i' || event.key === 'I') {
            _2upPressed = true;
        } else if (event.key === 'o' || event.key === 'O') {
            _2chargePressed = true;
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
            _2shootPressed = false;
        } else if (event.key === 'i' || event.key === 'I') {
            _2upPressed = false;
        } else if (event.key === 'o' || event.key === 'O') {
            _2chargePressed = false;
        } else if (event.key === 'l' || event.key === 'L') {
            _2rightPressed = false;
        }
    });

    gameLoop();

    //minser cooldown så den går ned af
    setInterval(() => {
        if (_1charge_cooldown > 0) {
            _1charge_cooldown = Math.max(0, _1charge_cooldown - 1); // Sørg for, at cooldown ikke går under 0
        }
        if (_1shoot_cooldown > 0) {
            _1shoot_cooldown = Math.max(0, _1shoot_cooldown - 1); //  Sørg for, at cooldown ikke går under 0
        }
        if (_2charge_cooldown > 0) {
            _2charge_cooldown = Math.max(0, _2charge_cooldown - 1); // Sørg for, at cooldown ikke går under 0
        }
        if (_2shoot_cooldown > 0) {
            _2shoot_cooldown = Math.max(0, _2shoot_cooldown - 1); //  Sørg for, at cooldown ikke går under 0
        }

    }, 10);

    // Spiller 1
    function _1update() {

        // Funktion til at opdatere vinklen, når "W" eller "S" tasten holdes nede
        function _1updateVinkel() {
            if (_1player_alive === false) {
                return; // stopper functionen hvis spileren er død
            }
            if (_1upPressed) {
                _1vinkel += 0.5; // Øg vinklen
                _1drawTrajectory();
            }
            if (_1downPressed) {
                _1vinkel -= 0.5; // Mindsk vinklen
                _1drawTrajectory();
            }
            // Begræns vinklen inden for området
            _1vinkel = Math.max(-15, Math.min(88, _1vinkel));
        }

        // Funktion til at affyre et skud
        function _1shoot() {
            if (_1player_alive === false) {
                return; // stopper functionen hvis spileren er død
            }
            if (!_1skud) {
                if (_1shoot_cooldown === 0) {

                    // Beregn skudhastighed og vinkel
                    var _1speed = (_1power / 7) + (_1charge_power / 100); // Brug power til at definere skudhastighed
                    var _1angle = _1vinkel * (Math.PI / 180); // Konverter vinkel til radianer
                    _1velocityX = _1speed * Math.cos(_1angle); // Vandret hastighed
                    _1velocityY = -_1speed * Math.sin(_1angle); // Lodret hastighed
                    _1skud = true; // Angiv, at skuddet er aktivt

                    // Juster skadens højde baseret på "charge power"
                    if (_1charge_power <= 35) {
                        _1damageHeight = 50; // Lav skade
                    }
                    if (_1charge_power >= 35) {
                        _1damageHeight = 65; // Medium skade
                    }
                    if (_1charge_power >= 75) {
                        _1damageHeight = 80; // Høj skade
                    }

                    // Opdater kuglens startposition til midten af tanken
                    _1tankXmiddle = _1tankX + 17;
                    _1tankYmiddle = _1tankY + 27;
                    _1skudX = _1tankXmiddle;
                    _1skudY = _1tankYmiddle;

                    // Nulstil opladning og øg cooldown
                    _1charge_cooldown = 0;
                    _1charge_cooldown += 10;
                    _1charge_power = 0;

                    _1animate(); // Start skudanimation
                }
            }
        }

        // Funktion til at oplade skuddet
        function _1charge() {
            if (_1player_alive === false) {
                return; // stopper functionen hvis spileren er død
            }
            if (!_1skud) {
                if (_1charge_cooldown < 2) { // Begræns opladningens hastighed
                    if (_1charge_power < 100) { // Maksimal opladning
                        _1charge_power += 1; // Øg kraften
                        _1drawTrajectory();
                    }
                }
            }
        }

        // Funktion til at opdatere tankens position
        function _1updateTankPosition() {
            if (_1player_alive === false) {
                return; // Stopper funktionen, hvis spiller 1 er død
            }
            if (_1leftPressed) {
                _1tankX -= _1movementSpeed; // Flyt tanken til venstre
                _1drawTrajectory(); // Tegn nyt skudforløb
                if (_1tankX < 0) _1tankX = 0; // Sørg for, at tanken ikke kommer udenfor skærmens venstre kant
            }
            if (_1rightPressed) {
                _1tankX += _1movementSpeed; // Flyt tanken til højre
                // Tjek for overlap med spiller 2
                if (
                    _1tankX < _2tankX + _2tank.width && // Tanken kolliderer med spiller 2 fra højre
                    _1tankX + _1tank.width > _2tankX && // Tanken kolliderer med spiller 2 fra venstre
                    Math.abs(_1tankY - _2tankY) < _1tank.height // Begge tanker er på samme højde
                ) {
                    _1tankX = _2tankX - _1tank.width; // Flyt spiller 1 til højre for spiller 2
                }
                _1drawTrajectory(); // Tegn nyt skudforløb
                if (_1tankX + _1tank.width > canvas_player.width) {
                    _1tankX = canvas_player.width - _1tank.width; // Sørg for, at tanken ikke kommer udenfor skærmens højre kant
                }
            }
        }

        // Funktion til at opdage kollision mellem kuglen og spiller 2's tank
        function _1collisionDetection() {
            if (_1player_alive === false) {
                return; // stopper functionen hvis spileren er død
            }
            if (
                _1skud && // Kuglen skal være aktiv
                _1skudX + radius > _2tankX && // Kuglens højre kant rører spiller 2
                _1skudX - radius < _2tankX + _2tank.width && // Kuglens venstre kant rører spiller 2
                _1skudY + radius > _2tankY && // Kuglen er under toppen af spiller 2
                _1skudY - radius < _2tankY + _2tank.height // Kuglen er over bunden af spiller 2
            ) {
                // Kollision registreret
                _2playerhp -= 25; // Reducer spiller 2's helbred med 25
                console.log("Player 2 HP:", _2playerhp);

                // Opdater sundhedsbjælken og teksten
                const healthBar = document.querySelector('.p2-health');
                const healthText = document.querySelector('.player2 .health-text');

                healthBar.style.width = `${Math.max(0, _2playerhp)}%`; // Juster sundhedsbjælkens bredde
                healthText.textContent = `${Math.max(0, Math.round(_2playerhp))}%`; // Opdater tekst

                // Tilføj visuel "hit effekt"
                healthBar.classList.add('hit-flash');
                setTimeout(() => {
                    healthBar.classList.remove('hit-flash'); // Fjern effekten efter 500ms
                }, 500);

                if (_2playerhp <= 0) {
                    _2player_alive = false; // Hvis helbredet er 0, er spiller 2 ude
                }

                // Nulstil kuglens tilstand
                _1skud = false;
                _1skudX = _1tankXmiddle; // Nulstil kuglens position
                _1skudY = _1tankYmiddle;
                _1velocityX = 0; // Nulstil hastighed
                _1velocityY = 0;
                _1shoot_cooldown += 50;

                // Ryd kuglens lærred og tegn spillerne igen
                context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);
                context_bullet1.clearRect(0, 0, canvas_bullet1.width, canvas_bullet1.height);
                context_player.drawImage(_1tank, _1tankX, _1tankY);
                context_player.drawImage(_2tank, _2tankX, _2tankY);
            }
        }

        // Funktion til at tegne kuglens bane
        function _1drawTrajectory() {
            if (_1player_alive === false) {
                return; // stopper functionen hvis spileren er død
            }
            _1tankXmiddle = _1tankX + 17;
            _1tankYmiddle = _1tankY + 27;

            context_player.clearRect(0, 0, canvas_player.width, canvas_player.height); // Ryd spillernes lærred
            context_player.drawImage(_1tank, _1tankX, _1tankY);
            context_player.drawImage(_2tank, _2tankX, _2tankY);

            if (!_1skud) {
                //senter skudet i midden af tanken
                _1skudX = _1tankXmiddle;
                _1skudY = _1tankYmiddle;

                var _1speed = (_1power / 7) + (_1charge_power / 100); // Beregn hastighed baseret på kraft
                var _1angle = _1vinkel * (Math.PI / 180); // Konverter vinklen til radianer

                var _1initialVelocityX = _1speed * Math.cos(_1angle);
                var _1initialVelocityY = -_1speed * Math.sin(_1angle);

                var _1trajectoryX = _1skudX;
                var _1trajectoryY = _1skudY;

                // Sæt farve for banen baseret på opladningens kraft
                if (_1charge_power >= 75) {
                    context_arc1.strokeStyle = "red";
                } else if (_1charge_power >= 35) {
                    context_arc1.strokeStyle = "orange";
                } else {
                    context_arc1.strokeStyle = "green";
                }

                context_arc1.lineWidth = 2; // Sæt bane-linjens bredde
                context_arc1.lineCap = "round"; // Rund kant
                context_arc1.beginPath();
                context_arc1.moveTo(_1trajectoryX, _1trajectoryY);

                // Tegn punkterne for banen
                for (let t = 0; t < 30; t += 1) {
                    _1trajectoryX = _1skudX + _1initialVelocityX * t;
                    _1trajectoryY = _1skudY + _1initialVelocityY * t + 0.5 * gravity * Math.pow(t / 10, 2);

                    context_arc1.lineTo(_1trajectoryX, _1trajectoryY);

                    if (_1trajectoryX > canvas_arc1.width
                        || _1trajectoryY > canvas_arc1.height
                        || _1trajectoryY > ground_level) break;
                }
                context_arc1.clearRect(0, 0, canvas_arc1.width, canvas_arc1.height); // Ryd bane-lærredet
                context_arc1.stroke(); // Tegn banen
            }
            make_ground(); // Tegn jorden igen
        }

        // Funktion til animation af skuddet
        function _1animate(timestamp) {
            if (_1player_alive === false) {
                return; // stopper functionen hvis spileren er død
            }
            if (_1skud) {
                if (timestamp - _1lastAnimateTime >= _1animateFrameDuration) {
                    _1lastAnimateTime = timestamp;

                    // Opdater kuglens position baseret på hastighed
                    _1skudX += _1velocityX;
                    _1velocityY += gravity / 100;
                    _1skudY += _1velocityY;

                    // Ryd kuglens lærred og spor
                    context_bullet1.clearRect(0, 0, canvas_bullet1.width, canvas_bullet1.height);
                    context_arc1.clearRect(_1skudX - radius, _1skudY - radius, radius * 2, radius * 2);

                    // Tegn kuglen
                    context_bullet1.beginPath();
                    context_bullet1.arc(_1skudX, _1skudY, radius, 0, 2 * Math.PI, false);
                    context_bullet1.fillStyle = 'blue';
                    context_bullet1.fill();

                    // Kontrollér kollision
                    _1collisionDetection();

                    // Kontrollér, om kuglen er uden for lærredet
                    if (_1skudX > canvas_player.width || _1skudY > canvas_player.height) {
                        _1resetBulletState(); // Nulstil kuglens position og tilstand
                    }
                }
                requestAnimationFrame(_1animate); // Bed om næste frame
            }
        }

        // Hjælpefunktion til at nulstille kuglens tilstand
        function _1resetBulletState() {
            if (_1player_alive === false) {
                return; // stopper functionen hvis spileren er død
            }
            _1skudX = _1tankX + 25;
            _1skudY = _1tankY;
            _1velocityX = 0;
            _1velocityY = 0;
            _1shoot_cooldown += 50;
            _1skud = false;
        }

        // Opdater spiller 1's tilstand
        _1updateVinkel();
        _1updateTankPosition();
        _1drawTrajectory();

        if (_1shootPressed) {
            _1shoot();
        }
        if (_1chargePressed) {
            _1charge();
        }


    }

    // Spiller 2
    //det samme gøre vi for player 2
    function _2update() {


        function _2updateVinkel() {
            if (_2player_alive === false) {
                return;
            }
            if (_2upPressed) {
                _2vinkel -= 0.5;
                _2drawTrajectory();
            }
            if (_2downPressed) {
                _2vinkel += 0.5;
                _2drawTrajectory();
            }
            _2vinkel = Math.max(92, Math.min(195, _2vinkel));
        }

        function _2shoot() {
            if (_2player_alive === false) {
                return;
            }
            if (!_2skud) {
                if (_2shoot_cooldown === 0) {
                    let _2speed = (_2power / 7) + (_2charge_power / 100);
                    let _2angle = _2vinkel * (Math.PI / 180);
                    _2velocityX = _2speed * Math.cos(_2angle);
                    _2velocityY = -_2speed * Math.sin(_2angle);
                    _2skud = true;
                    if (_2charge_power <= 35) {
                        _2damageHeight = 50;
                    }
                    if (_2charge_power >= 35) {
                        _2damageHeight = 65;
                    }
                    if (_2charge_power >= 75) {
                        _2damageHeight = 80;
                    }
                    _2tankXmiddle = _2tankX + 17;
                    _2tankYmiddle = _2tankY + 27;
                    _2skudX = _2tankXmiddle;
                    _2skudY = _2tankYmiddle;
                    _2charge_cooldown = 10;
                    _2charge_power = 0;
                    _2animate();
                }
            }
        }

        function _2charge() {
            if (_2player_alive === false) {
                return;
            }
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
            if (_2player_alive === false) {
                return;
            }

            if (_2leftPressed) {
                _2tankX -= _2movementSpeed;

                if (
                    _2tankX + _2tank.width > _1tankX &&
                    _2tankX < _1tankX + _1tank.width &&
                    Math.abs(_2tankY - _1tankY) < _2tank.height
                ) {
                    _2tankX = _1tankX + _1tank.width;
                }
                _2drawTrajectory();
                if (_2tankX < 0) _2tankX = 0;
            }
            if (_2rightPressed) {
                _2tankX += _2movementSpeed;
                _2drawTrajectory();
                if (_2tankX + _2tank.width > canvas_player.width) {
                    _2tankX = canvas_player.width - _2tank.width;
                }
            }
        }

        function _2collisionDetection() {
            if (_2player_alive === false) {
                return;
            }
            if (
                _2skud &&
                _2skudX + radius > _1tankX &&
                _2skudX - radius < _1tankX + _1tank.width &&
                _2skudY + radius > _1tankY &&
                _2skudY - radius < _1tankY + _1tank.height
            ) {
                _1playerhp -= 25;
                console.log("Player 1 HP:", _1playerhp);
                const healthBar = document.querySelector('.p1-health');
                const healthText = document.querySelector('.player1 .health-text');
                healthBar.style.width = `${Math.max(0, _1playerhp)}%`;
                healthText.textContent = `${Math.max(0, Math.round(_1playerhp))}%`;
                healthBar.classList.add('hit-flash');
                setTimeout(() => {
                    healthBar.classList.remove('hit-flash');
                }, 500);
                if (_1playerhp <= 0) {
                    _1player_alive = false;
                }
                _2skud = false;
                _2skudX = _2tankX + 25;
                _2skudY = _2tankY;
                _2velocityX = 0;
                _2velocityY = 0;
                _2shoot_cooldown += 50;
                context_player.clearRect(0, 0, canvas_player.width, canvas_player.height);
                context_bullet2.clearRect(0, 0, canvas_bullet2.width, canvas_bullet2.height);
                context_player.drawImage(_1tank, _1tankX, _1tankY);
                context_player.drawImage(_2tank, _2tankX, _2tankY);
            }
        }

        function _2drawTrajectory() {
            if (_2player_alive === false) {
                return;
            }
            _2tankXmiddle = _2tankX + 17;
            _2tankYmiddle = _2tankY + 27;
            context_player.clearRect(0, 0, canvas_arc2.width, canvas_arc2.height);
            context_player.drawImage(_1tank, _1tankX, _1tankY);
            context_player.drawImage(_2tank, _2tankX, _2tankY);
            if (!_2skud) {
                _2skudX = _2tankXmiddle;
                _2skudY = _2tankYmiddle;
                context_arc2.clearRect(0, 0, canvas_arc2.width, canvas_arc2.height);
                let _2speed = (_2power / 7) + (_2charge_power / 100);
                let _2angle = _2vinkel * (Math.PI / 180);
                let _2initialVelocityX = _2speed * Math.cos(_2angle);
                let _2initialVelocityY = -_2speed * Math.sin(_2angle);
                let _2trajectoryX = _2skudX;
                let _2trajectoryY = _2skudY;
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
                for (let t = 0; t < 30; t += 1) {
                    _2trajectoryX = _2skudX + _2initialVelocityX * t;
                    _2trajectoryY = _2skudY + _2initialVelocityY * t + 0.5 * gravity * Math.pow(t / 10, 2);
                    context_arc2.lineTo(_2trajectoryX, _2trajectoryY);
                    if (_2trajectoryX > canvas_arc2.width || _2trajectoryY > ground_level) break;
                }
                context_arc2.stroke();
            }
            make_ground();
        }

        function _2animate(timestamp) {
            if (_2player_alive === false) {
                return;
            }
            if (_2skud) {
                if (timestamp - _2lastAnimateTime >= _2animateFrameDuration) {
                    _2lastAnimateTime = timestamp;
                    _2skudX += _2velocityX;
                    _2velocityY += gravity / 100;
                    _2skudY += _2velocityY;
                    context_bullet2.clearRect(0, 0, canvas_bullet2.width, canvas_bullet2.height);
                    context_arc2.clearRect(_2skudX - radius, _2skudY - radius, radius * 2, radius * 2);
                    context_bullet2.beginPath();
                    context_bullet2.arc(_2skudX, _2skudY, radius, 0, 2 * Math.PI, false);
                    context_bullet2.fillStyle = 'red';
                    context_bullet2.fill();
                    _2collisionDetection();
                    if (_2skudX > canvas_player.width || _2skudY > canvas_player.height) {
                        _2resetBulletState();
                    }
                }
                requestAnimationFrame(_2animate);
            }
        }

        function _2resetBulletState() {
            if (_2player_alive === false) {
                return;
            }
            _2skudX = _2tankX + 25;
            _2skudY = _2tankY;
            _2velocityX = 0;
            _2velocityY = 0;
            _2shoot_cooldown += 50;
            _2skud = false;
        }

        _2updateVinkel();
        _2updateTankPosition();
        _2drawTrajectory();
        if (_2shootPressed === true) {
            _2shoot();
        }
        if (_2chargePressed === true) {
            _2charge();
        }
    }


// Funktion til at starte spillets hovedløkke
    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastTime; // Beregn tid siden sidste frame i millisekunder
        if (deltaTime >= frameDuration) { // Kontrollér, om det er tid til at opdatere spiltilstanden
            lastTime = timestamp; // Opdater tiden for sidste frame

            // Opdater spiltilstand og gengiv spillet
            _1update(deltaTime / 1000); // Opdater spiller 1's tilstand, passér `dt` i sekunder
            _2update(deltaTime / 1000); // Opdater spiller 2's tilstand, passér `dt` i sekunder
        }

        // Planlæg næste frame
        requestAnimationFrame(gameLoop);


        // Check for winner
        if (!_1player_alive) {
            console.log("Player 1 is dead");
            drawWinner(player2WinsImage); // Display "Player 2 Wins" image
            return; // Stop the game loop
        }
        if (!_2player_alive) {
            console.log("Player 2 is dead");
            drawWinner(player1WinsImage); // Display "Player 1 Wins" image
            return; // Stop the game loop
        }
    }

    // Function til at tejen et bilde der viser hvilken spiler der vinder
    function drawWinner(winnerImage) {

        context_player.clearRect(0, 0, canvas_player.width, canvas_player.height); // Clear the canvas
        context_player.drawImage(winnerImage, canvas_player.width / 2 - 200, canvas_player.height / 2 - 100, 400, 200);

        // Set up text properties
        context_player.font = "35px Arial";
        context_player.fillStyle = "black"; // Text color
        context_player.textAlign = "center";

        // Add text below the image
        const text = "reload to play again";
        context_player.fillText(text, canvas_player.width / 2, canvas_player.height / 2 + 130, ); // Position text below the image
    }

// Start spillets hovedløkke
    gameLoop();}

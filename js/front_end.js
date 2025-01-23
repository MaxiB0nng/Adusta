document.addEventListener('keydown', function(e) {
    const keys = {
        'w':'p1-up', 'a':'p1-left', 's':'p1-down', 'd':'p1-right', 'q':'p1-charge', 'e':'p1-shoot',
        'i':'p2-up', 'j':'p2-left', 'k':'p2-down', 'l':'p2-right', 'o':'p2-charge', 'u':'p2-shoot'
    };
    if (keys[e.key]) {
        document.querySelector(`.${keys[e.key]}`).classList.add('key-press');
    }
});

document.addEventListener('keyup', function(e) {
    const keys = {
        'w':'p1-up', 'a':'p1-left', 's':'p1-down', 'd':'p1-right', 'q':'p1-charge', 'e':'p1-shoot',
        'i':'p2-up', 'j':'p2-left', 'k':'p2-down', 'l':'p2-right', 'o':'p2-charge', 'u':'p2-shoot'
    };
    if (keys[e.key]) {
        document.querySelector(`.${keys[e.key]}`).classList.remove('key-press');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Audio setup
    const moveSound = document.getElementById('moveSound');
    const movementKeys = ['a', 'd', 'j', 'l'];
    let isMoving = false;
    let fadeInterval;

    // Cloud setup
    const cloudPaths = [
        './assets/img/cloud1.png',
        './assets/img/cloud2.png',
        './assets/img/cloud3.png',
        './assets/img/cloud4.png'
    ];

    function randomizeClouds() {
        const root = document.documentElement;
        const cloudCount = 4;

        for (let i = 1; i <= cloudCount; i++) {
            const size = Math.floor(Math.random() * 20 + 25);
            const posY = Math.floor(Math.random() * 60 + 10);
            const speed = Math.floor(Math.random() * 50 + 150);
            const startPos = Math.floor(Math.random() * 100 - 50);
            const opacity = (Math.random() * 0.2 + 0.3).toFixed(2);
            
            const cloudLayer = document.querySelector(`.cloud-layer${i}`);
            const randomCloudIndex = Math.floor(Math.random() * cloudPaths.length);
            
            root.style.setProperty(`--cloud${i}-size`, `${size}% auto`);
            root.style.setProperty(`--cloud${i}-position-y`, `${posY}%`);
            root.style.setProperty(`--cloud-speed-${i}`, `${speed}s`);
            root.style.setProperty(`--cloud-start-${i}`, `${startPos}%`);
            root.style.setProperty(`--cloud${i}-opacity`, opacity);
            cloudLayer.style.backgroundImage = `url('${cloudPaths[randomCloudIndex]}')`;
        }
    }

    function fadeVolume(targetVolume, duration, onComplete) {
        clearInterval(fadeInterval);
        const step = (targetVolume - moveSound.volume) / (duration / 50);
        fadeInterval = setInterval(() => {
            moveSound.volume = Math.min(Math.max(moveSound.volume + step, 0), 1);
            if ((step > 0 && moveSound.volume >= targetVolume) || 
                (step < 0 && moveSound.volume <= targetVolume)) {
                clearInterval(fadeInterval);
                if (onComplete) onComplete();
            }
        }, 50);
    }

    // Audio keydown event
    document.addEventListener('keydown', (e) => {
        if (movementKeys.includes(e.key.toLowerCase()) && !isMoving) {
            isMoving = true;
            moveSound.currentTime = Math.random() * 4;
            moveSound.volume = 0;
            moveSound.play();
            fadeVolume(1, 500);
        }
    });

    // Audio keyup event
    document.addEventListener('keyup', (e) => {
        if (movementKeys.includes(e.key.toLowerCase())) {
            const anyKeyPressed = movementKeys.some(key => 
                key !== e.key.toLowerCase() && key.isPressed
            );
            if (!anyKeyPressed) {
                isMoving = false;
                fadeVolume(0, 500, () => {
                    moveSound.pause();
                    moveSound.currentTime = 0;
                });
            }
        }
    });

    // Initialize random clouds
    randomizeClouds();
    
    // Randomize clouds periodically
    setInterval(randomizeClouds, 30000);
});
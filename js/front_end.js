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
    
        // Initial fade out
        for (let i = 1; i <= cloudCount; i++) {
            const cloudLayer = document.querySelector(`.cloud-layer${i}`);
            cloudLayer.style.transition = 'all 1s ease-in-out';
            cloudLayer.style.opacity = '0';
        }
    
        setTimeout(() => {
            for (let i = 1; i <= cloudCount; i++) {
                const size = Math.floor(Math.random() * 20 + 25);
                // Divide sky into 4 zones (0-8%, 8-16%, 16-24%, 24-32%)
                const baseHeight = (i - 1) * 8;
                const posY = Math.floor(Math.random() * 8 + baseHeight);
                const speed = Math.floor(Math.random() * 50 + 150);
                const startPos = Math.floor(Math.random() * 100 - 50);
                const opacity = (Math.random() * 0.2 + 0.3).toFixed(2);
                
                const cloudLayer = document.querySelector(`.cloud-layer${i}`);
                const randomCloudIndex = Math.floor(Math.random() * cloudPaths.length);
                
                cloudLayer.style.transition = 'all 1s ease-in-out';
                
                setTimeout(() => {
                    root.style.setProperty(`--cloud${i}-size`, `${size}% auto`);
                    root.style.setProperty(`--cloud${i}-position-y`, `${posY}%`);
                    root.style.setProperty(`--cloud-speed-${i}`, `${speed}s`);
                    root.style.setProperty(`--cloud-start-${i}`, `${startPos}%`);
                    root.style.setProperty(`--cloud${i}-opacity`, opacity);
                    cloudLayer.style.backgroundImage = `url('${cloudPaths[randomCloudIndex]}')`;
                    cloudLayer.style.opacity = opacity;
                }, i * 150);
            }
        }, 800);
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

    // Initialize and set interval for updates
randomizeClouds();
setInterval(randomizeClouds, 30000);
});
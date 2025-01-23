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
});
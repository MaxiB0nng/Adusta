document.addEventListener('keydown', function(e) {
    const keys = {
        'w':'p1-up', 'a':'p1-left', 's':'p1-down', 'd':'p1-right', 'q':'p1-charge', 'e':'p1-shoot',
        'i':'p2-up', 'j':'p2-left', 'k':'p2-down', 'l':'p2-right', 'u':'p2-charge', 'o':'p2-shoot'
    };
    if (keys[e.key]) {
        document.querySelector(`.${keys[e.key]}`).classList.add('key-press');
    }
});

document.addEventListener('keyup', function(e) {
    const keys = {
        'w':'p1-up', 'a':'p1-left', 's':'p1-down', 'd':'p1-right', 'q':'p1-charge', 'e':'p1-shoot',
        'i':'p2-up', 'j':'p2-left', 'k':'p2-down', 'l':'p2-right', 'u':'p2-charge', 'o':'p2-shoot'
    };
    if (keys[e.key]) {
        document.querySelector(`.${keys[e.key]}`).classList.remove('key-press');
    }
});

/* audio */
document.addEventListener('DOMContentLoaded', () => {
    const moveSound = document.getElementById('moveSound');
    const movementKeys = ['a', 'd', 'j', 'l'];
    let isMoving = false;
    let fadeInterval;

    // Function to fade volume
    function fadeVolume(targetVolume, duration, onComplete) {
        clearInterval(fadeInterval);
        const step = (targetVolume - moveSound.volume) / (duration / 50); // 50ms per step
        fadeInterval = setInterval(() => {
            moveSound.volume = Math.min(Math.max(moveSound.volume + step, 0), 1);
            if ((step > 0 && moveSound.volume >= targetVolume) || 
                (step < 0 && moveSound.volume <= targetVolume)) {
                clearInterval(fadeInterval);
                if (onComplete) onComplete();
            }
        }, 50);
    }

    // Keydown event to start sound
    document.addEventListener('keydown', (e) => {
        if (movementKeys.includes(e.key.toLowerCase()) && !isMoving) {
            isMoving = true;
            moveSound.currentTime = Math.random() * 4; // Random start time
            moveSound.volume = 0; // Start at 0 volume for smooth fade-in
            moveSound.play();
            fadeVolume(1, 500); // Fade in over 500ms
        }
    });

    // Keyup event to stop sound
    document.addEventListener('keyup', (e) => {
        if (movementKeys.includes(e.key.toLowerCase())) {
            const anyKeyPressed = movementKeys.some(key => 
                key !== e.key.toLowerCase() && key.isPressed
            );
            if (!anyKeyPressed) {
                isMoving = false;
                fadeVolume(0, 500, () => {
                    moveSound.pause();
                    moveSound.currentTime = 0; // Reset to start
                }); // Fade out over 500ms
            }
        }
    });
});

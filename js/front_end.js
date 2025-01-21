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
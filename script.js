// script.js

const soundToggle = document.getElementById('sound-toggle');
const breathingCircle = document.querySelector('.breathing-circle');

let soundEnabled = false;
let audioContext;
let oscillator;
let gainNode;

// Function to initialize the audio context
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Function to play a soft tone
function playSound() {
    if (!soundEnabled || !audioContext) return;

    // Create an oscillator and a gain node
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    // Connect the oscillator to the gain node and the gain node to the output
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Set the oscillator type and frequency for a soft sound
    oscillator.type = 'sine'; // sine wave is smooth and gentle
    oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime); // C4

    // Control the volume with the gain node
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 4); // Fade in
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 8); // Fade out

    // Start and stop the oscillator
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 8);
}

// Toggle sound on/off
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        initAudio();
        soundToggle.textContent = 'Sound ON';
        playSound();
    } else {
        soundToggle.textContent = 'Sound OFF';
        if (oscillator) {
            oscillator.stop();
        }
    }
});

// Sync sound with animation
breathingCircle.addEventListener('animationiteration', () => {
    if (soundEnabled) {
        playSound();
    }
});
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

// Function to play a soft, melodic sequence
function playSound() {
    if (!soundEnabled || !audioContext) return;

    const now = audioContext.currentTime;
    const attackTime = 0.5;
    const releaseTime = 4; // Corresponds to the animation breath in
    const decayTime = 4; // Corresponds to the animation breath out

    // Frequencies for a C Major 7 arpeggio (C, E, G, B) - very calming
    const frequencies = [261.63, 329.63, 392.00, 493.88];

    // Create a gain node to control the overall volume
    const masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.1, now + attackTime); // Fade in
    masterGain.gain.linearRampToValueAtTime(0, now + releaseTime + decayTime); // Fade out over the whole duration
    masterGain.connect(audioContext.destination);

    // Play a sequence of notes
    frequencies.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        const noteGain = audioContext.createGain();
        noteGain.gain.setValueAtTime(0, now);

        // Schedule the note to play at a specific time in the sequence
        const noteStartTime = now + i * (releaseTime / frequencies.length);
        const noteEndTime = noteStartTime + (releaseTime / frequencies.length);
        
        noteGain.gain.linearRampToValueAtTime(1, noteStartTime + 0.1);
        noteGain.gain.linearRampToValueAtTime(0, noteEndTime);

        osc.connect(noteGain);
        noteGain.connect(masterGain);
        osc.start(noteStartTime);
        osc.stop(noteEndTime + 1); // Stop after it has faded out
    });
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
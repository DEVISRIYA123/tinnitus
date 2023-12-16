const sampleRate = 44100;

const sineWaveArray = new Float32Array(sampleRate);

let hz = 20;
let audioContext, source, isIncreasing = false;

for (let i = 0; i < sineWaveArray.length; i++) {
    sineWaveArray[i] = Math.sin((i * Math.PI * 8) / hz);
}

function setupAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate });
    const audioBuffer = audioContext.createBuffer(1, sineWaveArray.length, sampleRate);
    audioBuffer.copyToChannel(sineWaveArray, 0);
    source = audioContext.createBufferSource();
    source.connect(audioContext.destination);
    source.buffer = audioBuffer;
    source.loop = true;
}

function playSineWave() {
    updateFrequencyLabel();
    if (!audioContext) {
        setupAudio();
    }

    source.start();
    console.log('Playing');
}

function stopSound() {
    if (source) {
        source.stop();
        console.log('Stopped');
    }
}

function toggleIncreaseFrequency() {
    if (isIncreasing) {
        source.playbackRate.setValueAtTime(1, audioContext.currentTime);
        console.log('Stopped Increase Frequency');
    } else {
        source.playbackRate.linearRampToValueAtTime(2, audioContext.currentTime + 1);
        console.log('Started Increase Frequency');
    }

    isIncreasing = !isIncreasing;


}

function updateFrequencyLabel() {
    const frequencySlider = document.getElementById('frequencySlider');
    const frequencyLabel = document.getElementById('frequencyLabel');
    const frequencyValue = frequencySlider.value;
    frequencyLabel.textContent = `${frequencyValue} Hz`;

    hz = frequencyValue;
    setupAudio();
}

document.getElementById('frequencySlider').addEventListener('input', updateFrequencyLabel);
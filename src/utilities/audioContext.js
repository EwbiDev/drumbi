let audioCtx;
let unlocked = false;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function unlockAudioCtx() {
  if (!unlocked) {
    const buffer = audioCtx.createBuffer(1, 1, 22050);
    const node = audioCtx.createBufferSource();
    node.buffer = buffer;
    node.start();
  }
}

export { getAudioCtx, unlockAudioCtx };

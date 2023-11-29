let audioCtx;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export { getAudioCtx };

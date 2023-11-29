import { getAudioCtx } from "./audioContext";
import kickPath from "@assets/audio/kick.wav";

const audioCtx = getAudioCtx();
let kickBuffer = null;

async function loadBuffer() {
  if (!kickBuffer) {
    const response = await fetch(kickPath);
    const audioData = await response.arrayBuffer();
    kickBuffer = await audioCtx.decodeAudioData(audioData);
  }
}

function scheduler() {
  loadBuffer();
  scheduleNote();
}

async function scheduleNote() {
  const source = audioCtx.createBufferSource();
  source.buffer = kickBuffer;
  source.connect(audioCtx.destination);

  source.start();
}

export { scheduler };

import { getAudioCtx } from "./audioContext";

const audioCtx = getAudioCtx();

function scheduler() {
  console.log("audioCtx", audioCtx.currentTime);
}

export { scheduler };

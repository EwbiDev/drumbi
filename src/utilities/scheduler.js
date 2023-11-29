import { getAudioCtx } from "./audioContext";
import kickPath from "@assets/audio/kick.wav";

const lookahead = 0.1;
const audioCtx = getAudioCtx();
let kickBuffer = null;

let startTime = null;

let nextNoteTime = null;

const sequencerTimeLength = 0.395;
const sequencerQueue = [
  {
    time: 0,
  },
  {
    time: sequencerTimeLength / 6,
  },
  {
    time: sequencerTimeLength / 3,
  },
  {
    time: (sequencerTimeLength / 3) * 2,
  },
];
let sequencerQueueIndex = 0;

let sequencerIterations = 0;

async function loadBuffer() {
  if (!kickBuffer) {
    const response = await fetch(kickPath);
    const audioData = await response.arrayBuffer();
    kickBuffer = await audioCtx.decodeAudioData(audioData);
  }
}

function scheduler() {
  loadBuffer();
  setStartTime();

  while (nextNoteTime < audioCtx.currentTime + lookahead) {
    scheduleNote(nextNoteTime);
    setNextNote();
  }
}

async function scheduleNote(time) {
  const source = audioCtx.createBufferSource();
  source.buffer = kickBuffer;
  source.connect(audioCtx.destination);

  source.start(time);
}

function setNextNote() {
  const isLastNote = sequencerQueueIndex === sequencerQueue.length - 1;
  if (isLastNote) {
    sequencerIterations++;
  }
  sequencerQueueIndex = (sequencerQueueIndex + 1) % sequencerQueue.length;

  const prevTime =
    sequencerQueue[
      (sequencerQueueIndex + sequencerQueue.length - 1) % sequencerQueue.length
    ].time;
  const nextTime = sequencerQueue[sequencerQueueIndex].time;

  nextNoteTime += nextTime
    ? nextTime - prevTime
    : sequencerTimeLength - prevTime;
}

function setStartTime() {
  if (!startTime) {
    nextNoteTime = startTime = audioCtx.currentTime + 0.1;
  }
}

function clearStartTime() {
  startTime = null;
}

function clearSequencer() {
  sequencerIterations = 0;
  sequencerQueueIndex = 0;
}

function clearScheduler() {
  clearStartTime();
  clearSequencer();
}

export { clearScheduler, scheduler };

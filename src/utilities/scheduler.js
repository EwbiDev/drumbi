import { getAudioCtx } from "./audioContext";
import kickPath from "@assets/audio/kick.wav";

const lookahead = 0.1;
const audioCtx = getAudioCtx();
let kickBuffer = null;

let startTime = null;

let lastNoteTime = 0;

const sequencerQueue = [
  {
    time: 0,
  },
  {
    time: 0.25,
  },
  {
    time: 0.5,
  },
  {
    time: 0.75,
  },
];
let sequencerQueueIndex = 0;

const sequencerTimeLength = 2;
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

  const nextNote = sequencerQueue[sequencerQueueIndex];

  const newTime = calcScheduledTime(nextNote.time);

  console.log("newTime", newTime);

  while (lastNoteTime < audioCtx.currentTime + lookahead) {
    scheduleNote(newTime);
    setNextNote();
  }
}

async function scheduleNote(time) {
  const source = audioCtx.createBufferSource();
  source.buffer = kickBuffer;
  source.connect(audioCtx.destination);

  source.start(time);

  setLastNoteTime(time);
}

function setNextNote() {
  sequencerQueueIndex = (sequencerQueueIndex + 1) % sequencerQueue.length;
  if (sequencerQueueIndex === 0) sequencerIterations++;
}

function setStartTime() {
  if (!startTime) {
    startTime = audioCtx.currentTime + 0.1;
  }
}

function clearStartTime() {
  startTime = null;
}

function clearSequencer() {
  sequencerIterations = 0;
  sequencerQueueIndex = 0;
}

function setLastNoteTime(time) {
  lastNoteTime = time;
}

function calcScheduledTime(noteTime) {
  return noteTime + sequencerTimeLength * sequencerIterations + startTime;
}

function clearScheduler() {
  clearStartTime();
  clearSequencer();
}

export { clearScheduler, scheduler };

import { getAudioCtx } from "./audioContext";
import kickPath from "@assets/audio/kick.wav";

let audioCtx; // context must be generated after user action

const lookahead = 0.1;
let kickBuffer = null;

let startTime = null;

let nextNoteTime = null;

const sequencerTimeLength = 0.4085;
const sequencerQueue = [
  {
    time: 0,
    path: "", // TODO: set paths in queue
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

async function loadBuffer() {
  // TODO: to parametrize
  if (!kickBuffer) {
    const response = await fetch(kickPath);
    const audioData = await response.arrayBuffer();
    kickBuffer = await audioCtx.decodeAudioData(audioData);
  }
}

function scheduler() {
  audioCtx = getAudioCtx();
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
  const curQIdx = sequencerQueueIndex;
  const nextQIdx = (sequencerQueueIndex =
    (sequencerQueueIndex + 1) % sequencerQueue.length);

  const prevTime = sequencerQueue[curQIdx].time;
  const nextTime = sequencerQueue[nextQIdx].time;

  if (nextQIdx === 0) {
    nextNoteTime += sequencerTimeLength - prevTime;
  } else {
    nextNoteTime += nextTime - prevTime;
  }
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
  sequencerQueueIndex = 0;
}

function clearScheduler() {
  clearStartTime();
  clearSequencer();
}

export { clearScheduler, scheduler };

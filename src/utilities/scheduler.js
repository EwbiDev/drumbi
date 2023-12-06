import { getAudioCtx } from "./audioContext";

import kickPath from "@assets/audio/kick.wav";
import snarePath from "@assets/audio/snare.wav";
import hiHatClosedPath from "@assets/audio/hiHatClosed.wav";

let audioCtx; // context must be generated after user action
let bufferLoading = false;
let bufferLoaded = false;

const audioBuffer = {
  kick: {
    path: kickPath,
  },
  snare: {
    path: snarePath,
  },
  hiHatClosed: {
    path: hiHatClosedPath,
  },
};

const lookahead = 0.1;

let startTime = null;

let nextNoteTime = null;

const sequencerTimeLength = 2.2;
const t = sequencerTimeLength;
const sequencerQueue = [
  {
    time: 0,
    audio: "hiHatClosed",
  },
  {
    time: 0,
    audio: "kick",
  },
  {
    time: (t / 4) * 1,

    audio: "hiHatClosed",
  },
  {
    time: (t / 4) * 2,

    audio: "snare",
  },
  {
    time: (t / 4) * 2,

    audio: "hiHatClosed",
  },
  {
    time: (t / 4) * 3,

    audio: "hiHatClosed",
  },
];
let sequencerQueueIndex = 0;

async function loadBuffer() {
  if (!bufferLoaded && !bufferLoading) {
    bufferLoading = true;
    const promises = [];
    for (const key in audioBuffer) {
      promises.push(fetchAudioFiles(key));
    }
    await Promise.all(promises);
    bufferLoaded = true;
  }
}

async function fetchAudioFiles(key) {
  const track = audioBuffer[key];
  if (!track.buffer) {
    const response = await fetch(track.path);
    const audioData = await response.arrayBuffer();
    return (track.buffer = await audioCtx.decodeAudioData(audioData));
  }
}

function scheduler() {
  audioCtx = getAudioCtx();
  loadBuffer();

  if (!bufferLoaded) return;

  setStartTime();

  while (nextNoteTime < audioCtx.currentTime + lookahead) {
    const nextAudio = sequencerQueue[sequencerQueueIndex].audio;
    scheduleNote(nextNoteTime, audioBuffer[nextAudio].buffer);
    setNextNote();
  }
}

async function scheduleNote(time, buffer) {
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
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
    nextNoteTime = startTime = audioCtx.currentTime + lookahead;
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

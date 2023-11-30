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

const sequencerTimeLength = 4.4;
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
    time: t / 16,
    audio: "hiHatClosed",
  },
  {
    time: (t / 16) * 2,

    audio: "hiHatClosed",
  },
  {
    time: (t / 16) * 3,

    audio: "hiHatClosed",
  },
  {
    time: (t / 16) * 4,

    audio: "snare",
  },
  {
    time: (t / 16) * 4,

    audio: "hiHatClosed",
  },
  {
    time: (t / 16) * 5,

    audio: "hiHatClosed",
  },
  {
    time: (t / 48) * 18,

    audio: "hiHatClosed",
  },
  {
    time: (t / 48) * 20,

    audio: "hiHatClosed",
  },
  {
    time: (t / 48) * 22,

    audio: "hiHatClosed",
  },
  {
    time: (t / 16) * 8,
    audio: "hiHatClosed",
  },
  {
    time: (t / 16) * 8,
    audio: "kick",
  },
  {
    time: (t / 16) * 9,
    audio: "hiHatClosed",
  },
  {
    time: (t / 16) * 10,

    audio: "hiHatClosed",
  },
  {
    time: (t / 16) * 11,

    audio: "hiHatClosed",
  },
  {
    time: (t / 16) * 12,

    audio: "snare",
  },
  {
    time: (t / 16) * 12,

    audio: "hiHatClosed",
  },
  {
    time: (t / 16) * 13,

    audio: "hiHatClosed",
  },
  {
    time: (t / 16) * 13,

    audio: "kick",
  },
  {
    time: (t / 32) * 27,

    audio: "kick",
  },
  {
    time: (t / 128) * 112,

    audio: "hiHatClosed",
  },
  {
    time: (t / 128) * 113,

    audio: "hiHatClosed",
  },
  {
    time: (t / 128) * 114,

    audio: "hiHatClosed",
  },
  {
    time: (t / 128) * 115,

    audio: "hiHatClosed",
  },
  {
    time: (t / 128) * 116,

    audio: "hiHatClosed",
  },
  {
    time: (t / 128) * 117,

    audio: "hiHatClosed",
  },
  {
    time: (t / 128) * 118,

    audio: "hiHatClosed",
  },
  {
    time: (t / 128) * 119,

    audio: "hiHatClosed",
  },
  {
    time: (t / 16) * 15,

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

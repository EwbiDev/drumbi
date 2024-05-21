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

let nextBeatTime = null;

let sequencerBpm = 120;
const beatCount = 16;
let sequencerTimeLength = (60 / sequencerBpm) * beatCount;

const sequencerQueue = [
  [["hiHatClosed", "kick"]],
  [["hiHatClosed"]],
  [["hiHatClosed", "snare"]],
  [["hiHatClosed"]],
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

  while (nextBeatTime < audioCtx.currentTime + lookahead) {
    const nextBeat = sequencerQueue[sequencerQueueIndex];
    const subBeatLength = sequencerTimeLength / beatCount / nextBeat.length;

    nextBeat.forEach((subBeat, subBeatIdx) => {
      const subBeatTime = nextBeatTime + subBeatLength * subBeatIdx;
      subBeat.forEach((note) => {
        scheduleNote(subBeatTime, audioBuffer[note].buffer);
      });
    });

    setNextNote();
  }
  return (sequencerQueueIndex + beatCount - 1) % beatCount;
}

async function scheduleNote(time, buffer) {
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);

  source.start(time);
}

function setNextNote() {
  nextBeatTime += 60 / sequencerBpm;

  sequencerQueueIndex = (sequencerQueueIndex + 1) % sequencerQueue.length;
}

function setStartTime() {
  if (!startTime) {
    nextBeatTime = startTime = audioCtx.currentTime + lookahead;
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

function setSequencerBpm(bpm) {
  sequencerBpm = bpm;
  sequencerTimeLength = (60 / sequencerBpm) * beatCount;
}

function setSequencerQueue(queue) {
  queue.forEach((beat, beatIdx) => {
    sequencerQueue[beatIdx] = beat;
  });
}

export {
  clearScheduler,
  scheduler,
  sequencerQueueIndex,
  setSequencerBpm,
  setSequencerQueue,
  sequencerBpm,
};

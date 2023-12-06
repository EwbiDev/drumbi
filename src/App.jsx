import { createContext, useEffect, useRef, useState } from "react";
import "./App.css";
import Track from "./components/Track";
import { trackScaffold, generateQueue } from "@utilities/audio";
import PlayBackControls from "./components/PlayBackControls";

const PlayContext = createContext(0);

import {
  clearScheduler,
  scheduler,
  sequencerBpm,
  setSequencerBpm,
  setSequencerQueue,
} from "@utilities/scheduler";

function loadData() {
  const savedSequencerData = localStorage.getItem("sequencerData");
  if (savedSequencerData) {
    return JSON.parse(savedSequencerData);
  }
  return trackScaffold(1, 4);
}

const interval = 25; // milliseconds
let intervalId = null;

function stopSchedulerInterval() {
  clearInterval(intervalId);
  clearScheduler();
}

function App() {
  const [sequencerData, setSequencerData] = useState(loadData);

  const [playBack, setPlayBack] = useState(false);
  const [playHeadPos, setPlayHeadPos] = useState(0);

  const [bpm, setBpm] = useState(sequencerBpm);
  const [beatCount, setBeatCount] = useState(4);

  useEffect(() => {
    function startSchedulerInterval() {
      intervalId = setInterval(() => {
        const queueIndex = scheduler();
        setPlayHeadPos(queueIndex);
      }, interval);
    }

    if (playBack) {
      startSchedulerInterval();
    } else {
      stopSchedulerInterval();
    }
  }, [playBack]);

  useEffect(() => {
    setSequencerBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    setSequencerQueue(generateQueue(sequencerData, beatCount));
  }, [sequencerData, beatCount]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <main className="container flex h-min flex-col items-center gap-4 rounded-xl bg-slate-700 p-8">
        <PlayBackControls
          bpm={bpm}
          setBpm={setBpm}
          playBack={playBack}
          setPlayBack={setPlayBack}
        />
        <PlayContext.Provider
          value={{ playBack, playHeadPos, sequencerData, setSequencerData }}
        >
          <div className="rounded-xl bg-cyan-900 p-4">
            {sequencerData.map((track) => (
              <Track key={`track-${track.trackName}`} track={track} />
            ))}
          </div>
        </PlayContext.Provider>
      </main>
    </div>
  );
}

export { App, PlayContext };

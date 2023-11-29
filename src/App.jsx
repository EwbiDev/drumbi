import { createContext, useEffect, useRef, useState } from "react";
import "./App.css";
import Track from "./components/Track";
import { calcBeatInterval } from "@utilities/bpm";
import { nextPlayHeadPos } from "@utilities/playHead";
import { trackScaffold } from "@utilities/audio";
import PlayBackControls from "./components/PlayBackControls";

import { getAudioCtx } from "@utilities/audioContext";
import {
  startSchedulerInterval,
  stopSchedulerInterval,
} from "@utilities/schedulerInterval";

const PlayContext = createContext(0);

function loadData() {
  const savedSequencerData = localStorage.getItem("sequencerData");
  if (savedSequencerData) {
    return JSON.parse(savedSequencerData);
  }
  return trackScaffold(4, 4);
}

function App() {
  const [sequencerData, setSequencerData] = useState(loadData());

  const [playBack, setPlayBack] = useState(false);
  const [playHeadPos, setPlayHeadPos] = useState(3);
  const playHeadInterval = useRef();

  const [barNum, setBarNum] = useState(4);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [bpm, setBpm] = useState(180);

  const totalBeatNum = barNum * beatsPerBar;

  useEffect(() => {
    if (playBack) {
      startSchedulerInterval();
    } else {
      stopSchedulerInterval();
    }
  }, [playBack]);

  useEffect(() => {
    // clear any previous intervals while live-editing...
    return () => clearInterval(playHeadInterval.current);
  }, []);

  useEffect(() => {
    localStorage.setItem("sequencerData", JSON.stringify(sequencerData));
  }, [sequencerData]);

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

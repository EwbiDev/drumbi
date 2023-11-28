import { createContext, useEffect, useRef, useState } from "react";
import "./App.css";
import Track from "./components/Track";
import { calcBeatInterval } from "@utilities/bpm";
import { nextPlayHeadPos } from "@utilities/playHead";
import { trackScaffold } from "@utilities/audio";

const PlayContext = createContext(0);

function App() {
  const [sequencerData, setSequencerData] = useState(trackScaffold(4, 4));

  const [playBack, setPlayBack] = useState(false);
  const [playHeadPos, setPlayHeadPos] = useState(0);
  const playHeadInterval = useRef();

  const [barNum, setBarNum] = useState(4);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [bpm] = useState(180);

  const totalBeatNum = barNum * beatsPerBar;

  useEffect(() => {
    // clear any previous intervals while live-editing...
    return () => clearInterval(playHeadInterval.current);
  }, []);

  useEffect(() => {
    if (playBack) {
      playHeadInterval.current = setInterval(() => {
        setPlayHeadPos((playHeadPos) =>
          nextPlayHeadPos(playHeadPos, totalBeatNum),
        );
      }, calcBeatInterval(bpm));
    } else clearInterval(playHeadInterval.current);
  }, [playBack]);

  return (
    <div>
      <PlayContext.Provider
        value={{ playBack, playHeadPos, sequencerData, setSequencerData }}
      >
        <div>
          {sequencerData.map((track) => (
            <Track key={`track-${track.trackName}`} track={track} />
          ))}
        </div>
      </PlayContext.Provider>
      <button onClick={() => setPlayBack(!playBack)}>
        {playBack ? "pause" : "play"}
      </button>
    </div>
  );
}

export { App, PlayContext };

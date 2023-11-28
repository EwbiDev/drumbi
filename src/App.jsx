import { createContext, useEffect, useRef, useState } from "react";
import "./App.css";
import Track from "./components/Track";
import { calcBeatInterval } from "./utilities/bpm";
import { nextPlayHeadPos } from "./utilities/playHead";

const PlayContext = createContext(0);

const sequencerData = [
  {
    trackName: "kick",
    beats: [
      {
        beatNum: 0,
        hit: true,
      },
      {
        beatNum: 1,
        hit: false,
      },
      {
        beatNum: 2,
        hit: true,
      },
      {
        beatNum: 3,
        hit: false,
      },
      {
        beatNum: 4,
        hit: true,
      },
      {
        beatNum: 5,
        hit: false,
      },
      {
        beatNum: 6,
        hit: true,
      },
      {
        beatNum: 7,
        hit: false,
      },
      {
        beatNum: 8,
        hit: true,
      },
      {
        beatNum: 9,
        hit: false,
      },
      {
        beatNum: 10,
        hit: true,
      },
      {
        beatNum: 11,
        hit: false,
      },
      {
        beatNum: 12,
        hit: true,
      },
      {
        beatNum: 13,
        hit: false,
      },
      {
        beatNum: 14,
        hit: true,
      },
      {
        beatNum: 15,
        hit: false,
      },
    ],
  },
];

function App() {
  const [playBack, setPlayBack] = useState(false);
  const [playHeadPos, setPlayHeadPos] = useState(0);
  const playHeadInterval = useRef();

  const [barNum, setBarNum] = useState(4);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [bpm] = useState(95);

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
      <PlayContext.Provider value={{ playBack, playHeadPos }}>
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

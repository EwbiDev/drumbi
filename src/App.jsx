import { useEffect, useRef, useState } from "react";
import "./App.css";
import Track from "./components/Track";

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
  const [beat, setBeat] = useState(0);
  const [playBack, setPlayBack] = useState(false);
  const playHeadInterval = useRef();

  const barNum = 4;
  const beatsPerBar = 4;
  const bpm = 240;

  useEffect(() => {
    // clear any previous intervals while live-editing...
    return () => clearInterval(playHeadInterval.current);
  }, []);

  useEffect(() => {
    if (playBack) {
      playHeadInterval.current = setInterval(() => {
        setBeat((beat) => beat + 1);
        console.log("Date.now()", Date.now());
      }, 1000);
    } else clearInterval(playHeadInterval.current);
  }, [playBack]);

  return (
    <div>
      <div>
        {sequencerData.map((track) => (
          <div key={`track-${track.trackName}`}>
            {track.trackName}
            <Track track={track} />
          </div>
        ))}
      </div>
      <button onClick={() => setPlayBack(!playBack)}>
        {playBack ? "pause" : "play"}
      </button>
      {beat}
    </div>
  );
}

export default App;

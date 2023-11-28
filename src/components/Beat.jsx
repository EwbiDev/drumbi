import { useContext, useEffect, useRef } from "react";
import { PlayHeadContext } from "../App";

import kick from "../assets/audio/kick.wav";

export default function Beat({ beat }) {
  const playHeadPos = useContext(PlayHeadContext);
  const displayPlayHead = playHeadPos === beat.beatNum;

  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      const sample = new Audio(kick);

      audioRef.current = { sample };
    }

    if (displayPlayHead && beat.hit) {
      audioRef.current.sample.play();
    }
  }, [displayPlayHead]);

  return (
    <label
      className={`p-4 ${displayPlayHead ? "bg-green-300" : "bg-slate-400"} `}
    >
      <input type="checkbox" defaultChecked={beat.hit} />
    </label>
  );
}

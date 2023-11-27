import { useContext, useEffect } from "react";
import { PlayHeadContext } from "../App";

import kick from "../assets/audio/kick.wav";
import { playSound } from "../utilities/audio";

export default function Beat({ beat }) {
  const playHeadPos = useContext(PlayHeadContext);
  const displayPlayHead = playHeadPos === beat.beatNum;

  useEffect(() => {
    if (displayPlayHead && beat.hit) {
      const audioContext = new AudioContext();
      playSound(audioContext, kick, 0);
      return () => setTimeout(() => audioContext.close(), 2000);
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

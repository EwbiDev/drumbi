import { useContext, useEffect, useRef } from "react";
import { PlayContext } from "../App";

import kick from "@assets/audio/kick.wav";
import { beatProp } from "@utilities/propTypes";

export default function Beat({ beat }) {
  const { playBack, playHeadPos } = useContext(PlayContext);
  const displayPlayHead = playHeadPos === beat.beatNum;

  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      const sample = new Audio(kick);

      audioRef.current = { sample };
    }

    if (displayPlayHead && beat.hit && playBack) {
      audioRef.current.sample.play();
    }
  }, [displayPlayHead, playBack]);

  return (
    <label
      className={`p-4 ${displayPlayHead ? "bg-green-300" : "bg-slate-400"} `}
    >
      <input type="checkbox" defaultChecked={beat.hit} />
    </label>
  );
}

Beat.propTypes = {
  beat: beatProp,
};

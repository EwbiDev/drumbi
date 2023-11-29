import { useContext, useEffect, useRef } from "react";
import { PlayContext } from "../App";

import { beatProp, trackIdProp } from "@utilities/propTypes";

export default function Beat({ beat, defaultFile, trackId }) {
  const { playBack, playHeadPos, sequencerData, setSequencerData } =
    useContext(PlayContext);
  const displayPlayHead = playHeadPos === beat.beatId;

  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      const sample = new Audio(defaultFile);

      audioRef.current = { sample };
    }

    if (displayPlayHead && beat.hit && playBack) {
      audioRef.current.sample.play();
    }
  }, [displayPlayHead, playBack]);

  function handleChange(e) {
    if (!beat.hit) audioRef.current.sample.play();
    sequencerData[trackId].beats[beat.beatId].hit = e.target.checked;
    setSequencerData([...sequencerData]);
  }

  return (
    <label
      className={`p-4 ${displayPlayHead ? "bg-green-300" : "bg-slate-400"} `}
    >
      <input onChange={handleChange} type="checkbox" checked={beat.hit} />
    </label>
  );
}

Beat.propTypes = {
  beat: beatProp,
};

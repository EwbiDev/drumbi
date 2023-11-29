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
    <div className={`p-1 ${displayPlayHead ? "bg-green-300" : "bg-slate-400"}`}>
      <label
        className={`border border-dashed border-transparent p-1 px-3 hover:border hover:border-white ${
          beat.hit && "bg-white"
        } `}
      >
        <input
          className=" hidden"
          onChange={handleChange}
          type="checkbox"
          checked={beat.hit}
        />
      </label>
    </div>
  );
}

Beat.propTypes = {
  beat: beatProp,
};

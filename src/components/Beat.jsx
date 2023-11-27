import { useContext } from "react";
import { PlayHeadContext } from "../App";

export default function Beat({ beat }) {
  const playHeadPos = useContext(PlayHeadContext);

  const displayPlayHead = playHeadPos === beat.beatNum;

  return (
    <label
      className={`p-4 ${displayPlayHead ? "bg-green-300" : "bg-slate-400"} `}
    >
      <input type="checkbox" defaultChecked={beat.hit} />
    </label>
  );
}

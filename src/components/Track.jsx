import { useRef } from "react";

import Beat from "./Beat";

export default function Track({ track }) {
  const { beats, trackId, trackName } = track;
  const lastNoteTime = useRef();
  return (
    <div className="flex items-center gap-2 text-white">
      <div className="w-12 text-right">{trackName}</div>
      {beats.map((beat) => (
        <Beat
          beat={beat}
          trackId={trackId}
          defaultFile={track.defaultFile}
          lastNoteTime={lastNoteTime}
        />
      ))}
    </div>
  );
}

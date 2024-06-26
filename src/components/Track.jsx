import Beat from "./Beat";

export default function Track({ track }) {
  const { beats, trackId, trackName } = track;
  return (
    <div className="flex items-center gap-2 text-white">
      <div className=" w-24 text-right">{trackName}</div>
      {beats.map((beat) => (
        <Beat
          beat={beat}
          trackId={trackId}
          defaultFile={track.defaultFile}
          key={`${trackId}-${beat.beatId}`}
        />
      ))}
    </div>
  );
}

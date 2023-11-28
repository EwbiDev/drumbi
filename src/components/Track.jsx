import Beat from "./Beat";

export default function Track({ track }) {
  const { beats, trackId, trackName } = track;
  console.log("track", track);
  return (
    <div className="flex gap-2">
      {trackName}
      {beats.map((beat) => (
        <Beat beat={beat} trackId={trackId} defaultFile={track.defaultFile} />
      ))}
    </div>
  );
}

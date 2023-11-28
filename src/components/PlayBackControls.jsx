export default function PlayBackControls({
  playBack,
  setPlayBack,
  bpm,
  setBpm,
}) {
  return (
    <div className="flex gap-4">
      <button onClick={() => setPlayBack(!playBack)}>
        {playBack ? "pause" : "play"}
      </button>
      <label>
        BPM
        <input
          onChange={(e) => setBpm(e.target.value)}
          type="number"
          max={480}
          min={1}
          value={bpm}
        />
      </label>
    </div>
  );
}

export default function PlayBackControls({
  playBack,
  setPlayBack,
  bpm,
  setBpm,
}) {
  function handleBpmChange(e) {
    // TODO: input needs to be more flexible, perhaps minBpm && maxBpm variables. If bpm outside default to last valid bpm?
    const newValue = e.target.value;
    if (newValue > 0) {
      setBpm(newValue);
    } else {
      setBpm(1);
    }
  }
  return (
    <div className="flex gap-4">
      <button onClick={() => setPlayBack(!playBack)}>
        {playBack ? "pause" : "play"}
      </button>
      <label>
        BPM
        <input
          onChange={handleBpmChange}
          type="number"
          max={480}
          min={1}
          value={bpm}
        />
      </label>
    </div>
  );
}

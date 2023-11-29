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
    <div className="flex items-center gap-4">
      <button
        className={` w-16 rounded-xl py-2 hover:text-white ${
          playBack ? "bg-red-300" : "bg-green-300"
        }`}
        onClick={() => setPlayBack(!playBack)}
      >
        {playBack ? "pause" : "play"}
      </button>
      <label className="flex items-center gap-2 rounded-xl bg-slate-500 pl-2 text-white">
        BPM
        <input
          className=" rounded-xl bg-slate-400 p-2"
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

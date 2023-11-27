export default function Beat({ beat }) {
  return (
    <label className="p-4 bg-slate-400">
      <input type="checkbox" defaultChecked={beat.hit} />
    </label>
  );
}

export default function Beat({ beat }) {
  return (
    <label className="">
      <input type="checkbox" checked={beat.hit} />
    </label>
  );
}

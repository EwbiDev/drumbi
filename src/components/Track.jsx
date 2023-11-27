import Beat from "./Beat";

export default function Track({ track }) {
  const { beats } = track;
  return (
    <div className="flex gap-2">
      {beats.map((beat) => (
        <Beat beat={beat} />
      ))}
    </div>
  );
}

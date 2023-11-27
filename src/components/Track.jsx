import Beat from "./Beat";

export default function Track({ track }) {
  const { beats } = track;
  return (
    <div>
      {beats.map((beat) => (
        <Beat beat={beat} />
      ))}
    </div>
  );
}

/**
 * A small metric card with a label, value, optional colour and note.
 */
export function StatBox({ label, value, color = "text-white", note, large = false }) {
  return (
    <div className="stat-box flex flex-col gap-1">
      <p className="text-xs text-dim font-body">{label}</p>
      <p className={`font-display font-bold ${large ? "text-2xl" : "text-lg"} ${color}`}>
        {value}
      </p>
      {note && <p className="text-xs text-dim leading-snug font-body">{note}</p>}
    </div>
  );
}

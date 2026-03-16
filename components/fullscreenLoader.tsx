export default function Loader({ label = "Loading document…" }) {
  return (
    <div className="loader-wrap">
      <div className="spinner" />
      <p className="loader-label">{label}</p>
    </div>
  );
}

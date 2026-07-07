export default function Skeletons({ n = 8 }) {
  return (
    <div className="store">
      <div className="store-head">
        <span className="sk sk-line" style={{ width: 130, height: 18 }} />
      </div>
      <div className="grid">
        {Array.from({ length: n }).map((_, i) => (
          <div className="sk-card" key={i}>
            <div className="sk sk-thumb" />
            <div className="sk sk-line" style={{ width: "82%" }} />
            <div className="sk sk-line" style={{ width: "48%", height: 20 }} />
            <div className="sk sk-line" style={{ width: "100%", height: 38, borderRadius: 999, marginTop: 4 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";

const DEV_CODE = "0067";

interface Props {
  onStart: () => void;
  onStartDev: () => void;
}

export default function MainMenu({ onStart, onStartDev }: Props) {
  const [view, setView] = useState<"main" | "code">("main");
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const openCodeEntry = () => {
    setView("code");
    setCode("");
    setError(false);
  };

  const backToMain = () => {
    setView("main");
    setCode("");
    setError(false);
  };

  const submitCode = () => {
    if (code === DEV_CODE) {
      onStartDev();
    } else {
      setError(true);
      setCode("");
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 24, width: "100%", maxWidth: 400, minHeight: "80dvh", padding: "24px 16px",
    }}>
      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f0c040", textAlign: "center" }}>
        🏰 Heroes of the Lane
      </div>

      {view === "main" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          <button className="hud-btn" style={{ minHeight: 48, fontSize: "1rem" }} onClick={onStart}>
            ▶ Начать игру
          </button>
          <button className="hud-btn secondary" style={{ minHeight: 48, fontSize: "1rem" }} onClick={openCodeEntry}>
            🛠 Режим разработчика
          </button>
        </div>
      )}

      {view === "code" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", alignItems: "center" }}>
          <div style={{ fontSize: "0.9rem", color: "#ccc" }}>Введите код</div>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={code}
            onChange={e => { setCode(e.target.value); setError(false); }}
            onKeyDown={e => { if (e.key === "Enter") submitCode(); }}
            style={{
              width: "100%", textAlign: "center", fontSize: "1.4rem", letterSpacing: "0.4em",
              padding: "10px 12px", borderRadius: 8, border: `2px solid ${error ? "#e05555" : "rgba(255,255,255,0.2)"}`,
              background: "rgba(255,255,255,0.06)", color: "#eee",
            }}
          />
          {error && <div style={{ color: "#e05555", fontSize: "0.8rem" }}>Неверный код</div>}
          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <button className="hud-btn secondary" style={{ flex: 1 }} onClick={backToMain}>
              ← Назад
            </button>
            <button className="hud-btn" style={{ flex: 1 }} onClick={submitCode}>
              Ввод
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

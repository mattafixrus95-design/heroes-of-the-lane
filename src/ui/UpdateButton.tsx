import { useState } from "react";

type Status = "idle" | "checking" | "updating" | "uptodate";

const LABEL: Record<Status, string> = {
  idle:     "обновить",
  checking: "⏳",
  updating: "⬆️",
  uptodate: "✓",
};

export default function UpdateButton({ currentVersion }: { currentVersion: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick() {
    if (status !== "idle") return;
    setStatus("checking");

    try {
      const res = await fetch("/version.json", { cache: "no-store" });
      const data: { version: string } = await res.json();

      if (data.version !== currentVersion) {
        setStatus("updating");
        if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) await reg.update();
        }
        window.location.reload();
      } else {
        setStatus("uptodate");
        setTimeout(() => setStatus("idle"), 2000);
      }
    } catch {
      setStatus("idle");
    }
  }

  return (
    <div style={{
      position: "fixed", bottom: 10, right: 12,
      display: "flex", alignItems: "center", gap: 6,
      fontSize: "0.65rem", color: "#555",
    }}>
      <span>v{currentVersion}</span>
      <button
        onClick={handleClick}
        disabled={status !== "idle"}
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 4,
          color: status === "uptodate" ? "#4caf50" : "#666",
          fontSize: "0.6rem", padding: "2px 6px",
          cursor: status === "idle" ? "pointer" : "default",
          touchAction: "manipulation",
          minWidth: 52, textAlign: "center",
        }}
      >
        {LABEL[status]}
      </button>
    </div>
  );
}

import type { Theme } from "../types";

export function ChatHeader(p: { theme: Theme; onThemeClick: () => void }) {
  return (
    <div
      className="header"
      style={{
        backgroundColor: p.theme === "light" ? "white" : "black",
        color: p.theme === "light" ? "black" : "white",
      }}
    >
      <h1>React Chat</h1>
      <div
        id="theme-toggle"
        onClick={p.onThemeClick}
        style={{
          color: p.theme === "light" ? "black" : "white",
        }}
      >
        {p.theme}
      </div>
    </div>
  );
}

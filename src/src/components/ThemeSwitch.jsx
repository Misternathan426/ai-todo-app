export default function ThemeSwitch({ theme, onToggle }) {
  const checked = theme === "dark";

  return (
    <button
      className={`theme-switch ${checked ? "dark" : "light"}`}
      role="switch"
      aria-checked={checked}
      aria-label="Toggle dark mode"
      onClick={onToggle}
    >
      <span className="track" aria-hidden="true" />
      <span className="thumb" aria-hidden="true">
        {/* Sun icon */}
        <svg className="icon sun" viewBox="0 0 24 24">
          <path d="M12 4.5V2m0 20v-2.5M4.5 12H2m20 0h-2.5M5.6 5.6 4 4m16 16-1.6-1.6M5.6 18.4 4 20m16-16-1.6 1.6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="4.5" fill="currentColor"/>
        </svg>
        {/* Moon icon */}
        <svg className="icon moon" viewBox="0 0 24 24">
          <path d="M21 12.6A8.5 8.5 0 1 1 11.4 3a7 7 0 1 0 9.6 9.6Z" fill="currentColor"/>
        </svg>
      </span>
    </button>
  );
}
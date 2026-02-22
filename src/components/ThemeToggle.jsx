export default function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="absolute top-6 right-6 bg-purple-500 px-4 py-2 rounded-full text-sm shadow-lg"
    >
      {darkMode ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
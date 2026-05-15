import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function AuthLayout({ children }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="grid min-h-screen place-items-center px-4 py-8">
      <button className="btn-ghost fixed right-4 top-4 p-2.5" type="button" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

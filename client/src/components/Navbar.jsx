import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuthPage =
    location.pathname === "/" || location.pathname === "/register";

  if (!token || isAuthPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-[#050816]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-lg sm:text-xl font-bold text-white hover:text-blue-400 transition"
        >
          Resume ATS Analyzer
        </Link>

        <nav>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

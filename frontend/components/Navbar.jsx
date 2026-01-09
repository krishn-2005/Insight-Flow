import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../src/assets/insightflow.svg";

function Navbar({ isFilterOpen, onFilterToggle }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Overview" },
    { to: "/insights", label: "Key Insights" },
    { to: "/contact", label: "Contact" },
  ];

  const githubUrl = "https://github.com/krishn-2005";
  return (
    <header className="border-b border-slate-800 bg-[#020617]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        {/* Left: Logo */}
        <div className="flex items-center ml-4">
          <img
            src={logo}
            alt="InsightFlow Logo"
            className="h-11 w-auto object-contain"
          />
        </div>

        {/* Center: Nav Links - Desktop */}
        <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition ${
                location.pathname === link.to
                  ? "text-indigo-400 font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {/* GitHub Link (text only) */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-white transition"
            title="GitHub"
          >
            <span className="hidden lg:inline">GitHub</span>
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Filters Button - Always visible on Overview page */}
          {location.pathname === "/" && (
            <button
              onClick={onFilterToggle}
              className={`
                flex items-center gap-1.5 sm:gap-2
                px-2.5 sm:px-4 py-2 rounded-lg
                text-sm font-medium
                transition-all duration-200
                ${
                  isFilterOpen
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span className="hidden sm:inline">Filters</span>
            </button>
          )}

          {/* Hamburger Menu Button - Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              // X icon when menu is open
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              // Hamburger icon when menu is closed
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-4 py-3 space-y-1 bg-slate-900/50 border-t border-slate-800">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.to
                  ? "bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-400"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {/* GitHub Link */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200"
            title="GitHub"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

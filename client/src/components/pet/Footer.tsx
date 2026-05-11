import { Link } from "react-router-dom";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "#",
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    color: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600",
  },
  {
    label: "YouTube",
    href: "#",
    icon: "M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z",
    color: "hover:bg-red-500",
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    color: "hover:bg-black",
  },
  {
    label: "Facebook",
    href: "#",
    icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    color: "hover:bg-blue-600",
  },
];

const NAV_LINKS = [
  { section: "Adopt", links: ["Find a Pet", "Adoption Process", "Requirements"] },
  { section: "Support", links: ["Sponsor", "Donate", "Volunteer"] },
  { section: "About", links: ["Our Mission", "Contact Us", "Blog"] },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white overflow-hidden">

      {/* ── WAVE TOP ── */}
      <div className="relative h-10 bg-white">
        <svg
          viewBox="0 0 390 40"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 40 C80 0, 160 30, 240 10 C300 -5, 340 25, 390 5 L390 40 Z"
            fill="#111827"
          />
        </svg>
      </div>

      {/* ── LOGO + TAGLINE ── */}
      <div className="px-6 pt-8 pb-6 text-center">
        <Link to="/" className="inline-block mb-3">
          <span className="text-3xl font-black tracking-tight">
            <span className="text-red-400">A</span>
            <span className="text-yellow-300">D</span>
            <span className="text-green-400">O</span>
            <span className="text-pink-400">P</span>
            <span className="text-blue-400">T</span>
            <span className="text-pink-400">I</span>
            <span className="text-orange-400">F</span>
            <span className="text-purple-400">Y</span>
          </span>
        </Link>
        <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
          Every pet deserves a loving home. Help us make that happen — one adoption at a time.
        </p>
      </div>

      {/* ── DIVIDER ── */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      {/* ── NAV LINKS ── */}
      <div className="px-6 py-6 grid grid-cols-3 gap-2">
        {NAV_LINKS.map(({ section, links }) => (
          <div key={section}>
            <p className="text-pink-400 font-bold text-xs uppercase tracking-widest mb-3">
              {section}
            </p>
            <ul className="flex flex-col gap-2">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-xs transition-colors leading-none"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── DIVIDER ── */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      {/* ── SOCIAL + NEWSLETTER ── */}
      <div className="px-6 py-6">
        {/* Social icons */}
        <p className="text-gray-500 text-xs text-center uppercase tracking-widest mb-4">
          Follow us
        </p>
        <div className="flex justify-center gap-3 mb-6">
          {SOCIAL_LINKS.map(({ label, href, icon, color }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className={`w-10 h-10 bg-gray-800 ${color} rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 hover:shadow-lg`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d={icon} />
              </svg>
            </a>
          ))}
        </div>

        {/* Newsletter pill */}
        <div className="bg-gray-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-white text-xs font-bold mb-0.5">Stay updated 🐾</p>
            <p className="text-gray-500 text-[10px]">Get adoption news & stories</p>
          </div>
          <button className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>

      {/* ── COPYRIGHT ── */}
      <div className="px-6 pb-6 text-center">
        <p className="text-gray-600 text-[10px]">
          © {new Date().getFullYear()} Adoptify · Made with{" "}
          <span className="text-pink-500">♥</span> for animals everywhere
        </p>
      </div>

    </footer>
  );
};

export default Footer;
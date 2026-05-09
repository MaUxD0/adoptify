import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/pet/Footer";
import PetCard from "../../components/pet/PetCard";
import PetFilters from "../../components/pet/PetFilters";
import { usePets } from "../../hooks/usePets";

// Hero background image - shelter dog
const HERO_IMG =
  "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80";
const COMMUNITY_IMG =
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80";
const DONATE_IMG =
  "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=300&q=80";

const HomePage = () => {
  const { filteredPets, loading } = usePets();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-2xl font-black tracking-tight">
            <span className="text-red-500">A</span>
            <span className="text-yellow-400">D</span>
            <span className="text-green-500">O</span>
            <span className="text-pink-500">P</span>
            <span className="text-blue-500">T</span>
            <span className="text-pink-500">I</span>
            <span className="text-orange-400">F</span>
            <span className="text-purple-500">Y</span>
          </span>
        </Link>
        <button className="text-gray-600 hover:text-pink-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="relative h-72 overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Shelter animals"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8 pb-4">
          <h1 className="text-white text-2xl font-bold leading-snug drop-shadow-lg mb-5">
            Adopt an animal and help<br />reduce animal abandonment<br />and abuse.
          </h1>
          <button className="bg-pink-500 hover:bg-pink-600 active:scale-95 transition-all text-white font-bold text-sm tracking-widest uppercase px-10 py-3 rounded-full shadow-lg shadow-pink-500/30">
            Help Them
          </button>
        </div>
      </section>

      {/* ── MAIN CONTENT CARD ── */}
      <div className="bg-white rounded-t-3xl -mt-5 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pt-6 pb-32">

        {/* ── CATEGORIES ── */}
        <section className="px-5 mb-6">
          <h2 className="text-pink-500 font-bold text-lg mb-4">Categories</h2>
          <PetFilters />
        </section>

        {/* ── PET GRID ── */}
        <section className="px-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-52" />
              ))}
            </div>
          ) : filteredPets.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🐾</p>
              <p className="text-gray-400 font-medium">No pets found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </section>

        {/* ── COMMUNITY BANNER ── */}
        <section className="mx-4 mt-8 bg-pink-500 rounded-3xl overflow-hidden relative min-h-[160px] flex items-center">
          <img
            src={COMMUNITY_IMG}
            alt="Community"
            className="absolute left-0 top-0 h-full w-2/5 object-cover object-right"
          />
          <div className="ml-auto w-[60%] p-5 text-white">
            <h3 className="font-bold text-base leading-tight mb-2">
              Become a member of our community
            </h3>
            <p className="text-pink-100 text-xs leading-relaxed mb-4">
              Help us rescue and find loving homes for pets in need. Your support helps us change lives every day.
            </p>
            <button className="bg-white text-pink-500 font-bold text-xs px-5 py-2 rounded-full hover:bg-pink-50 transition-colors">
              Learn more
            </button>
          </div>
        </section>

        {/* ── DONATE ── */}
        <section className="mx-4 mt-6 flex gap-4 items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">donate</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">For A Life</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-4">
              Your donation helps us rescue, care for, and find loving homes for pets in need. Every contribution makes a real difference.
            </p>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm px-8 py-2.5 rounded-full transition-colors shadow-md shadow-pink-200">
              Gift
            </button>
          </div>
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-pink-100 flex-shrink-0 shadow-md">
            <img src={DONATE_IMG} alt="Pet love" className="w-full h-full object-cover" />
          </div>
        </section>
      </div>

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── BOTTOM NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around py-2 relative">
          {/* Center chat button */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6">
            <button className="w-12 h-12 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-300 transition-all active:scale-95">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>

          <NavItem icon="home" label="Home" active />
          <NavItem icon="search" label="Search" />
          <div className="w-12" /> {/* spacer for center button */}
          <NavItem icon="heart" label="Saved" />
          <NavItem icon="user" label="Profile" />
        </div>
      </nav>
    </div>
  );
};

const NAV_ICONS: Record<string, ReactNode> = {
  home: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  heart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

const NavItem = ({ icon, label, active }: { icon: string; label: string; active?: boolean }) => (
  <button className={`flex flex-col items-center gap-0.5 px-2 py-1 ${active ? "text-pink-500" : "text-gray-400 hover:text-gray-600"} transition-colors`}>
    {NAV_ICONS[icon]}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default HomePage;
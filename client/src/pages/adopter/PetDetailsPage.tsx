
import { useNavigate, useParams } from "react-router-dom";
import { usePets } from "../../hooks/usePets";
import { PetsService } from "../../services/pets.service";
import Footer from "../../components/pet/Footer";
import { adoptionService } from "../../services/adoption.service";
import toast from "react-hot-toast";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80";

// Mock behavior tags since the API may not have them
const BEHAVIOR_TAGS = ["Leash trained", "Friendly with cats", "Active", "Tries to eat things"];

const PetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets } = usePets();
  const pet = pets.find((p) => p.id === id);

  const handleAdopt = async () => {
    try {
      console.log("PET COMPLETA:", pet);
      console.log("PET ID:", pet?.id);

      if (!pet?.id) {
        toast.error("La mascota no tiene ID");
        return;
      }

      const response = await adoptionService.createAdoption({
        petId: pet.id,
        message: "Quiero adoptar esta mascota",
      });

      console.log("ADOPTION RESPONSE:", response);

      toast.success("Solicitud enviada");
    } catch (error: any) {
      console.error(
        "ERROR BACKEND:",
        error?.response?.data || error
      );
      toast.error("Error al enviar la solicitud");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await PetsService.deletePet(id);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error deleting pet");
    }
  };

  if (!pet) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">🐾</p>
        <p className="text-gray-400 font-medium">Pet not found</p>
        <button
          onClick={() => navigate("/")}
          className="text-pink-500 font-bold underline"
        >
          Go back home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28 font-sans">
      {/* ── HERO IMAGE ── */}
      <div className="relative">
        <img
          src={pet.image_url || FALLBACK_IMG}
          alt={pet.name}
          className="w-full h-64 object-cover object-center"
        />
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-pink-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Navbar top-right */}
        <div className="absolute top-4 right-4">
          <button className="text-white/90 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── CONTENT CARD ── */}
      <div className="bg-white rounded-t-3xl -mt-5 relative shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-5 pt-5">

        {/* Name + gender */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-pink-500 text-2xl font-black leading-tight">{pet.name}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {pet.breed || pet.species} · {pet.age}{pet.age === 1 ? "y" : "y"} old
            </p>
          </div>
          <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C9.243 2 7 4.243 7 7c0 1.657.672 3.157 1.757 4.243L12 14.485l3.243-3.243A5.978 5.978 0 0019 7c0-2.757-2.243-5-5-5H12zm-1 5a1 1 0 112 0 1 1 0 01-2 0z" />
            </svg>
          </div>
        </div>

        {/* ── ABOUT SECTION ── */}
        <div className="mb-5">
          <h2 className="flex items-center gap-2 text-gray-800 font-bold text-base mb-3">
            <span className="text-lg">🐾</span>
            About {pet.name}
          </h2>

          {/* Stats pills */}
          <div className="flex gap-2 mb-4">
            {pet.size && (
              <div className="bg-gray-50 rounded-xl px-4 py-2 flex-1 text-center">
                <p className="text-gray-400 text-xs">Size</p>
                <p className="text-pink-500 font-bold text-sm mt-0.5">{pet.size}</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl px-4 py-2 flex-1 text-center">
              <p className="text-gray-400 text-xs">Age</p>
              <p className="text-pink-500 font-bold text-sm mt-0.5">{pet.age}y</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-2 flex-1 text-center">
              <p className="text-gray-400 text-xs">Species</p>
              <p className="text-pink-500 font-bold text-sm mt-0.5 capitalize">{pet.species}</p>
            </div>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed line-clamp-5">
            {pet.description}
          </p>
        </div>

        {/* ── BEHAVIOR ── */}
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-gray-800 font-bold text-base mb-3">
            <span className="text-lg">🏷️</span>
            {pet.name} behavior
          </h2>
          <div className="flex flex-wrap gap-2">
            {BEHAVIOR_TAGS.map((tag) => (
              <span
                key={tag}
                className="border border-gray-200 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full hover:border-pink-300 hover:text-pink-500 transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── MAP PLACEHOLDER ── */}
        <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="bg-gray-100 h-40 flex flex-col items-center justify-center relative">
            {/* Fake map grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "linear-gradient(#aaa 1px, transparent 1px), linear-gradient(90deg, #aaa 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            <div className="relative z-10 text-center">
              <p className="text-xs text-gray-400 mb-2">📍 Location</p>
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <p className="absolute bottom-2 left-2 text-xs text-gray-400">View larger map</p>
          </div>
        </div>

        {/* ── ADOPT BUTTON ── */}
       <button
  onClick={handleAdopt}
  className="w-full bg-pink-500 hover:bg-pink-600 active:scale-[0.98] text-white font-bold text-base py-4 rounded-full shadow-lg shadow-pink-200 transition-all mb-4"
>
  Adopt {pet.name}
</button>

        {/* Delete (admin action, subtle) */}
        <button
          onClick={handleDelete}
          className="w-full text-gray-300 hover:text-red-400 text-sm py-2 transition-colors"
        >
          Remove listing
        </button>
      </div>

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── BOTTOM NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-4">
        <div className="max-w-md mx-auto flex items-center justify-around py-2 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-6">
            <button className="w-12 h-12 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-300 transition-all active:scale-95">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
          {[
            { icon: "home", label: "Home", action: () => navigate("/") },
            { icon: "search", label: "Search" },
          ].map(({ icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex flex-col items-center gap-0.5 px-2 py-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {icon === "home" ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              )}
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
          <div className="w-12" />
          {[
            { icon: "heart", label: "Saved" },
            { icon: "user", label: "Profile" },
          ].map(({ icon, label }) => (
            <button key={label} className="flex flex-col items-center gap-0.5 px-2 py-1 text-gray-400 hover:text-gray-600 transition-colors">
              {icon === "heart" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              )}
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default PetDetailsPage;
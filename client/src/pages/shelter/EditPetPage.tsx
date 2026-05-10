import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePets } from "../../hooks/usePets";
import { PetsService } from "../../services/pets.service";

const SPECIES_OPTIONS = ["Perro", "Gato", "Conejo", "Ave", "Otro"];
const SIZE_OPTIONS = ["Pequeño", "Mediano", "Grande"];

const EditPetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets } = usePets();
  const pet = pets.find((p) => p.id === id);

  const [name, setName] = useState(pet?.name ?? "");
  const [species, setSpecies] = useState(
    pet?.species ? pet.species.charAt(0).toUpperCase() + pet.species.slice(1) : ""
  );
  const [breed, setBreed] = useState(pet?.breed ?? "");
  const [age, setAge] = useState(pet?.age?.toString() ?? "");
  const [size, setSize] = useState(
    pet?.size ? pet.size.charAt(0).toUpperCase() + pet.size.slice(1) : ""
  );
  const [description, setDescription] = useState(pet?.description ?? "");
  const [imageUrl, setImageUrl] = useState(pet?.image_url ?? "");
  const [loading, setLoading] = useState(false);

  const FALLBACK_IMG = "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80";

  if (!pet) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">🐾</p>
        <p className="text-gray-400 font-medium">Mascota no encontrada</p>
        <button onClick={() => navigate(-1)} className="text-pink-500 font-bold underline">
          Volver
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    try {
      await PetsService.updatePet(id, {
        name,
        species: species.toLowerCase(),
        breed,
        age: Number(age),
        size: size.toLowerCase(),
        description,
        image_url: imageUrl,
      });
      navigate("/shelter/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar la mascota.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3 sticky top-0 z-40">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-gray-900 font-black text-base">Editar mascota</h1>
          <p className="text-pink-500 text-xs font-semibold">{pet.name}</p>
        </div>
      </header>

      <div className="px-5 pt-6">
        {/* Preview imagen */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-pink-100 shadow-md mb-2">
            <img
              src={imageUrl || FALLBACK_IMG}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-400 text-xs">Cambia la URL abajo para actualizar la imagen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre *">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-pink-400 bg-white"
            />
          </Field>

          <Field label="Especie *">
            <div className="flex flex-wrap gap-2">
              {SPECIES_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpecies(s)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                    species.toLowerCase() === s.toLowerCase()
                      ? "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200"
                      : "border-gray-200 text-gray-400 hover:border-pink-300 hover:text-pink-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <div className="flex gap-3">
            <Field label="Raza" className="flex-1">
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-pink-400 bg-white"
              />
            </Field>
            <Field label="Edad (años) *" className="w-28">
              <input
                type="number"
                min="0"
                max="30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-pink-400 bg-white"
              />
            </Field>
          </div>

          <Field label="Tamaño">
            <div className="flex gap-2">
              {SIZE_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    size.toLowerCase() === s.toLowerCase()
                      ? "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200"
                      : "border-gray-200 text-gray-400 hover:border-pink-300 hover:text-pink-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <Field label="URL de imagen">
            <input
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-pink-400 bg-white"
            />
          </Field>

          <Field label="Descripción *">
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-pink-400 bg-white resize-none"
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 active:scale-[0.98] disabled:opacity-60 text-white font-bold text-base py-4 rounded-full shadow-lg shadow-pink-200 transition-all mt-2"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Field = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    {children}
  </div>
);

export default EditPetPage;
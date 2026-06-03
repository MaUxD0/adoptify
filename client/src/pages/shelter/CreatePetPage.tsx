import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PetsService } from "../../services/pets.service";
import { Map } from "../../components/ui/Map/Map";

const SPECIES_OPTIONS = [
  { label: "Perro", value: "dog" },
  { label: "Gato", value: "cat" },
  { label: "Conejo", value: "rabbit" },
  { label: "Ave", value: "bird" },
  { label: "Otro", value: "other" },
];  
const SIZE_OPTIONS = ["Pequeño", "Mediano", "Grande"];
const GENDER_OPTIONS = [
  { label: "Macho", value: "male" },
  { label: "Hembra", value: "female" },
];

const CreatePetPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !species || !age || !description || !gender) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }
    setLoading(true);
    try {
      const payload: any = {
        name,
        species: species.toLowerCase(),
        age: Number(age),
        gender,
        description,
      };

      if (breed) payload.breed = breed;
      if (size) payload.size = size.toLowerCase();
      if (imageUrl) payload.image_url = imageUrl;
      if (location) {
        payload.latitude = location[0];
        payload.longitude = location[1];
      }

      await PetsService.createPet(payload);
      navigate("/shelter/dashboard");
    } catch (error: any) {
      console.error("DETAILED ERROR:", error.response?.data || error);
      const serverMessage = error.response?.data?.errors?.[0]?.message || 
                           error.response?.data?.message || 
                           "Error al crear la mascota";
      alert(`Error: ${serverMessage}`);
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
          <h1 className="text-gray-900 font-black text-base">Publicar mascota</h1>
          <p className="text-gray-400 text-xs">Completa los datos de la mascota</p>
        </div>
      </header>

      <div className="px-5 pt-6">
        {/* Preview imagen */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-28 h-28 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center mb-2">
            {imageUrl ? (
              <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <p className="text-gray-400 text-xs">Pega una URL de imagen abajo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <Field label="Nombre *">
            <input
              type="text"
              placeholder="Ej: Luna"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-pink-400 bg-white"
            />
          </Field>

          {/* Especie */}
          <Field label="Especie *">
            <div className="flex flex-wrap gap-2">
             {SPECIES_OPTIONS.map((s) => (
         <button
    key={s.value}
    type="button"
    onClick={() => setSpecies(s.value)}  
    className={`... ${species === s.value ? "bg-pink-500 ..." : "..."}`}
  >
    {s.label}  
  </button>
))}
            </div>
          </Field>

          {/* Raza y Edad en fila */}
          <div className="flex gap-3">
            <Field label="Raza" className="flex-1">
              <input
                type="text"
                placeholder="Ej: Labrador"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-pink-400 bg-white"
              />
            </Field>
            <Field label="Edad (años) *" className="w-28">
              <input
                type="number"
                min="0"
                max="30"
                placeholder="0"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-pink-400 bg-white"
              />
            </Field>
          </div>

          {/* Tamaño */}
          <Field label="Tamaño">
            <div className="flex gap-2">
              {SIZE_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    size === s
                      ? "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200"
                      : "border-gray-200 text-gray-400 hover:border-pink-300 hover:text-pink-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          {/* Género */}
          <Field label="Género *">
            <div className="flex gap-2">
              {GENDER_OPTIONS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGender(g.value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    gender === g.value
                      ? "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-200"
                      : "border-gray-200 text-gray-400 hover:border-pink-300 hover:text-pink-500"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </Field>

          {/* URL imagen */}
          <Field label="URL de imagen">
            <input
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-pink-400 bg-white"
            />
          </Field>

          {/* Mapa de ubicación */}
          <Field label="Ubicación del centro de adopción *">
            <div className="h-64 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              <Map 
                selectedLocation={location || undefined}
                onLocationSelect={(lat, lng) => setLocation([lat, lng])}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1 italic">
              {location 
                ? `📍 Coordenadas: ${location[0].toFixed(4)}, ${location[1].toFixed(4)}`
                : "Haz clic en el mapa para marcar la ubicación del centro"}
            </p>
          </Field>

          {/* Descripción */}
          <Field label="Descripción *">
            <textarea
              rows={4}
              placeholder="Cuéntanos sobre la personalidad, historia y necesidades de la mascota..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-pink-400 bg-white resize-none"
            />
          </Field>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 active:scale-[0.98] disabled:opacity-60 text-white font-bold text-base py-4 rounded-full shadow-lg shadow-pink-200 transition-all mt-2"
          >
            {loading ? "Publicando..." : "Publicar mascota"}
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

export default CreatePetPage;
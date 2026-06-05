import { PetCard } from '../../components/pet/PetCard'
import { PetFilters } from '../../components/pet/PetFilters'
import { EmptyState } from '../../components/ui/EmptyState/EmptyState'
import { LoadingState } from '../../components/ui/LoadingState/LoadingState'
import { usePets } from '../../hooks/usePets'

export const PetsListPage = () => {
  const {
    filteredPets,
    loading,
    error,
    speciesFilter,
    setSpeciesFilter,
    searchQuery,
    setSearchQuery,
  } = usePets()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mascotas en adopción</h1>
          <p className="text-gray-500 mt-2">
            Explora el catálogo y filtra por especie o raza. Las actualizaciones llegan en tiempo real.
          </p>
        </header>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
          <PetFilters speciesFilter={speciesFilter} onSpeciesChange={setSpeciesFilter} />
          
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por raza..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
            />
            <svg className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>

        <section className="mt-8">
          {loading ? <LoadingState label="Cargando mascotas..." /> : null}

          {!loading && error ? (
            <EmptyState
              title="Error al cargar"
              description={error}
            />
          ) : null}

          {!loading && !error && filteredPets.length === 0 ? (
            <EmptyState
              title="No hay mascotas"
              description={
                searchQuery
                  ? `No se encontraron mascotas de raza "${searchQuery}".`
                  : speciesFilter
                  ? 'Prueba otro filtro o vuelve más tarde.'
                  : 'Aún no hay mascotas publicadas.'
              }
            />
          ) : null}

          {!loading && !error && filteredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  )
}

export default PetsListPage


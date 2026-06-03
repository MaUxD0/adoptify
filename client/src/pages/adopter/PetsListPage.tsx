import { PetCard } from '../../components/pet/PetCard'
import { PetFilters } from '../../components/pet/PetFilters'
import { EmptyState } from '../../components/ui/EmptyState/EmptyState'
import { LoadingState } from '../../components/ui/LoadingState/LoadingState'
import { usePets } from '../../hooks/usePets'

export const PetsListPage = () => {
  const { filteredPets, loading, error, speciesFilter, setSpeciesFilter } = usePets()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mascotas en adopción</h1>
          <p className="text-gray-500 mt-2">
            Explora el catálogo y filtra por especie. Las actualizaciones llegan en tiempo real.
          </p>
        </header>

        <PetFilters speciesFilter={speciesFilter} onSpeciesChange={setSpeciesFilter} />

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
                speciesFilter
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


import { Link } from 'react-router-dom'

const UnauthorizedPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="text-4xl font-bold text-red-500">403</h1>
    <p className="text-gray-600">No tienes permiso para ver esta página.</p>
    <Link to="/" className="text-orange-500 hover:underline">Volver al inicio</Link>
  </div>
)

export default UnauthorizedPage
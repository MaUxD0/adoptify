interface LoadingStateProps {
  label?: string
}

export const LoadingState = ({ label = 'Cargando...' }: LoadingStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3" role="status">
    <div className="h-10 w-10 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
    <p className="text-sm text-gray-500">{label}</p>
  </div>
)

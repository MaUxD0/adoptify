interface EmptyStateProps {
  title: string
  description?: string
}

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <span className="text-4xl mb-3" aria-hidden>
      🐾
    </span>
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    {description ? (
      <p className="text-sm text-gray-500 mt-2 max-w-sm">{description}</p>
    ) : null}
  </div>
)

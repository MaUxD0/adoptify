import type { Adoption } from "../../types/adoption.types";

interface Props {
  adoption: Adoption;
  viewMode?: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onChat?: (adoption: any) => void;
  onViewTracking?: (adoption: Adoption) => void;
}

export const AdoptionCard = ({ adoption, onChat, onViewTracking }: Props) => {
  const statusClasses = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-emerald-100 text-emerald-800',
    REJECTED: 'bg-red-100 text-red-800',
  } as const;

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl object-cover bg-gray-200" />

        <div className="flex-1">
          <div className="font-semibold">
            Adopción #{adoption.id.slice(0, 8)}
          </div>

          <p className="text-xs text-gray-400 mt-1">
            Status:{' '}
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses[adoption.status]}`}>
              {adoption.status}
            </span>
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-3">
        {adoption.message || 'No message provided.'}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => onViewTracking?.(adoption)}
          className="bg-gray-100 text-gray-700 text-xs px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          View tracking
        </button>

        {onChat && (
          <button
            onClick={() => onChat(adoption)}
            className="bg-blue-500 text-white text-xs px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            Chat shelter
          </button>
        )}
      </div>
    </div>
  );
};
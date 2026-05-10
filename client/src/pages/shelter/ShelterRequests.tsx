import { useState } from 'react';
import { useShelterAdoptions } from '../../hooks/useAdoptions';
import { AdoptionCard } from '../../components/adoptions/AdoptionCard';
import type { AdoptionStatus } from '../../types/adoption.types';

export function ShelterRequests() {
  const [statusFilter, setStatusFilter] = useState<AdoptionStatus | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { adoptions, pagination, isLoading, error, approve, reject } = useShelterAdoptions({
    status: statusFilter,
    page,
    limit: 10,
  });

  const handleApprove = async (id: string) => {
    await approve(id);
  };

  const handleReject = async (id: string) => {
    // In a real app, prompt for rejection notes
    await reject(id);
  };

  return (
    <main className="shelter-requests">
      <header className="shelter-requests__header">
        <h1>Adoption Requests</h1>

        {/* Filter toolbar */}
        <div className="filter-toolbar" role="group" aria-label="Filter by status">
          {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((s) => (
            <button
              key={s}
              className={`filter-btn ${statusFilter === s ? 'filter-btn--active' : ''}`}
              onClick={() => {
                setStatusFilter((prev) => (prev === s ? undefined : s));
                setPage(1);
              }}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
          {statusFilter && (
            <button
              className="filter-btn filter-btn--clear"
              onClick={() => { setStatusFilter(undefined); setPage(1); }}
            >
              Clear
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="adoption-grid adoption-grid--loading">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="adoption-card-skeleton" />
          ))}
        </div>
      ) : adoptions.length === 0 ? (
        <div className="empty-state">
          <p>No adoption requests found.</p>
        </div>
      ) : (
        <div className="adoption-grid">
          {adoptions.map((adoption) => (
            <AdoptionCard
              key={adoption.id}
              adoption={adoption}
              viewMode="shelter"
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <nav className="pagination" aria-label="Pagination">
          <button
            className="pagination__btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Previous
          </button>
          <span className="pagination__info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className="pagination__btn"
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </nav>
      )}
    </main>
  );
}

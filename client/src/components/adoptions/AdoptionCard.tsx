import type { Adoption } from "../../types/adoption.types";

interface Props {
  adoption: Adoption;
  viewMode?: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const AdoptionCard = ({ adoption }: Props) => {
  return (
    <div className="border rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold">
        Adoption Request
      </h2>

      <p>
        <strong>Status:</strong> {adoption.status}
      </p>

      <p>
        <strong>Message:</strong> {adoption.message}
      </p>

      <p>
        <strong>Created:</strong>{" "}
        {new Date(adoption.created_at).toLocaleDateString()}
      </p>
    </div>
  );
};
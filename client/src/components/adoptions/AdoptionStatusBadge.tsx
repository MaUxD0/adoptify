import type { AdoptionStatus } from "../../types/adoption.types";

interface Props {
  status: AdoptionStatus;
}

export const AdoptionStatusBadge = ({
  status,
}: Props) => {
  return (
    <span className="px-3 py-1 rounded-full border text-sm">
      {status}
    </span>
  );
};
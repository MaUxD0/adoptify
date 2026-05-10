import { useState } from "react";

import { useAdoptions } from "../../hooks/useAdoptions";

interface Props {
  petId: string;
}

export const AdoptionRequestForm = ({
  petId,
}: Props) => {
  const { submit } = useAdoptions();

  const [message, setMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await submit({
      petId,
      message,
    });

    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Why do you want to adopt this pet?"
        className="border rounded-lg p-3"
      />

      <button
        type="submit"
        className="bg-black text-white rounded-lg p-3"
      >
        Send Adoption Request
      </button>
    </form>
  );
};
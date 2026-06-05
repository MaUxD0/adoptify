interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  msg: {
    emoji: string;
    title: string;
    text: string;
  };
}

export const CommunityModal = ({ isOpen, onClose, msg }: CommunityModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white w-full max-w-md rounded-t-3xl px-6 pt-6 pb-10 animate-slide-up">
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

        {/* Emoji grande */}
        <div className="text-center mb-4">
          <span className="text-6xl">{msg.emoji}</span>
        </div>

        {/* Mensaje emotivo */}
        <h3 className="text-pink-500 text-xl font-black text-center mb-3">
          {msg.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed text-center mb-6">
          {msg.text}
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-6" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { num: "2M+", label: "Animals rescued" },
            { num: "150K", label: "Happy families" },
            { num: "500+", label: "Shelters joined" },
          ].map(({ num, label }) => (
            <div key={label} className="bg-pink-50 rounded-2xl py-3 px-2 text-center">
              <p className="text-pink-500 font-black text-base">{num}</p>
              <p className="text-pink-400 text-[10px] font-medium leading-tight mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full bg-pink-500 hover:bg-pink-600 active:scale-[0.98] text-white font-bold text-sm py-4 rounded-full shadow-lg shadow-pink-200 transition-all"
        >
          I want to help 🐾
        </button>

        <button
          onClick={onClose}
          className="w-full text-gray-400 text-sm font-medium mt-3 py-2 hover:text-gray-600 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

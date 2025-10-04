// vedai-landing\src\pages\E-Katha\KathaSelection.jsx
export default function KathaSelection({ kathas, onSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-8 text-center">
        VedAI – Start an E-Katha 🕉️
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {kathas.map((katha) => (
          <div
            key={katha._id}
            onClick={() => onSelect(katha)}
            className="relative cursor-pointer overflow-hidden rounded-2xl shadow-2xl border border-neutral-800 hover:scale-105 transform transition duration-300 ease-in-out"
          >
            {/* Image */}
            {katha.image ? (
              <img
                src={katha.image}
                alt={katha.title}
                className="w-full h-48 sm:h-56 object-cover"
              />
            ) : (
              <div className="w-full h-48 sm:h-56 bg-neutral-800 flex items-center justify-center text-5xl">
                📿
              </div>
            )}

            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

            {/* Title */}
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-lg sm:text-xl font-semibold">{katha.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

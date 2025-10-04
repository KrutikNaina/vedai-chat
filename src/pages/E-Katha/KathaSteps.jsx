// vedai-landing\src\pages\E-Katha\KathaSteps.jsx
import { useEffect, useRef } from "react";

export default function KathaSteps({ katha, currentStepIndex, onNext, onPrevious }) {
  const step = katha.steps[currentStepIndex || 0];
  const videoRef = useRef(null);

  // Convert Google Drive share link → direct playable link
  const getPlayableUrl = (url) => {
    if (url?.includes("drive.google.com")) {
      const fileId = url.match(/[-\w]{25,}/)?.[0];
      return fileId
        ? `https://drive.google.com/uc?export=preview&id=${fileId}`
        : url;
    }
    return url;
  };

  const videoUrl = getPlayableUrl(step.videoUrl);

  // Auto play on step change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentStepIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white p-6 flex justify-center items-center">
      <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 shadow-lg max-w-3xl w-full">
        {/* Step Title */}
        <h1 className="text-xl font-bold text-orange-400 mb-4 text-center">
          {katha.title} – Step {step.stepNumber + 1} / {katha.steps.length}
        </h1>

        {/* Video (inline playable, not redirecting) */}
        {videoUrl && (
          <div className="relative mb-6 rounded-xl overflow-hidden border border-orange-500/30 shadow-md">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              playsInline
              className="w-full rounded-lg bg-black"
            />
          </div>
        )}

        {/* Step Instruction */}
        <p className="text-neutral-300 text-base leading-relaxed mb-3">
          📜 <span className="font-semibold text-orange-400">Instruction:</span>{" "}
          {step.text}
        </p>

        {/* Optional Mantra */}
        {step.mantra && (
          <p className="mt-2 text-orange-300 italic border-l-4 border-orange-500 pl-3">
            🔤 {step.mantra}
          </p>
        )}

        {/* Optional Meaning */}
        {step.meaning && (
          <p className="mt-3 text-neutral-400 leading-relaxed">
            💬 {step.meaning}
          </p>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={onPrevious}
            className="px-5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition"
          >
            ⬅️ Previous
          </button>

          <button
            onClick={onNext}
            className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition"
          >
            {currentStepIndex + 1 === katha.steps.length ? "Finish ✅" : "Next ➡️"}
          </button>
        </div>
      </div>
    </div>
  );
}

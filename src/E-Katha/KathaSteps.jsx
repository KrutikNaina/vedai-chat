// src/features/ekatha/pages/KathaSteps.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * Props:
 * - katha: katha object with steps[]
 * - currentStepIndex: number
 * - onNext: () => void
 * - onPrevious: () => void
 * - completedSteps: array of completed indexes
 * - onJumpToStep: (idx) => void
 * - kathaId: string (optional) used for storage key (defaults to katha._id)
 * - token: string (optional) for backend calls (not used by default)
 * - autoAdvance: boolean (optional) if true => advance to next step when marked complete. default: false
 * - savePlayback: async function({ kathaId, stepIndex, currentTime }) => { } (optional) - if provided, called on pause/leave
 * - markStepCompleteCallback: async function({ kathaId, stepIndex }) => { } (optional) - called when step is completed (80% watched)
 */
export default function KathaSteps({
  katha,
  currentStepIndex = 0,
  onNext,
  onPrevious,
  completedSteps = [],
  onJumpToStep,
  kathaId,
  token,
  autoAdvance = false,
  savePlayback, // optional callback to persist playback time
  markStepCompleteCallback, // optional callback to notify backend when step completed
}) {
  if (!katha) return null;

  const id = kathaId || katha._id || "unknown-katha";
  const step = katha.steps[currentStepIndex] || { stepNumber: 0, text: "" };
  const videoRef = useRef(null);

  // UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [watchedSeconds, setWatchedSeconds] = useState(0); // cumulative watched seconds (not perfect but good)
  const [watchedPercent, setWatchedPercent] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [isCompleted, setIsCompleted] = useState(completedSteps.includes(currentStepIndex));
  const [manualMarking, setManualMarking] = useState(false);

  // storage key for resume
  const STORAGE_KEY = `VEDAI_PLAY_${id}_step_${currentStepIndex}`;

  // convert drive link -> preview
  const getPlayableUrl = (url) => {
    if (!url) return null;
    if (url.includes("drive.google.com")) {
      const fid = url.match(/[-\w]{25,}/)?.[0];
      return fid ? `https://drive.google.com/uc?export=preview&id=${fid}` : url;
    }
    return url;
  };
  const videoUrl = getPlayableUrl(step.videoUrl);

  // Load saved position from localStorage
  useEffect(() => {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {}
    if (saved && typeof saved.currentTime === "number") {
      setCurrentTime(saved.currentTime);
    } else {
      setCurrentTime(0);
    }
    // reset states on step change
    setIsPlaying(false);
    setWatchedSeconds(0);
    setWatchedPercent(0);
    setIsCompleted(completedSteps.includes(currentStepIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, id, katha._id]);

  // Set video currentTime when metadata loaded
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => {
      setDuration(v.duration || 0);
      // if we had a saved currentTime, set it (but clamp)
      const clamp = Math.max(0, Math.min(v.duration || 0, currentTime || 0));
      if (clamp > 0) {
        try {
          v.currentTime = clamp;
          setCurrentTime(clamp);
        } catch {}
      }
    };
    v.addEventListener("loadedmetadata", onLoaded);
    return () => v.removeEventListener("loadedmetadata", onLoaded);
  }, [videoUrl, currentTime]);

  // timeupdate: update currentTime, watchedSeconds (accumulate), watched percent, buffered
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let lastTime = v.currentTime;
    const onTime = (e) => {
      const now = v.currentTime;
      // increment watchedSeconds roughly by delta (but only while playing)
      if (!v.paused && !v.ended) {
        const delta = Math.max(0, now - lastTime);
        setWatchedSeconds((s) => s + delta);
      }
      lastTime = now;
      setCurrentTime(now);
      setWatchedPercent(((watchedSeconds + (now - (lastTime || now))) / (v.duration || 1)) * 100);
      // buffered end
      try {
        const buf = v.buffered;
        if (buf && buf.length) {
          setBufferedEnd(buf.end(buf.length - 1));
        }
      } catch {}
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, watchedSeconds]);

  // update watchedPercent whenever watchedSeconds or duration change
  useEffect(() => {
    const pct = duration ? Math.min(100, Math.round((watchedSeconds / duration) * 100)) : 0;
    setWatchedPercent(pct);
  }, [watchedSeconds, duration]);

  // Watch for completion threshold (80%)
  useEffect(() => {
    if (!isCompleted && watchedPercent >= 80) {
      setIsCompleted(true);
      // call backend/parent callback
      (async () => {
        try {
          if (typeof markStepCompleteCallback === "function") {
            await markStepCompleteCallback({ kathaId: id, stepIndex: currentStepIndex });
          }
        } catch (e) {
          console.error("markStepCompleteCallback failed", e);
        }
        // If autoAdvance requested, go to next after small delay
        if (autoAdvance) {
          setTimeout(() => {
            if (typeof onNext === "function") onNext();
          }, 800);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedPercent, isCompleted]);

  // Play / Pause handlers
  const handlePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setIsPlaying(false);
    // persist position locally
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentTime: v.currentTime, updatedAt: Date.now() }));
    } catch {}
    // optionally call savePlayback callback
    if (typeof savePlayback === "function") {
      try {
        await savePlayback({ kathaId: id, stepIndex: currentStepIndex, currentTime: v.currentTime, token });
      } catch (e) {
        console.error("savePlayback failed", e);
      }
    }
  }, [id, currentStepIndex, savePlayback, token, STORAGE_KEY]);

  // When user leaves component (unmount) - persist playback
  useEffect(() => {
    return () => {
      const v = videoRef.current;
      if (!v) return;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentTime: v.currentTime, updatedAt: Date.now() }));
      } catch {}
      if (typeof savePlayback === "function") {
        savePlayback({ kathaId: id, stepIndex: currentStepIndex, currentTime: v.currentTime, token }).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentStepIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      // ignore if focus is in an input/textarea
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.code === "Space") {
        e.preventDefault();
        if (isPlaying) handlePause();
        else handlePlay();
      } else if (e.key === "ArrowLeft") {
        const v = videoRef.current;
        if (v) v.currentTime = Math.max(0, v.currentTime - 5);
      } else if (e.key === "ArrowRight") {
        const v = videoRef.current;
        if (v) v.currentTime = Math.min(v.duration || 0, v.currentTime + 5);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, handlePause, handlePlay]);

  // Manual mark complete (if user wants explicit control)
  const handleManualMarkComplete = async () => {
    setManualMarking(true);
    try {
      setIsCompleted(true);
      if (typeof markStepCompleteCallback === "function") {
        await markStepCompleteCallback({ kathaId: id, stepIndex: currentStepIndex });
      }
      if (autoAdvance && typeof onNext === "function") onNext();
    } catch (e) {
      console.error("manual mark complete failed", e);
    } finally {
      setManualMarking(false);
    }
  };

  // Seek to start position (resume) when metadata ready
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryResume = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved && typeof saved.currentTime === "number") {
          const t = Math.max(0, Math.min(v.duration || 0, saved.currentTime));
          v.currentTime = t;
          setCurrentTime(t);
        }
      } catch {}
    };
    // If metadata already loaded
    if (v.readyState >= 1) tryResume();
    else v.addEventListener("loadedmetadata", tryResume);
    return () => v.removeEventListener("loadedmetadata", tryResume);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl, STORAGE_KEY]);

  // mini timeline click seek
  const timelineRef = useRef(null);
  const handleTimelineClick = (e) => {
    const v = videoRef.current;
    const el = timelineRef.current;
    if (!v || !el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    v.currentTime = (v.duration || 0) * pct;
    setCurrentTime(v.currentTime);
  };

  return (
    <div className="pt-20 max-w-5xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-neutral-900/70 p-4 rounded-xl border border-neutral-800 shadow-lg max-h-[70vh] overflow-y-auto">
          <h3 className="text-sm text-neutral-300 mb-3 font-semibold">Steps</h3>
          <div className="space-y-2">
            {katha.steps.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isDone = completedSteps.includes(idx) || (isCompleted && idx === currentStepIndex);
              const canJump = idx <= Math.max(...(completedSteps.length ? completedSteps : [0])) + 1;
              return (
                <button
                  key={idx}
                  onClick={() => canJump && onJumpToStep?.(idx)}
                  disabled={!canJump}
                  className={`w-full text-left p-2 rounded mb-1 ${isActive ? "bg-orange-500 text-black font-semibold" : isDone ? "bg-green-600 text-black" : "bg-neutral-800 text-white hover:bg-neutral-700"}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Step {s.stepNumber + 1}</div>
                    <div className="text-xs text-neutral-300">{isDone ? "✓" : ""}</div>
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">{s.text.slice(0, 50)}...</div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main */}
        <main className="md:col-span-3 rounded-2xl p-6 bg-neutral-900/70 border border-neutral-800 shadow-lg">
          <h2 className="text-xl font-bold text-orange-400 mb-4">{katha.title} — Step {step.stepNumber + 1} / {katha.steps.length}</h2>

          {/* Video */}
          {videoUrl ? (
            <div className="relative mb-4 rounded overflow-hidden border border-orange-500/30 shadow-md">
              <video ref={videoRef} src={videoUrl} controls={false} playsInline className="w-full bg-black" />
              {/* Overlay centered Start */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <button onClick={handlePlay} className="px-6 py-3 rounded-full bg-orange-500 text-black font-semibold text-lg shadow-lg hover:bg-orange-600">
                    ▶️ Start Katha
                  </button>
                </div>
              )}
              {/* Pause control */}
              {isPlaying && (
                <div className="absolute top-4 right-4">
                  <button onClick={handlePause} className="px-4 py-2 bg-neutral-800/80 text-white rounded-lg">⏸ Pause</button>
                </div>
              )}

              {/* mini timeline */}
              <div className="p-3 bg-neutral-900/50">
                <div
                  ref={timelineRef}
                  onClick={handleTimelineClick}
                  className="relative h-3 bg-neutral-800 rounded cursor-pointer"
                >
                  {/* buffered */}
                  <div style={{ width: `${(bufferedEnd / (duration || 1)) * 100}%` }} className="absolute left-0 top-0 bottom-0 bg-neutral-700 rounded" />
                  {/* watched */}
                  <div style={{ width: `${Math.min(100, watchedPercent)}%` }} className="absolute left-0 top-0 bottom-0 bg-orange-500 rounded" />
                </div>

                <div className="flex justify-between items-center text-xs text-neutral-400 mt-2">
                  <div>{formatTime(currentTime)}</div>
                  <div>{duration ? formatTime(duration) : "--:--"} • {Math.min(100, watchedPercent)}%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 rounded p-6 bg-neutral-800 text-neutral-300">No video for this step</div>
          )}

          {/* Instruction */}
          <p className="text-neutral-300 mb-3"><span className="font-semibold text-orange-400">📜 Instruction:</span> {step.text}</p>
          {step.mantra && <p className="mt-2 text-orange-300 italic border-l-4 border-orange-500 pl-3">🔤 {step.mantra}</p>}
          {step.meaning && <p className="mt-3 text-neutral-400">💬 {step.meaning}</p>}

          {/* Controls */}
          <div className="mt-6 flex justify-between items-center">
            <div className="flex gap-2">
              <button onClick={onPrevious} className="px-5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700">⬅️ Previous</button>
              <button onClick={onNext} className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600">{currentStepIndex + 1 === katha.steps.length ? "Finish ✅" : "Next ➡️"}</button>
            </div>

            <div className="flex items-center gap-3">
              {/* Completed badge or Mark Complete */}
              {isCompleted ? (
                <div className="px-3 py-1 bg-green-600 text-black rounded font-semibold text-sm">Completed ✓</div>
              ) : (
                <button onClick={handleManualMarkComplete} disabled={manualMarking} className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-sm">
                  {manualMarking ? "Marking..." : "Mark Complete"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-neutral-400">Completed: {completedSteps.length + (isCompleted && !completedSteps.includes(currentStepIndex) ? 1 : 0)}/{katha.steps.length}</div>
        </main>
      </div>
    </div>
  );
}

// small helper
function formatTime(secs = 0) {
  if (!secs || isNaN(secs)) return "00:00";
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
  const h = Math.floor(secs / 3600);
  return h ? `${h}:${m}:${s}` : `${m}:${s}`;
}

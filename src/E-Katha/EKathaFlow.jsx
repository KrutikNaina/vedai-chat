import React from "react";
import { useKathaLoader } from "./hooks/useKathaLoader";
import { useKathaProgress } from "./hooks/useKathaProgress";

import KathaSelection from "./KathaSelection";
import KathaIntro from "./KathaIntro";
import KathaSteps from "./KathaSteps";
import KathaCompletion from "./KathaCompletion";

export default function EKathaFlow() {
  const token = localStorage.getItem("token");

  const { kathas, selectedKatha, progress, loadKatha } = useKathaLoader(token);

  const {
    currentStepIndex,
    completedSteps,
    goToStep,
    next,
    prev,
  } = useKathaProgress(selectedKatha, progress?.currentStep || 0, token);

  const [screen, setScreen] = React.useState("selection");

  const handleSelect = async (katha) => {
    await loadKatha(katha._id);
    setScreen("intro");
  };

  if (screen === "selection")
    return <KathaSelection kathas={kathas} onSelect={handleSelect} />;

  if (!selectedKatha) return null;

  if (screen === "intro")
    return <KathaIntro katha={selectedKatha} onStart={() => setScreen("steps")} />;

  if (screen === "steps")
    return (
      <KathaSteps
        katha={selectedKatha}
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
        onNext={next}
        onPrevious={prev}
        onJumpToStep={goToStep}
      />
    );

  if (screen === "completion")
    return (
      <KathaCompletion
        katha={selectedKatha}
        onRestart={() => setScreen("selection")}
      />
    );

  return null;
}

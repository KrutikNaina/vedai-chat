import { useState } from "react";
import { saveProgress } from "../api/progressApi";

export const useKathaProgress = (selectedKatha, initialStep = 0, token) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState(
    Array.from({ length: initialStep + 1 }, (_, i) => i)
  );

  const canGoTo = (index) => {
    const max = Math.max(...completedSteps) + 1;
    return index <= max;
  };

  const goToStep = async (index) => {
    if (!selectedKatha || !canGoTo(index)) return;

    setCurrentStepIndex(index);
    if (!completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index]);
    }

    if (token) {
      await saveProgress(selectedKatha._id, index, token);
    }
  };

  const next = () => goToStep(currentStepIndex + 1);
  const prev = () => goToStep(currentStepIndex - 1);

  return { currentStepIndex, completedSteps, goToStep, next, prev };
};

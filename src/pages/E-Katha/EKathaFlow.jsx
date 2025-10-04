// vedai-landing\src\pages\E-Katha\EKathaFlow.jsx
import { useEffect, useState } from "react";
import KathaSelection from "./KathaSelection";
import KathaIntro from "./KathaIntro";
import KathaSteps from "./KathaSteps";
import KathaCompletion from "./KathaCompletion";
import { fetchKathas, fetchKathaById, saveProgress, getProgress } from "../../api/ekathaApi";

export default function EKathaFlow() {
  const [currentStep, setCurrentStep] = useState("selection"); // selection → intro → steps → completion
  const [kathas, setKathas] = useState([]);
  const [selectedKatha, setSelectedKatha] = useState(null);
  const [progress, setProgress] = useState(0);

  // Get JWT token from localStorage (or wherever you store it)
  const token = localStorage.getItem("token");

  // Load all Kathas
  useEffect(() => {
    const loadKathas = async () => {
      try {
        const data = await fetchKathas();
        setKathas(data);
      } catch (err) {
        console.error("Error fetching kathas:", err);
      }
    };
    loadKathas();
  }, []);

  // Handle Katha selection
  const handleKathaSelect = async (katha) => {
    try {
      const fullKatha = await fetchKathaById(katha._id);
      setSelectedKatha({ ...fullKatha, stepsIndex: 0 });

      // Load user progress
      if (token) {
        try {
          const userProgress = await getProgress(katha._id, token);
          if (userProgress?.currentStep) {
            setSelectedKatha((prev) => ({ ...prev, stepsIndex: userProgress.currentStep }));
          }
        } catch (err) {
          console.log("No progress found for this user.");
        }
      }

      setCurrentStep("intro");
    } catch (err) {
      console.error("Error fetching katha details:", err);
    }
  };

  // Start Katha
  const handleStartKatha = () => setCurrentStep("steps");

  // Next step
  const handleStepNext = async () => {
    if (selectedKatha.stepsIndex + 1 < selectedKatha.steps.length) {
      const newIndex = selectedKatha.stepsIndex + 1;
      setSelectedKatha((prev) => ({ ...prev, stepsIndex: newIndex }));

      // Save progress
      if (token) {
        try {
          await saveProgress(selectedKatha._id, newIndex, token);
        } catch (err) {
          console.error("Error saving progress:", err);
        }
      }
    } else {
      setCurrentStep("completion");
    }
  };

  // Previous step
  const handleStepPrevious = () => {
    if (selectedKatha.stepsIndex > 0) {
      setSelectedKatha((prev) => ({ ...prev, stepsIndex: prev.stepsIndex - 1 }));
    } else {
      setCurrentStep("intro");
    }
  };

  // Restart Katha
  const handleRestart = () => {
    setCurrentStep("selection");
    setSelectedKatha(null);
  };

  return (
    <>
      {currentStep === "selection" && (
        <KathaSelection kathas={kathas} onSelect={handleKathaSelect} />
      )}

      {currentStep === "intro" && selectedKatha && (
        <KathaIntro katha={selectedKatha} onStart={handleStartKatha} />
      )}

      {currentStep === "steps" && selectedKatha && (
        <KathaSteps
          katha={selectedKatha}
          currentStepIndex={selectedKatha.stepsIndex}
          onNext={handleStepNext}
          onPrevious={handleStepPrevious}
        />
      )}

      {currentStep === "completion" && selectedKatha && (
        <KathaCompletion katha={selectedKatha} onRestart={handleRestart} />
      )}
    </>
  );
}

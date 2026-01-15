// src/hooks/useSessionTimeout.js
import { useEffect, useRef } from "react";

export default function useSessionTimeout(onTimeout, delay) {
  const timer = useRef(null);

  const resetTimer = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(onTimeout, delay);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // start timer

    return () => {
      clearTimeout(timer.current);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);
}

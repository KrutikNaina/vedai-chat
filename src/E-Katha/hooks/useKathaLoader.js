import { useEffect, useState } from "react";
import { fetchKathas, fetchKathaById } from "../api/ekathaApi";
import { getProgress } from "../api/progressApi";

export const useKathaLoader = (token) => {
  const [kathas, setKathas] = useState([]);
  const [selectedKatha, setSelectedKatha] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    (async () => {
      setKathas(await fetchKathas());
    })();
  }, []);

  const loadKatha = async (id) => {
    const k = await fetchKathaById(id);
    setSelectedKatha(k);

    if (token) {
      const userProgress = await getProgress(id, token).catch(() => null);
      setProgress(userProgress);
    }
  };

  return { kathas, selectedKatha, progress, loadKatha };
};

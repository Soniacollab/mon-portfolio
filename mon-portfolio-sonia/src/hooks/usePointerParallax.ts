// ------------------ Hook pour l'effet parallax au mouvement de la souris ------------------ //
import { useRef } from "react";


// J'utilise ce hook pour que la souris crée un effet de parallax sur l'élément référencé
// C'est à dire que l'élément bouge légèrement en fonction de la position de la souris
export const usePointerParallax = <T extends HTMLElement>() => {

  // Référence vers l'élément à animer
  const containerRef = useRef<T | null>(null);
  // Pour éviter de faire trop de calculs à chaque mouvement de souris
  const frameRequested = useRef(false);


  // Gestion du mouvement de la souris
  // Si une frame est déjà demandée on ne fait rien
  const handlePointerMove = (e: React.PointerEvent) => {
    if (frameRequested.current) return;
    frameRequested.current = true;


    // On utilise requestAnimationFrame pour optimiser les calculs
    requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;

      // Calculer la position de la souris par rapport au centre de l'élément
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      frameRequested.current = false;
    });
  };

  const resetPointer = () => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  };

  return { containerRef, handlePointerMove, resetPointer };
};

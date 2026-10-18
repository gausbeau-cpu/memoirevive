"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { SITE_CONTENT } from "@/content/site";
import { GALLERY_SLOTS } from "@/content/gallery";

interface HeroCycleContextType {
  currentIndex: number;
  previousIndex: number | null;
  isTransitioning: boolean;
  isPaused: boolean;
  isUserPaused: boolean;
  isMounted: boolean;
  isReducedMotion: boolean;
  cycleKey: number;
  goToIndex: (index: number) => void;
  registerHeroRef: (node: HTMLElement | null) => void;
  totalSlots: number;
  totalHeadlines: number;
}

const HeroCycleContext = createContext<HeroCycleContextType | null>(null);

const CYCLE_DURATION_MS = 3200;
const INITIAL_DELAY_MS = 3500;
const TRANSITION_DURATION_MS = 700;
const USER_PAUSE_DURATION_MS = 8000;

export function HeroCycleProvider({ children }: { children: React.ReactNode }) {
  const totalSlots = GALLERY_SLOTS.length || 4;
  const totalHeadlines = SITE_CONTENT.hero.endings?.length || 4;
  const cycleCount = Math.max(totalSlots, totalHeadlines);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isUserPaused, setIsUserPaused] = useState<boolean>(false);
  const [cycleKey, setCycleKey] = useState<number>(0);

  const heroRef = useRef<HTMLElement | null>(null);
  const currentIndexRef = useRef<number>(0);
  const isDocumentVisibleRef = useRef<boolean>(true);
  const isIntersectingRef = useRef<boolean>(true);
  const isUserPausedRef = useRef<boolean>(false);
  const cycleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userPauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const registerHeroRef = useCallback((node: HTMLElement | null) => {
    heroRef.current = node;
  }, []);

  // 1. Détection initiale : montage et prefers-reduced-motion
  useEffect(() => {
    setIsMounted(true);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  // 2. Gestion des pauses : visibilité de l'onglet et intersection avec l'écran
  useEffect(() => {
    const checkPauseState = () => {
      const paused =
        !isDocumentVisibleRef.current ||
        !isIntersectingRef.current ||
        isUserPausedRef.current;
      setIsPaused(paused);
    };

    const handleVisibility = () => {
      isDocumentVisibleRef.current = !document.hidden;
      checkPauseState();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let observer: IntersectionObserver | null = null;
    const target = heroRef.current || (typeof document !== "undefined" ? document.getElementById("hero-section") : null);
    if (typeof IntersectionObserver !== "undefined" && target) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isIntersectingRef.current = entry.isIntersecting;
          checkPauseState();
        },
        { threshold: 0.1 }
      );
      observer.observe(target);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (observer) observer.disconnect();
    };
  }, []);

  // 3. Mécanique de changement d'index (transition synchrone)
  const advanceTo = useCallback(
    (nextIdx: number, fromUser = false) => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      const prev = currentIndexRef.current;
      currentIndexRef.current = nextIdx;
      setPreviousIndex(prev);
      setCurrentIndex(nextIdx);
      setIsTransitioning(true);
      setCycleKey((k) => k + 1);

      // Fin de la transition de fondu (700 ms)
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setPreviousIndex(null);
      }, TRANSITION_DURATION_MS);
    },
    []
  );

  // 4. Action manuelle utilisateur (clic sur un indicateur)
  const goToIndex = useCallback(
    (targetIndex: number) => {
      if (targetIndex === currentIndexRef.current) return;

      // Annuler les timers actuels
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
      if (userPauseTimeoutRef.current) clearTimeout(userPauseTimeoutRef.current);

      advanceTo(targetIndex, true);

      // Si mouvement réduit activé, pas de timer de reprise
      if (isReducedMotion) return;

      // Déclenche la pause utilisateur de 8 s
      isUserPausedRef.current = true;
      setIsUserPaused(true);
      setIsPaused(true);

      userPauseTimeoutRef.current = setTimeout(() => {
        isUserPausedRef.current = false;
        setIsUserPaused(false);
        setIsPaused(!isDocumentVisibleRef.current || !isIntersectingRef.current);

        // Reprise du cycle normal après les 8 s
        scheduleNextCycle(CYCLE_DURATION_MS);
      }, USER_PAUSE_DURATION_MS);
    },
    [advanceTo, isReducedMotion]
  );

  // 5. Planification du prochain cycle automatique
  const scheduleNextCycle = useCallback(
    (delayMs: number) => {
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);

      cycleTimeoutRef.current = setTimeout(() => {
        // Si pause active, réessayer dans 300 ms
        if (
          !isDocumentVisibleRef.current ||
          !isIntersectingRef.current ||
          isUserPausedRef.current
        ) {
          scheduleNextCycle(300);
          return;
        }

        const next = (currentIndexRef.current + 1) % cycleCount;
        advanceTo(next);
        scheduleNextCycle(CYCLE_DURATION_MS);
      }, delayMs);
    },
    [advanceTo, cycleCount]
  );

  // 6. Démarrage du cycle après montage et chargement des polices
  useEffect(() => {
    if (!isMounted || isReducedMotion || cycleCount <= 1) return;

    let isCancelled = false;

    const initLifecycle = async () => {
      if (typeof document !== "undefined" && "fonts" in document) {
        try {
          await document.fonts.ready;
        } catch {
          /* continuation */
        }
      }
      if (isCancelled) return;

      // Premier changement 3,5 s après montage
      scheduleNextCycle(INITIAL_DELAY_MS);
    };

    initLifecycle();

    return () => {
      isCancelled = true;
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      if (userPauseTimeoutRef.current) clearTimeout(userPauseTimeoutRef.current);
    };
  }, [isMounted, isReducedMotion, cycleCount, scheduleNextCycle]);

  return (
    <HeroCycleContext.Provider
      value={{
        currentIndex,
        previousIndex,
        isTransitioning,
        isPaused,
        isUserPaused,
        isMounted,
        isReducedMotion,
        cycleKey,
        goToIndex,
        registerHeroRef,
        totalSlots,
        totalHeadlines,
      }}
    >
      {children}
    </HeroCycleContext.Provider>
  );
}

export function useHeroCycle() {
  const context = useContext(HeroCycleContext);
  if (!context) {
    // Valeurs par défaut autonomes de secours si utilisé hors provider
    return {
      currentIndex: 0,
      previousIndex: null,
      isTransitioning: false,
      isPaused: false,
      isUserPaused: false,
      isMounted: false,
      isReducedMotion: false,
      cycleKey: 0,
      goToIndex: () => {},
      registerHeroRef: () => {},
      totalSlots: 4,
      totalHeadlines: 4,
    };
  }
  return context;
}

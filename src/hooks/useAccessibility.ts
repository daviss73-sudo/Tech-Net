import { useState, useCallback, useEffect } from 'react';
import { AccessibilitySettings } from '../types/game';

const A11Y_STORAGE_KEY = 'technet-accessibility';

function loadSettings(): AccessibilitySettings {
  try {
    const saved = localStorage.getItem(A11Y_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return {
    highContrast: false,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    textScale: 1,
    screenReaderMode: false,
  };
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }

    const root = document.documentElement;
    root.style.setProperty('--text-scale', String(settings.textScale));
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('reduced-motion', settings.reducedMotion);
  }, [settings]);

  const toggleHighContrast = useCallback(() => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  }, []);

  const setTextScale = useCallback((scale: number) => {
    setSettings(prev => ({ ...prev, textScale: Math.max(0.8, Math.min(1.5, scale)) }));
  }, []);

  const toggleScreenReader = useCallback(() => {
    setSettings(prev => ({ ...prev, screenReaderMode: !prev.screenReaderMode }));
  }, []);

  return {
    settings,
    toggleHighContrast,
    toggleReducedMotion,
    setTextScale,
    toggleScreenReader,
  };
}

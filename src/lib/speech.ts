import { useCallback, useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyRecognition = any;

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "en-IN") ??
    voices.find((v) => v.lang === "en-GB") ??
    voices.find((v) => v.lang.startsWith("en")) ??
    null
  );
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, rate = 0.9) {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? "en-IN";
  u.rate = rate;
  window.speechSynthesis.speak(u);
}

export type RecognitionError = "denied" | "no-speech" | "other" | null;

export function useSpeechRecognition() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<RecognitionError>(null);
  const recRef = useRef<AnyRecognition>(null);

  useEffect(() => {
    const w = window as any;
    setSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    // Warm up the voice list (Chrome loads it lazily).
    if (canSpeak()) window.speechSynthesis.getVoices();
    return () => recRef.current?.abort?.();
  }, []);

  const start = useCallback((onResult: (alternatives: string[]) => void) => {
    const w = window as any;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    recRef.current?.abort?.();
    const rec: AnyRecognition = new Ctor();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    rec.continuous = false;
    setError(null);
    let gotResult = false;
    rec.onresult = (e: any) => {
      gotResult = true;
      const res = e.results[0];
      const alts: string[] = [];
      for (let i = 0; i < res.length; i++) alts.push(res[i].transcript);
      onResult(alts);
    };
    rec.onerror = (e: any) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setError("denied");
      else if (e.error === "no-speech") setError("no-speech");
      else if (e.error !== "aborted") setError("other");
    };
    rec.onend = () => {
      setListening(false);
      if (!gotResult) setError((prev) => prev ?? "no-speech");
    };
    recRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
      setError("other");
    }
  }, []);

  const stop = useCallback(() => recRef.current?.stop?.(), []);

  return { supported, listening, error, start, stop };
}

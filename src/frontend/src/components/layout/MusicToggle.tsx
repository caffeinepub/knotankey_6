import { Pause, Play } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const MUSIC_SRC =
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_115b9b8c69.mp3";
const TARGET_VOLUME = 0.2;
const FADE_DURATION_MS = 1500;
const FADE_STEPS = 60;

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const clearFade = useCallback(() => {
    if (fadeIntervalRef.current !== null) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  const fadeIn = useCallback(
    (audio: HTMLAudioElement) => {
      clearFade();
      audio.volume = 0;
      const stepSize = TARGET_VOLUME / FADE_STEPS;
      const intervalMs = FADE_DURATION_MS / FADE_STEPS;

      fadeIntervalRef.current = setInterval(() => {
        if (!audioRef.current) {
          clearFade();
          return;
        }
        const next = Math.min(
          audioRef.current.volume + stepSize,
          TARGET_VOLUME,
        );
        audioRef.current.volume = next;
        if (next >= TARGET_VOLUME) {
          clearFade();
        }
      }, intervalMs);
    },
    [clearFade],
  );

  const toggle = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(MUSIC_SRC);
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
    }

    if (isPlaying) {
      clearFade();
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      fadeIn(audioRef.current);
      audioRef.current.play().catch(() => {
        // Browser may block autoplay; user interaction required
        clearFade();
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [isPlaying, clearFade, fadeIn]);

  return (
    <button
      type="button"
      onClick={toggle}
      className="p-2 text-warm-tan hover:text-warm-brown transition-all duration-300 relative"
      aria-label={
        isPlaying ? "Pause background music" : "Play background music"
      }
      title={isPlaying ? "Pause music" : "Play music"}
    >
      <span
        className={`transition-all duration-300 ${isPlaying ? "opacity-100" : "opacity-60"}`}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </span>
    </button>
  );
}

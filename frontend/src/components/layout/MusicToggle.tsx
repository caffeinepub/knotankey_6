import { useRef, useState } from 'react';
import { Music, VolumeX } from 'lucide-react';

/* AUDIO FILE PLACEHOLDER: Place your background music file at public/assets/music/background.mp3 */
const MUSIC_SRC = '/assets/music/background.mp3';

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_SRC);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // Browser may block autoplay; user interaction required
      });
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className="p-2 text-warm-tan hover:text-warm-brown transition-all duration-300 relative"
      aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
      title={isPlaying ? 'Mute music' : 'Play music'}
    >
      <span className={`transition-all duration-300 ${isPlaying ? 'opacity-100' : 'opacity-60'}`}>
        {isPlaying ? (
          <Music className="w-4 h-4 animate-pulse" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </span>
    </button>
  );
}

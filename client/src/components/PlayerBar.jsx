import { usePlayer } from "../context/PlayerContext";
import { Pause, Play, Volume2 } from "lucide-react";

export default function PlayerBar() {
  const { currentTrack, isPlaying, togglePlay, volume, setVolume } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t px-6 py-3 flex justify-between items-center z-50">
      <div className="flex items-center gap-3">
        <img src={currentTrack.coverImage} alt="cover" className="w-12 h-12 rounded" />
        <div>
          <p className="text-sm font-medium">{currentTrack.title}</p>
          <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={togglePlay}>
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Volume2 className="w-4 h-4" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24"
        />
      </div>
    </div>
  );
}

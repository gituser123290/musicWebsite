import { usePlayer } from "../context/PlayerContext"
import { Pause, Play } from "lucide-react"

export default function GlobalPlayer() {
  const { currentTrack, isPlaying, togglePlay } = usePlayer()

  if (!currentTrack) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 text-white p-4 shadow-md flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <img
          src={currentTrack.cover}
          alt={currentTrack.title}
          className="w-14 h-14 object-cover rounded"
        />
        <div>
          <h4 className="text-lg font-medium">{currentTrack.title}</h4>
          <p className="text-sm text-zinc-400">{currentTrack.artist}</p>
        </div>
      </div>

      <button
        onClick={togglePlay}
        className="bg-zinc-700 hover:bg-zinc-600 p-3 rounded-full"
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
    </div>
  )
}

import { usePlayer } from "../context/PlayerContext";
import { Heart, Play } from "lucide-react";
import { useState } from "react";

export default function SongCard({ song }) {
  const { playTrack } = usePlayer();
  const [liked, setLiked] = useState(false);

  const handlePlay = () => playTrack(song);
  const toggleLike = () => setLiked(!liked);

  return (
    <div
      className="bg-muted rounded-lg overflow-hidden shadow group hover:shadow-lg cursor-pointer relative transition"
      onClick={handlePlay}
    >
      <img src={song.coverImage} alt={song.title} className="w-full h-48 object-cover" />
      <div className="p-3">
        <h3 className="font-semibold text-lg truncate">{song.title}</h3>
        <p className="text-sm text-gray-400 truncate">{song.artist}</p>
        <p className="text-xs mt-1 text-gray-500">{song.duration} min</p>
      </div>
      <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
        <button onClick={toggleLike}>
          <Heart className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : "text-gray-300"}`} />
        </button>
      </div>
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <Play className="text-white w-10 h-10" />
      </div>
    </div>
  );
}

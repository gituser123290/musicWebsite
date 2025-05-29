import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaRegHeart,
  FaDownload,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
  TbChartBarPopular,
} from "react-icons/tb";
import { CiStreamOn } from "react-icons/ci";
import Loading from "../../layouts/Loading";

export default function PopularSong() {
  const [populars, setPopulars] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedTracks, setLikedTracks] = useState(new Set());

  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0); // progress in seconds

  const [theme, setTheme] = useState("dark"); // "dark" or "light"

  const audioRefs = useRef([]);

  // Fetch popular songs
  useEffect(() => {
    const popularSongs = async () => {
      try {
        const response = await api.get("/songs/popularity");
        setPopulars(response.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    popularSongs();
  }, []);

  // Handle play/pause of a track
  const playPauseSong = (index) => {
    if (currentTrackIndex === index && isPlaying) {
      audioRefs.current[index].pause();
      setIsPlaying(false);
    } else {
      // Pause any currently playing audio
      if (
        currentTrackIndex !== null &&
        audioRefs.current[currentTrackIndex]
      ) {
        audioRefs.current[currentTrackIndex].pause();
      }
      // Play new track
      audioRefs.current[index].volume = volume;
      audioRefs.current[index].play();
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  // On audio time update update progress state
  const onTimeUpdate = (index) => {
    if (audioRefs.current[index]) {
      setProgress(audioRefs.current[index].currentTime);
    }
  };

  // On audio ended reset states
  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTrackIndex(null);
    setProgress(0);
  };

  // Seek audio to position
  const onSeek = (e) => {
    if (currentTrackIndex !== null && audioRefs.current[currentTrackIndex]) {
      const seekTime =
        (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) *
        audioRefs.current[currentTrackIndex].duration;
      audioRefs.current[currentTrackIndex].currentTime = seekTime;
      setProgress(seekTime);
    }
  };

  // Volume change handler
  const onVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (currentTrackIndex !== null && audioRefs.current[currentTrackIndex]) {
      audioRefs.current[currentTrackIndex].volume = newVolume;
    }
  };

  // Toggle like track
  const toggleLike = (songId) => {
    const updatedLikes = new Set(likedTracks);
    if (updatedLikes.has(songId)) {
      updatedLikes.delete(songId);
    } else {
      updatedLikes.add(songId);
    }
    setLikedTracks(updatedLikes);
  };

  // Theme toggle handler
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Format time from seconds to mm:ss
  const formatTime = (secs) => {
    if (!secs) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20 text-xl">
        Error loading data. Please try again later.
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-10 px-6 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-b from-black via-gray-900 to-black text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex justify-end max-w-7xl mx-auto mb-6">
        <button
          onClick={toggleTheme}
          aria-label="Toggle light/dark theme"
          className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            theme === "dark"
              ? "bg-gray-800 hover:bg-gray-700 focus:ring-purple-500"
              : "bg-white hover:bg-gray-200 focus:ring-purple-600"
          } transition-colors`}
        >
          {theme === "dark" ? (
            <FaSun className="text-yellow-400 w-6 h-6" />
          ) : (
            <FaMoon className="text-gray-800 w-6 h-6" />
          )}
        </button>
      </div>

      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide select-none">
        🔥 Popular Songs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {populars.map((song, index) => {
          const isCurrent = currentTrackIndex === index;
          const audioDuration =
            audioRefs.current[index]?.duration || 0;

          const progressPercent =
            audioDuration > 0
              ? Math.min((progress / audioDuration) * 100, 100)
              : 0;

          return (
            <div
              key={song.song_id}
              className={`rounded-xl shadow-xl flex flex-col transition-shadow duration-500 group relative
              ${
                theme === "dark"
                  ? "bg-gray-900 hover:shadow-2xl"
                  : "bg-white hover:shadow-lg"
              }
              `}
            >
              <div className="relative overflow-hidden rounded-t-xl select-none">
                <img
                  src={song.album_cover_url || `http://localhost:8000${song.album_cover_url || ""}`}
                  alt={`${song.name} album cover`}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <button
                  onClick={() => playPauseSong(index)}
                  aria-label={
                    isPlaying && isCurrent ? "Pause" : "Play"
                  }
                  className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                >
                  {isPlaying && isCurrent ? (
                    <FaPause className="text-white text-5xl drop-shadow-lg animate-pulse" />
                  ) : (
                    <FaPlay className="text-white text-5xl drop-shadow-lg" />
                  )}
                </button>

                {isPlaying && isCurrent && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 select-none">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-purple-500 rounded w-1 h-4 animate-wave"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                    <style>{`
                      @keyframes wave {
                        0%, 100% {
                          height: 4px;
                          opacity: 0.6;
                        }
                        50% {
                          height: 12px;
                          opacity: 1;
                        }
                      }
                      .animate-wave {
                        animation: wave 1.2s infinite ease-in-out;
                      }
                    `}</style>
                  </div>
                )}
              </div>

              <div className="flex flex-col p-5 flex-grow">
                <h2
                  className={`font-semibold text-lg truncate ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                  title={song.name}
                >
                  {song.name}
                </h2>
                <p
                  className={`mt-1 truncate italic ${
                    theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                  title={song.artist}
                >
                  {song.artist}
                </p>
                <p
                  className={`mt-1 text-sm truncate ${
                    theme === "dark"
                      ? "text-gray-500"
                      : "text-gray-500"
                  }`}
                  title={song.album}
                >
                  {song.album}
                </p>

                <div className="flex justify-between mt-5 text-sm font-semibold">
                  <div
                    className="flex items-center space-x-1 cursor-default select-none"
                    title="Popularity Score"
                  >
                    <TbChartBarPopular
                      className="text-purple-500 text-xl"
                      aria-hidden="true"
                    />
                    <span>{Math.floor(song.popularity_score)}</span>
                  </div>
                  <div
                    className="flex items-center space-x-1 cursor-default select-none"
                    title="Streams"
                  >
                    <CiStreamOn
                      className="text-purple-500 text-xl"
                      aria-hidden="true"
                    />
                    <span>{song.streams.toLocaleString()}</span>
                  </div>
                  <div
                    className="flex items-center space-x-1 cursor-default select-none"
                    title="Downloads"
                  >
                    <FaDownload
                      className="text-purple-500 text-xl"
                      aria-hidden="true"
                    />
                    <span>{song.downloads.toLocaleString()}</span>
                  </div>
                </div>
              </div>

            
              <div
                className={`p-4 border-t ${
                  theme === "dark"
                    ? "border-gray-700"
                    : "border-gray-300"
                } select-none`}
              >
                <div
                  className="w-full h-2 bg-gray-700 rounded cursor-pointer relative"
                  onClick={onSeek}
                  aria-label="Seek audio track"
                  role="slider"
                  aria-valuemin={0}
                  aria-valuemax={
                    audioRefs.current[currentTrackIndex]?.duration || 0
                  }
                  aria-valuenow={progress}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (
                      currentTrackIndex !== null &&
                      audioRefs.current[currentTrackIndex]
                    ) {
                      const audio = audioRefs.current[currentTrackIndex];
                      if (e.key === "ArrowRight") {
                        audio.currentTime = Math.min(
                          audio.currentTime + 5,
                          audio.duration
                        );
                        setProgress(audio.currentTime);
                      }
                      if (e.key === "ArrowLeft") {
                        audio.currentTime = Math.max(
                          audio.currentTime - 5,
                          0
                        );
                        setProgress(audio.currentTime);
                      }
                    }
                  }}
                >
                  <div
                    className="h-2 bg-purple-500 rounded transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div
                  className={`flex justify-between mt-1 text-xs ${
                    theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                >
                  <span>{formatTime(progress)}</span>
                  <span>
                    {formatTime(
                      audioRefs.current[currentTrackIndex]?.duration
                    )}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    aria-label="Previous track"
                    className={`text-xl p-2 rounded-full hover:bg-purple-600 hover:text-white transition-colors ${
                      theme === "dark" ? "text-purple-400" : "text-purple-600"
                    }`}
                    onClick={() => {
                      if (currentTrackIndex !== null) {
                        let prevIndex =
                          (currentTrackIndex - 1 + populars.length) %
                          populars.length;
                        playPauseSong(prevIndex);
                      }
                    }}
                  >
                    <TbPlayerTrackPrevFilled />
                  </button>

                  <button
                    aria-label={
                      isPlaying && isCurrent ? "Pause" : "Play"
                    }
                    className={`bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-transform active:scale-95`}
                    onClick={() => playPauseSong(index)}
                  >
                    {isPlaying && isCurrent ? (
                      <FaPause size={24} />
                    ) : (
                      <FaPlay size={24} />
                    )}
                  </button>

                  <button
                    aria-label="Next track"
                    className={`text-xl p-2 rounded-full hover:bg-purple-600 hover:text-white transition-colors ${
                      theme === "dark" ? "text-purple-400" : "text-purple-600"
                    }`}
                    onClick={() => {
                      if (currentTrackIndex !== null) {
                        let nextIndex =
                          (currentTrackIndex + 1) % populars.length;
                        playPauseSong(nextIndex);
                      }
                    }}
                  >
                    <TbPlayerTrackNextFilled />
                  </button>

                  {/* Volume slider */}
                  <div className="flex items-center space-x-2 w-28">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={onVolumeChange}
                      className="w-full cursor-pointer accent-purple-600"
                      aria-label="Volume control"
                    />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      {Math.round(volume * 100)}%
                    </span>
                  </div>

                  {/* Like button */}
                  <button
                    aria-label={
                      likedTracks.has(song.song_id)
                        ? "Unlike track"
                        : "Like track"
                    }
                    onClick={() => toggleLike(song.song_id)}
                    className={`ml-3 p-2 rounded-full transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      likedTracks.has(song.song_id)
                        ? "text-red-500"
                        : theme === "dark"
                        ? "text-gray-400 hover:text-red-500"
                        : "text-gray-600 hover:text-red-500"
                    }`}
                  >
                    {likedTracks.has(song.song_id) ? (
                      <FaHeart size={20} />
                    ) : (
                      <FaRegHeart size={20} />
                    )}
                  </button>
                </div>
              </div>
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={`http://localhost:8000${song.audio_file}`}
                onEnded={onEnded}
                onTimeUpdate={() => onTimeUpdate(index)}
                preload="none"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

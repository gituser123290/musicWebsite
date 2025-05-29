import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaRegHeart,
  FaComment,
  FaPlusSquare,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import { PiPlaylistFill } from "react-icons/pi";
import Loading from "../../layouts/Loading";
import { apiUrl } from "../../services/api";
import "../../styles/custom.css";
import axios from "axios";

// Simple floating music notes SVG animation
const FloatingNotes = () => (
  <svg
    className="floating-notes"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8b5cf6"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      position: "absolute",
      top: "-10px",
      right: "-10px",
      animation: "floatNotes 3s ease-in-out infinite",
      pointerEvents: "none",
      opacity: 0.7,
    }}
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
    <style>{`
      @keyframes floatNotes {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0.7;}
        50% { transform: translateY(-8px) translateX(6px); opacity: 1;}
      }
    `}</style>
  </svg>
);

export default function SongDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [song, setSong] = useState(null);
  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  // Audio playback states
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch song, comments, likes
  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Song details
        const songResponse = await axios.get(`${apiUrl}/songs/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setSong(songResponse.data);

        // Comments
        const commentsResponse = await axios.get(
          `${apiUrl}/comments/${id}`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setComments(commentsResponse.data);

        // Likes
        const likeResponse = await axios.get(
          `${apiUrl}/songs/${id}/likes/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setLikeCount(likeResponse.data.length);

        // Check if current user liked
        const currentUser = JSON.parse(sessionStorage.getItem("user"));
        const userLiked = likeResponse.data.some(
          (like) => like.user === currentUser?.id
        );
        setLiked(userLiked);

        setLoading(false);
      } catch (err) {
        setError(err.message || "Error loading song");
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // Audio metadata and time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [song]);

  // Play/pause toggle
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => console.error("Playback error", err));
      } else {
        setIsPlaying(true);
      }
    }
  };

  // Seek audio on progress bar click
  const seek = (e) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;

    audio.currentTime = newTime;
  };

  // Format seconds to mm:ss
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Handle comment submit
  const handleComment = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(
        `${apiUrl}/comment/${id}/`,
        { song: song.id, content: commentText },
        { headers: { Authorization: `Token ${token}` } }
      );
      setComments((prev) => [...prev, response.data]);
      setCommentText("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Like/unlike
  const handleLike = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (liked) {
        await axios.delete(`${apiUrl}/songs/${id}/like/delete/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setLikeCount((count) => count - 1);
        setLiked(false);
      } else {
        await axios.post(
          `${apiUrl}/songs/${id}/like/`,
          { song: song.id },
          { headers: { Authorization: `Token ${token}` } }
        );
        setLikeCount((count) => count + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error("Error liking song:", err);
    }
  };

  // Add song to playlist
  const addSongToPlaylist = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const playlistsResponse = await axios.get(`${apiUrl}/playlist`, {
        headers: { Authorization: `Token ${token}` },
      });
      const playlistId = playlistsResponse.data[0].id;
      await axios.put(
        `${apiUrl}/playlist/${playlistId}/add_song/`,
        { song_id: song.id },
        { headers: { Authorization: `Token ${token}` } }
      );
      alert("Song added to playlist");
    } catch (err) {
      setError(err.message);
    }
  };

  // Navigation helpers
  const browseSongs = (e) => {
    e.preventDefault();
    navigate("/allsongs");
  };

  const browsePlaylists = (e) => {
    e.preventDefault();
    navigate("/playlists");
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-600 text-center mt-4">Error: {error}</p>;
  if (!song) return null;

  return (
    <div className="w-full px-4 md:px-8 py-6 bg-gradient-to-r from-purple-700 to-indigo-700 min-h-screen text-white">
      <div className="flex justify-start mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition duration-300"
          title="Go Back"
          aria-label="Go Back"
        >
          Back
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
        {/* Song Cover and Player */}
        <div className="flex-1 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-xl p-6 flex flex-col items-center shadow-2xl relative">
          <img
            className="w-full max-w-xs rounded-lg shadow-lg"
            src={
              song.song_cover_url.startsWith("http")
                ? song.song_cover_url
                : `${song.song_cover_url}`
            }
            alt={`Cover for ${song.title}`}
          />
          <h2 className="mt-6 text-3xl font-bold text-center">{song.title}</h2>

          {/* Audio Element (hidden) */}
          <audio ref={audioRef} src={song.audio} preload="metadata" />

          {/* Custom Controls */}
          <div className="w-full mt-6">
            {/* Time display */}
            <div className="flex justify-between text-sm font-mono mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Progress Bar */}
            <div
              ref={progressBarRef}
              onClick={seek}
              className="w-full h-3 rounded-full bg-gray-400 cursor-pointer relative"
              role="slider"
              tabIndex={0}
              aria-label="Song progress bar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.toFixed(0)}
              onKeyDown={(e) => {
                if (!audioRef.current) return;
                if (e.key === "ArrowLeft") {
                  audioRef.current.currentTime = Math.max(
                    0,
                    audioRef.current.currentTime - 5
                  );
                }
                if (e.key === "ArrowRight") {
                  audioRef.current.currentTime = Math.min(
                    audioRef.current.duration,
                    audioRef.current.currentTime + 5
                  );
                }
              }}
            >
              <div
                className="h-3 rounded-full bg-orange-600 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Playback Buttons */}
            <div className="flex justify-center items-center space-x-6 mt-6 relative">
              <button
                className="p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
                title="Previous"
                aria-label="Previous song"
                // TODO: implement previous functionality
              >
                <TbPlayerTrackPrevFilled size={28} />
              </button>

              <button
                onClick={togglePlayPause}
                className="p-4 bg-purple-700 rounded-full shadow-xl hover:bg-purple-800 transition duration-300 relative flex justify-center items-center"
                title={isPlaying ? "Pause" : "Play"}
                aria-label={isPlaying ? "Pause" : "Play"}
                onMouseEnter={(e) => {
                  // show floating notes animation
                }}
              >
                {isPlaying ? <FaPause size={24} /> : <FaPlay size={28} />}
                {/* Floating notes SVG animation on hover */}
                <FloatingNotes />
              </button>

              <button
                className="p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
                title="Next"
                aria-label="Next song"
                // TODO: implement next functionality
              >
                <TbPlayerTrackNextFilled size={28} />
              </button>
            </div>
          </div>
        </div>

        {/* Song Info, Comments, Likes, Actions */}
        <div className="flex-1 bg-gradient-to-br from-purple-700 to-indigo-900 rounded-xl p-6 shadow-2xl flex flex-col space-y-6">
          <h2 className="text-3xl font-semibold text-center">{song.title}</h2>

          {/* Comments */}
          <div>
            <div className="flex items-center space-x-2 mb-3 text-lg">
              <FaComment size={22} />
              <span>{comments.length} Comments</span>
            </div>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-purple-600 py-2 last:border-none"
                >
                  <p className="text-gray-300 text-sm">
                    <span className="font-semibold text-white">
                      {comment.user.username}
                    </span>
                    : {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )}
          </div>

          {/* Like and count */}
          <div className="flex items-center space-x-2">
            {liked ? (
              <FaHeart
                onClick={handleLike}
                className="text-red-600 cursor-pointer hover:scale-110 transition-transform duration-200"
                size={24}
                title="Unlike"
                aria-label="Unlike"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleLike(e);
                }}
              />
            ) : (
              <FaRegHeart
                onClick={handleLike}
                className="text-gray-400 cursor-pointer hover:text-red-600 hover:scale-110 transition-all duration-200"
                size={24}
                title="Like"
                aria-label="Like"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleLike(e);
                }}
              />
            )}
            <span>{likeCount} {likeCount === 1 ? "Like" : "Likes"}</span>
          </div>

          {/* Comment form */}
          <form onSubmit={handleComment} className="w-full">
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-grow px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                aria-label="Write a comment"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition duration-300"
                title="Add Comment"
                aria-label="Add Comment"
              >
                <FaEnvelopeOpenText size={20} />
              </button>
            </div>
          </form>

          {/* Playlist Actions */}
          <div className="flex space-x-6 justify-center mt-6">
            <button
              onClick={addSongToPlaylist}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 transition duration-300 px-4 py-2 rounded-md shadow-md"
              title="Add to Playlist"
              aria-label="Add song to playlist"
            >
              <FaPlusSquare size={24} />
              <span>Add to Playlist</span>
            </button>

            <button
              onClick={browsePlaylists}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 transition duration-300 px-4 py-2 rounded-md shadow-md"
              title="Browse Playlists"
              aria-label="Browse playlists"
            >
              <PiPlaylistFill size={24} />
              <span>Playlists</span>
            </button>

            <button
              onClick={browseSongs}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 transition duration-300 px-4 py-2 rounded-md shadow-md"
              title="Browse Songs"
              aria-label="Browse all songs"
            >
              <TbPlayerTrackNextFilled size={24} />
              <span>Songs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


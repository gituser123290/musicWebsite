import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaComment, FaPlusSquare, FaEnvelopeOpenText } from "react-icons/fa";
import { PiPlaylistFill } from "react-icons/pi";
import Loading from "../../layouts/Loading";
import {apiUrl} from '../../services/api';
import '../../styles/custom.css';
import axios from "axios";

export default function SongDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState([]);
  // const [audioUrl, setAudioUrl] = useState('');
  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch song data, comments, and like status
  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch song details
        const songResponse = await axios.get(`${apiUrl}/songs/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        // setAudioUrl(`${apiUrl}${songResponse.data.audio}`);
        console.log(`Songs: ${songResponse.data.audio}`);
        setSong(songResponse.data);
        // Fetch comments
        const commentsResponse = await axios.get(`${apiUrl}/comments/${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setComments(commentsResponse.data);

        // Fetch like status and count
        const likeResponse = await axios.get(`${apiUrl}/songs/${id}/likes/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setLikeCount(likeResponse.data.length);

        // Check if the current user already liked the song
        const userLiked = likeResponse.data.some((like) => like.user === songResponse.data.user);
        setLiked(userLiked);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleComment = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!commentText.trim()) return;

    try {
      const response = await axios.post(`${apiUrl}/comment/${id}/`, 
        { song: song.id, content: commentText },
        { headers: { Authorization: `Token ${token}` } }
      );
      setComments((prevComments) => [...prevComments, response.data]);
      setCommentText("");
    } catch (error) {
      setError(error.message);
    }
  };

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
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setLikeCount(likeCount - 1);
        setLiked(false);
      } else {
        await axios.post(`${apiUrl}/songs/${id}/like/`, 
          { song: song.id },
          { headers: { Authorization: `Token ${token}` } }
        );
        setLikeCount(likeCount + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error("Error in like/dislike:", error);
    }
  };

  const addSongToPlaylist = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const playlistsResponse = await axios.get(apiUrl+'/playlist', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const playlistId = playlistsResponse.data[0].id;
      await axios.put(`${apiUrl}/playlist/${playlistId}/add_song/`, 
        { song_id: song.id },
        { headers: { Authorization: `Token ${token}` } }
      );
      alert("Song added to playlist");
    } catch (error) {
      setError(error.message);
    }
  };

  const browseSongs = (e) => {
    e.preventDefault();
    navigate("/allsongs");
  };

  const browsePlaylists = (e) => {
    e.preventDefault();
    navigate("/playlists");
  };

  // Audio Player interface
  const playPauseSong = () => {
    if (isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full">
      <div className="flex justify-start p-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-full shadow-xl hover:shadow-2xl transition duration-300"
        >
          Back
        </button>
      </div>
      <div className="flex justify-center space-x-10 px-8 py-8 songs_play">
        <div className="flex-1 p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-2xl flex flex-col items-center sm:w-full md:w-2/3 lg:w-1/2 xl:w-1/3 space-y-6">
          <div className="w-full h-auto max-w-xs">
            <img
              className="w-full object-cover rounded-lg shadow-md"
              src={song.song_cover_url.startsWith("http") ? song.song_cover_url : `${song.song_cover_url}`}
              alt="Song cover"
            />
          </div>
          <div className="text-center text-white text-2xl font-semibold">
            <h2>{song?.title}</h2>
          </div>
          <div className="w-full flex flex-col items-center space-y-4">
            <audio
              ref={(audio) => setAudioPlayer(audio)}
              controls
              className="w-full rounded-lg bg-gray-100 p-2"
              src={song.audio}
              type="audio/mp3"
            />
            <div className="flex justify-center space-x-8 mt-4">
              <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-2xl transition duration-300">
                <TbPlayerTrackPrevFilled size={24} />
              </button>
              <button onClick={playPauseSong} className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-2xl transition duration-300">
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={24} />}
              </button>
              <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-2xl transition duration-300">
                <TbPlayerTrackNextFilled size={24} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6 bg-gradient-to-r .songs_play_second from-purple-500 to-indigo-600 rounded-xl shadow-2xl flex flex-col items-center space-y-8 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
          <div className="text-center text-white text-2xl font-semibold">
            <h2>{song.title}</h2>
          </div>
          <div className="flex flex-col items-center space-y-6 mt-6">
            <div className="flex items-center space-x-2 text-white">
              <FaComment size={24} />
              <span>{comments.length} Comments</span>
            </div>
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-center w-full mt-2">
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">
                      <span className="font-semibold">{comment.user.username}</span>: {comment.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )}

            <div className="flex items-center space-x-2 text-white">
              {liked ? (
                <FaHeart onClick={handleLike} className="text-red-600 cursor-pointer" size={20} />
              ) : (
                <FaRegHeart onClick={handleLike} className="text-gray-500 cursor-pointer" size={20} />
              )}
              <span>{likeCount} Likes</span>
            </div>
            {likeCount > 0 && (
              <p className="text-gray-300">Liked by {likeCount} people</p>
            )}
            <form onSubmit={handleComment} className="w-full mt-6">
              <div className="flex items-center w-full">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-purple-600 transition duration-300"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-center gap-1 mt-4">
                <button type="submit" className="text-green-400 p-2 rounded-full transition duration-300">
                  <FaComment size={24} />
                </button>
                <div className="flex justify-center space-x-8 mt-2">
                  <button className="p-0 hover:text-amber-400 text-3xl">
                    <FaPlusSquare onClick={addSongToPlaylist} size={24} />
                  </button>
                  <button onClick={browseSongs} className="text-cyan-200 text-2xl p-0">
                    <FaEnvelopeOpenText size={24} />
                  </button>
                  <button onClick={browsePlaylists} className="text-cyan-200 text-2xl p-0">
                    <PiPlaylistFill size={24} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


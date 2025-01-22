import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaPlay, FaPause, FaHeartbeat, FaComment, FaPlusSquare, FaEnvelopeOpenText } from "react-icons/fa";
import Loading from "../../layouts/Loading";
import api from "../../services/api";


const SongDetail = () => {
  const { id } = useParams()
  const [song, setSong] = useState([]);
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState([]);
  const [countLike, setCountLike] = useState(0);
  const [countComment, setCountComment] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const songResponse = await api.get(`/songs/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setSong(songResponse.data);

        const commentsResponse = await api.get(`/comments/${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setComments(commentsResponse.data);
        setCountComment(commentsResponse.data.length);

        const likeResponse = await api.get(`/likes/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setLike(likeResponse.data);
        setCountLike(likeResponse.data.length);
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
      const response = await api.post(`/comment/${id}/`,
        {
          song: song.id,
          content: commentText,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
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
      const response = await api.post(`/like/${id}/`,
        {
          song: song.id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setLike((prevLikes) => [...prevLikes, response.data]);
    } catch (error) {
      setError(error.message);
    }
  };

  const browseSongs = async (e) => {
    e.preventDefault();
    navigate("/all-songs");
  }
  // Audio Player interface
  // Current Song 
  const playPauseSong = () => {
    if (isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) return <div><Loading /></div>;

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <div className="w-1/6 items-center pl-10 p-4 m-1 bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl transition-colors duration-200 cursor-pointer">
        <button onClick={() => navigate(-1)} className="text-white">
          Back to Posts
        </button>
      </div>
      <div className="flex items-center justify-center w-full pt-10 pb-16">
        <div className="flex items-center justify-center m-2 w-full flex-row space-x-8">  {/* Added flex-row and space-x-8 */}
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-xl flex flex-col items-center space-y-6">
            <div className="w-full mb-6 flex justify-center">
              <img
                className="w-full max-w-xs h-auto object-cover rounded-lg shadow-md"
                src={song.song_cover}
                alt="Song cover"
              />
            </div>
            <div className="text-center text-fuchsia-600 text-xl font-semibold">
              <h2>{song?.title}</h2>
            </div>
            <div className="w-full flex flex-col items-center space-y-4">
              <audio
                ref={(audio) => setAudioPlayer(audio)}
                controls
                className="w-full rounded-lg bg-gray-100 p-2"
                src={song.audio}
              />
              <div className="flex justify-center space-x-6 mt-4">
                <button
                  className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
                >
                  <TbPlayerTrackPrevFilled size={24} />
                </button>
                <button
                  onClick={playPauseSong}
                  className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
                >
                  {isPlaying ? <FaPause size={20} /> : <FaPlay size={24} />}
                </button>
                <button
                  // onClick={nextSong}
                  className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
                >
                  <TbPlayerTrackNextFilled size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-xl flex flex-col items-center space-y-6">
            <div className="flex justify-center space-x-20 mt-4">
              <button className="p-0 hover:text-amber-900 text-3xl">
                <FaPlusSquare size={24} />
              </button>
              <button onClick={handleLike} className="text-cyan-800 text-2xl p-0">
                <FaHeartbeat size={20} />
              </button>
              <button onClick={browseSongs} className="text-cyan-800 text-2xl p-0">
                <FaEnvelopeOpenText size={20} />
              </button>
            </div>
            <div className="text-center text-fuchsia-600 text-xl font-semibold">
              <h2>{song.title}</h2>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <h3><FaComment size={24} />{countComment}</h3>
              {comments ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-center w-full">
                    <div className="flex-1">
                      <p className="text-gray-800 text-sm">
                        {comment.user.username}: {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
              <h3><FaHeartbeat />{countLike}</h3>
              {like ? (
                like.map((like) => (
                  <div key={like.id} className="flex items-center w-full">
                    <div className="flex-1">
                      <p className="text-gray-800 text-sm">
                        {like.user.username} liked this song.
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No likes yet.</p>
              )}
              <form onSubmit={handleComment} action="">
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:border-blue-600"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <div className="flex items-center w-full mt-4">
                  <button
                    type="submit"
                    className="bg-blue-300 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
                  >
                    <FaComment size={24} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SongDetail;

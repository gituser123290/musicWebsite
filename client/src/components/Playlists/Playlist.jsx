import Loading from '../../layouts/Loading';
import api from '../../services/api';
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaPlay, FaPause, FaTrash,FaArrowLeft } from "react-icons/fa";
import { useEffect, useState, useRef } from 'react';
import { Navigate,useNavigate } from 'react-router-dom';



export default function Playlist() {
  const [playlists, setPlaylists] = useState(null);
  const [error, setError] = useState(null);
  // eslint-disable-next-line
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [ftBgColor, setFtBgColor] = useState(getRandomColor());
  const [sdBgColor, setSdBgColor] = useState(getRandomColor());
  const navigate = useNavigate();

  useEffect(() => {
    const getPlaylist = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        Navigate('/login');
        return;
      }
      try {
        const response = await api.get('/playlist/', {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setPlaylists(response.data);
      } catch (error) {
        setError(error);
      }
    };
    getPlaylist();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [currentSongIndex, isPlaying]);

  function getRandomColor(){
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % playlists[currentPlaylistIndex].songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
    setFtBgColor(getRandomColor());
    setSdBgColor(getRandomColor());
  };

  const handlePrevious = () => {
    const prevIndex = (currentSongIndex - 1 + playlists[currentPlaylistIndex].songs.length) % playlists[currentPlaylistIndex].songs.length;
    setCurrentSongIndex(prevIndex);
    setIsPlaying(true);
    setFtBgColor(getRandomColor());
    setSdBgColor(getRandomColor());
    
  };

  const deleteSongToPlaylist = async (playlistId, songId) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  
    try {
      await api.delete(`/playlists/${playlistId}/songs/${songId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert("Song deleted from playlist");
      setPlaylists(prevPlaylists => 
        prevPlaylists.map(playlist => 
          playlist.id === playlistId 
          ? { ...playlist, songs: playlist.songs.filter(song => song.id !== songId) }
          : playlist
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const deletePlaylist = async (playlistId) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  
    try {
      await api.delete(`playlist/${playlistId}/delete/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert(`Playlist Deleted Successfully👍${playlistId}`);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!playlists) return <Loading />;

  const currentPlaylist = playlists[currentPlaylistIndex];
  if (!currentPlaylist || !currentPlaylist.songs || currentPlaylist.songs.length === 0) {
    return;
  }
  const currentSong = currentPlaylist.songs[currentSongIndex];
  
  

  const handleClick = (songId) => {
    navigate(`/songs/${songId}/`);
  };

  return (
    <div className="bg-gray-900 py-8 px-4">
      <div className="container mx-auto space-y-8 flex flex-col justify-between min-h-screen">
        <div>
          {playlists && playlists.length > 0 ?(
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 m-2" style={{ background: `linear-gradient(to right, ${ftBgColor}, ${sdBgColor})` }}>
                <FaTrash onClick={() => deletePlaylist(playlist.id)} size={20} className='cursor-pointer float-right hover:text-red-600'/>
                <FaArrowLeft onClick={() => navigate(-1)} size={14} className='cursor-pointer'/>
                <h2 className="text-3xl font-bold text-center text-white mb-6">{playlist.name}</h2>
                <div className="space-y-6">
                  {playlist && playlist.songs.length > 0 ? (
                    playlist.songs.map((song) => (
                      <div
                        key={song.id}
                        className="bg-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-600 transition-all duration-300 transform hover:scale-100"
                      >
                        <div className="flex items-center space-x-4">
                        <img
                              className="w-20 h-20  object-cover rounded-md shadow-md"
                              src={song.song_cover_url.startsWith("http") ? song.song_cover_url : `${song.song_cover_url}`}
                              alt="Song cover"
                            />
                          <div className="text-white">
                            <h3 className="text-xl font-semibold cursor-pointer" onClick={() => handleClick(song.id)}>{song?.title}</h3>
                            <p className="text-sm text-gray-500">{song.artist?.name}</p>
                            <p className="text-sm text-gray-500">{song.genre} | {song.duration}</p>
                          </div>
                        </div>
                        <div className='cursor-pointer hover:text-red-600'>
                          <FaTrash onClick={() => deleteSongToPlaylist(playlist.id, song.id)} size={10}/>
                        </div>
                      </div>
                    ))
                  ):(
                    <div className="text-white text-center">No songs found in this playlist</div>
                  )}
                </div>
              </div>
            ))
          ):(
            <div className="text-white text-center">No playlists found</div>
          )}
        </div>
        {/* style={{ background: `linear-gradient(to right, ${ftBgColor}, ${sdBgColor})` }} */}
        <div className="audio-controls bg-slate-700 text-white mt-6 p-4 rounded-md flex flex-col justify-end">
          <div className="mt-4 text-blue-600 font-semibold">
              <h3>{currentSong?.title} - {currentSong?.artist?.name}</h3>
            </div>
            <audio
              ref={audioRef}
              src={`http://localhost:8000${currentSong?.audio}`}
              onEnded={handleNext}
            />
            <div className="flex justify-between items-center">
              <button onClick={handlePrevious} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
                <TbPlayerTrackPrevFilled size={25} />
              </button>
              <button onClick={handlePlayPause} className="p-4 bg-gray-700 rounded-full hover:bg-gray-600">
                {isPlaying ? <FaPause size={25} /> : <FaPlay size={25} />}
              </button>
              <button onClick={handleNext} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
                <TbPlayerTrackNextFilled size={25} />
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};



import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import AllSongs from "./AllSongs";
import Loading from "../../layouts/Loading";
import api from "../../services/api";


const SongDetail = () => {
  const { id } = useParams()
  const [song, setSong] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);
  // const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate=useNavigate()

  useEffect(() => {
    const songs = async () => {
      try {
        const response = await api.get(`/song/${id}/`);
        setSong(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }
    songs();
  }, [id])


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
  // Previous Song 
  // const previousSong = () => {
  //   const newIndex =
  //     currentSongIndex === 0
  //       ? song.audio_files.length - 1
  //       : currentSongIndex - 1;
  //   setCurrentSongIndex(newIndex);
  // };
  // Next Song 
  // const nextSong = () => {
  //   const newIndex =
  //     currentSongIndex === song.audio_files.length - 1
  //       ? 0
  //       : currentSongIndex + 1;
  //   setCurrentSongIndex(newIndex);
  // };

  if (loading) return <div><Loading/></div>;

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
    <div className="w-1/6 items-center pl-10 p-4 m-1 bg-orange-500 rounded-md hover:bg-orange-600 shadow-xl transition-colors duration-200 cursor-pointer">
        <button onClick={() => navigate(-1)} className="text-white">
          Back to Posts
        </button>
      </div>
    <div className="flex items-center flex-col justify-center w-full bg-gradient-to-r from-blue-500 to-purple-600 pt-10 pb-16">
      <div className="flex items-center justify-center w-full flex-1 bg-gradient-to-r pt-8 pb-8">
        <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 p-6 bg-white rounded-xl shadow-xl flex flex-col items-center space-y-6">
          <div className="w-full mb-6 flex justify-center">
            <img
              className="w-full max-w-xs h-auto object-cover rounded-lg shadow-md"
              src={`http://localhost:8000${song.song_cover}`}
              alt="Song cover"
            />
          </div>
          <div className="text-center text-fuchsia-600 text-xl font-semibold">
            <h2>{song?.name}</h2>
          </div>
          <div className="w-full flex flex-col items-center space-y-4">
            <audio
              ref={(audio) => setAudioPlayer(audio)}
              // controls
              className="w-full rounded-lg bg-gray-100 p-2"
              src={`http://localhost:8000${song.audio_file}`}
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
                {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
              </button>
              <button
                // onClick={nextSong}
                className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
              >
                <TbPlayerTrackNextFilled size={24} />
              </button>
            </div>
          </div>
          <div className="text-center text-fuchsia-600 text-xl font-semibold">
            <h2>{song.title}</h2>
          </div>
        </div>
      </div>
      <div className="flex flex-1 w-full">
        <AllSongs />
      </div>
    </div>
    </>
  );
};

export default SongDetail;

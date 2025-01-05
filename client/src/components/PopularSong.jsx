import React from 'react'
import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlay,FaPause } from "react-icons/fa";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import { PiDownloadSimpleBold } from "react-icons/pi";
import { FaEarListen } from "react-icons/fa6";
import { CiStreamOn } from "react-icons/ci";

export default function PopularSong() {
  const [populars, setPopulars] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);


  useEffect(() => {
    const popularSongs = async () => {
      try {
        const response = await api.get('/popularity');
        setPopulars(response.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    }
    popularSongs()
  }, [])

  const playPauseSong = () => {
    if (isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error Loading Data {error.message}</div>
  }

  return (
    <div className="flex flex-wrap justify-center m-12 p-4 gap-4">
      {populars.map((song) => (
        <div
          key={song.id}
          className="flex flex-col justify-center w-[400px] h-auto items-center p-4 rounded-md bg-orange-500 border border-red-100"
        >
          <div className="flex items-center w-full mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <img
                src={`http://127.0.0.1:8000${song.album_detail.image}`}
                alt={song.album_detail.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center text-lg font-bold p-2">
              {song.album_detail.title.substring(0, 13)}... by {song.artist_detail.name}
            </div>
          </div>
          <div className="flex items-center w-full mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <img
                src={`http://127.0.0.1:8000${song.album_detail.image}`}
                alt={song.album_detail.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center text-lg font-bold p-2">
              {song.artist_detail.name}
            </div>
          </div>
          <div className="flex justify-around mt-5 w-full">
            <div className="w-10 h-10 gap-2 flex justify-center align-middle items-center cursor-pointer">
              {song.no_of_listeners} <p><FaEarListen /></p>
            </div>
            <div className="w-10 h-10 gap-2 flex justify-center items-center cursor-pointer">
              {song.streams} <p><CiStreamOn /></p>
            </div>
            <div className="w-10 h-10 gap-2 flex justify-center items-center cursor-pointer">
              {song.downloads} <p><PiDownloadSimpleBold /></p>
            </div>
          </div>
          <div className="flex justify-around flex-col mt-5 w-full">
            <div>
            <audio
              ref={(audio) => setAudioPlayer(audio)}
              controls
              className="w-full rounded-lg bg-gray-100 p-2"
              src={`http://localhost:8000${song.audio_file}`}
            />
            </div>
            <div className='flex align-middle m-2 justify-between'>
              <div className="w-12 h-12 flex justify-center items-center cursor-pointer">
                <div className="w-0 h-0 transition-transform hover:scale-150">
                  <TbPlayerTrackPrevFilled />
                </div>
              </div>
              <div className="w-12 h-12 flex justify-center items-center cursor-pointer">
                  <div className="w-0 h-0 transition-transform hover:scale-150">
                    <button onClick={() => playPauseSong()}>
                    {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                  </button>
                  </div>
              </div>
              <div className="w-12 h-12 flex justify-center items-center cursor-pointer">
                <div className="w-0 h-0 transition-transform hover:scale-150">
                  <TbPlayerTrackNextFilled  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

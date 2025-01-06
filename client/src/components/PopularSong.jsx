import React from 'react'
import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlay,FaPause } from "react-icons/fa";
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled,TbChartBarPopular } from "react-icons/tb";
import { PiDownloadSimpleBold } from "react-icons/pi";
import { CiStreamOn } from "react-icons/ci";

export default function PopularSong() {
  const [populars, setPopulars] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState(null);


  useEffect(() => {
    const popularSongs = async () => {
      try {
        const response = await api.get('/songs/popularity');
        setPopulars(response.data);
        console.log(response.data);
        
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
    <div className="flex flex-wrap justify-center mt-2 p-2 gap-2">
      {populars.map(song=>{
        return(
          <div key={song.song_id}
          className="flex flex-col justify-center w-[300px] h-auto items-center p-4 rounded-md bg-orange-500 border border-red-100"
        >
          <div className="flex items-center w-full mb-0">
            <div className="flex-1 text-justify text-lg font-bold p-2">
              {song.album}
            </div>
          </div>
          <div className="flex items-center w-full mb-0">
            <div className="flex-1 text-justify text-lg font-bold p-2">
              {song.artist}
            </div>
          </div>
          <div className="flex items-center w-full mb-0">
            <div className="flex-1 text-justify text-lg font-bold p-2">
              {song.name}
            </div>
          </div>
          <div className="flex justify-around mt-2 w-full">
            <div className="w-10 h-10 gap-2 flex justify-center align-middle items-center cursor-pointer">
              {Math.floor(song.popularity_score)} <p><TbChartBarPopular /></p>
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
      )})}
    </div>
  )
}

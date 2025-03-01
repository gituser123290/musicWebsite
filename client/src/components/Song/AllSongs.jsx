import React, { useState, useEffect } from 'react';
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaPlay, FaPause} from "react-icons/fa";
import { apiUrl } from '../../services/api';
import Loading from '../../layouts/Loading';
import { Navigate } from 'react-router-dom';
import axios from 'axios';


export default function AllSongs() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioPlayer, setAudioPlayer] = useState(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [ftBgColor, setFtBgColor] = useState(getRandomColor());
    const [sdBgColor, setSdBgColor] = useState(getRandomColor());

    useEffect(() => {
        const allSongs = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                Navigate('/login');
                return;
            }
            try {
                const response = await axios.get(apiUrl+"/audio_files/",{
                    headers:{
                        Authorization:`Token ${token}`
                    }
                });
                setSongs(response.data);
                console.log(response.data)
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        allSongs();
    }, []);

    function getRandomColor(){
        var letters = "ABCDEF0123456789";
        var color = "#";
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    const playPauseSong = () => {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        setIsPlaying(!isPlaying);
    };

    const nextSong = () => {
        const newIndex =
            currentSongIndex === songs.length - 1
                ? 0
                : currentSongIndex + 1;
        setCurrentSongIndex(newIndex);
        setFtBgColor(getRandomColor());
        setSdBgColor(getRandomColor());
        setIsPlaying(!isPlaying)
    };

    const previousSong = () => {
        const newIndex =
            currentSongIndex === 0
                ? songs.length - 1
                : currentSongIndex - 1;
        setCurrentSongIndex(newIndex);
        setFtBgColor(getRandomColor());
        setSdBgColor(getRandomColor());
    };


    if (loading) return <div><Loading/></div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-400 pt-2 pb-24" >
            <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 p-2 mt-8 rounded-xl shadow-xl flex flex-col items-center space-y-4" style={{ background: `linear-gradient(to right, ${ftBgColor}, ${sdBgColor})` }}>
                <div className="w-full mb-2 flex justify-center">
                    <img
                        className="w-full max-w-xs h-auto object-cover rounded-lg shadow-md"
                        src={songs[currentSongIndex]?.song_cover_url}
                        alt="Song cover"
                    />
                </div>
                <div className="text-center text-fuchsia-600 text-xl font-semibold">
                    <h2>{songs[currentSongIndex]?.title}</h2>
                </div>
                <div className="w-full flex flex-col items-center space-y-4">
                    <audio
                        ref={(audio) => setAudioPlayer(audio)}
                        controls
                        className="w-full rounded-lg p-2"
                        src={`http://localhost:8000${songs[currentSongIndex]?.audio}`}
                    />
                    <div className="flex justify-center space-x-10 mt-4">
                        <button
                            onClick={previousSong}
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
                            onClick={nextSong}
                            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
                        >
                            <TbPlayerTrackNextFilled size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}

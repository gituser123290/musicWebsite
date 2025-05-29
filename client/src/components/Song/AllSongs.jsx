import React, { useState, useEffect, useRef } from 'react';
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { apiUrl } from '../../services/api';
import Loading from '../../layouts/Loading';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function AllSongs() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioPlayer = useRef(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const allSongs = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                Navigate('/login');
                return;
            }
            try {
                const response = await axios.get(apiUrl + "/audio_files/", {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
                setSongs(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        allSongs();
    }, []);

    // Play or pause audio and sync state
    const playPauseSong = () => {
        if (!audioPlayer.current) return;

        if (isPlaying) {
            audioPlayer.current.pause();
        } else {
            audioPlayer.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Change song and auto play
    const changeSong = (newIndex) => {
        setCurrentSongIndex(newIndex);
        setIsPlaying(true);
    };

    // Next song handler
    const nextSong = () => {
        const newIndex = currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1;
        changeSong(newIndex);
    };

    // Previous song handler
    const previousSong = () => {
        const newIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
        changeSong(newIndex);
    };

    // Update progress bar as song plays
    const onTimeUpdate = () => {
        if (!audioPlayer.current) return;
        const current = audioPlayer.current.currentTime;
        const duration = audioPlayer.current.duration || 1;
        setProgress((current / duration) * 100);
    };

    // When song ends, auto go next
    const onEnded = () => {
        nextSong();
    };

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500 text-center mt-4">Error: {error}</div>;

    const song = songs[currentSongIndex];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">
            <div className="w-full max-w-md bg-gray-900 bg-opacity-80 rounded-3xl shadow-2xl overflow-hidden select-none">
                {/* Album cover with reflection & glow */}
                <div className="relative">
                    <motion.img
                        key={song.id}
                        src={song.song_cover_url}
                        alt={song.title}
                        className="w-full aspect-square object-cover rounded-t-3xl shadow-xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        draggable={false}
                    />
                    {isPlaying && (
                        <motion.div
                            className="absolute bottom-6 left-6 bg-green-500 rounded-full w-4 h-4 animate-pulse shadow-lg"
                            title="Playing"
                            initial={{ scale: 0.7, opacity: 0.6 }}
                            animate={{ scale: 1.3, opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 1, repeatType: "mirror" }}
                        />
                    )}
                </div>

                {/* Song info */}
                <div className="px-6 py-4 text-center text-white">
                    <h2 className="text-2xl font-bold tracking-wide truncate">{song.title}</h2>
                    <p className="mt-1 text-gray-400 text-sm">{song.artist || "Unknown Artist"}</p>
                </div>

                {/* Audio element hidden, we control externally */}
                <audio
                    ref={audioPlayer}
                    src={`http://localhost:8000${song.audio}`}
                    onTimeUpdate={onTimeUpdate}
                    onEnded={onEnded}
                    autoPlay={isPlaying}
                />

                {/* Progress bar */}
                <div className="h-1 bg-gray-700 mx-6 rounded-full overflow-hidden mb-4">
                    <motion.div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${progress}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                    />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-12 pb-6">
                    <motion.button
                        whileHover={{ scale: 1.3, color: "#1DB954" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={previousSong}
                        aria-label="Previous Song"
                        className="text-gray-400 hover:text-green-500 transition-colors duration-300"
                    >
                        <TbPlayerTrackPrevFilled size={32} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.5, color: "#1DB954" }}
                        whileTap={{ scale: 0.8 }}
                        onClick={playPauseSong}
                        aria-label={isPlaying ? "Pause" : "Play"}
                        className="text-white bg-green-500 hover:bg-green-600 shadow-lg rounded-full p-5 flex items-center justify-center transition-colors duration-300"
                    >
                        <AnimatePresence exitBeforeEnter initial={false}>
                            {isPlaying ? (
                                <motion.span
                                    key="pause"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <FaPause size={28} />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="play"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <FaPlay size={28} />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.3, color: "#1DB954" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextSong}
                        aria-label="Next Song"
                        className="text-gray-400 hover:text-green-500 transition-colors duration-300"
                    >
                        <TbPlayerTrackNextFilled size={32} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

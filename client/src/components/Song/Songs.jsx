// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Loading from '../../layouts/Loading';
// import { apiUrl } from '../../services/api';
// import axios from 'axios';
// // import { motion } from 'framer-motion';
// // import { BsMusicNoteBeamed } from 'react-icons/bs';

// const token=sessionStorage.getItem('token')

// export default function Songs() {
//   const [songs, setSongs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const audioRef = useRef(null);
//   const progressBarRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSong = async () => {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }
//       try {
//         const response = await axios.get(apiUrl + '/songs', {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         });
//         setSongs(response.data);
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };
//     fetchSong();
//   }, [navigate]);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const onLoadedMetadata = () => {
//       setDuration(audio.duration);
//     };
//     const onTimeUpdate = () => {
//       setCurrentTime(audio.currentTime);
//       setProgress((audio.currentTime / audio.duration) * 100);
//     };
//     const onEnded = () => setIsPlaying(false);

//     audio.addEventListener("loadedmetadata", onLoadedMetadata);
//     audio.addEventListener("timeupdate", onTimeUpdate);
//     audio.addEventListener("ended", onEnded);

//     return () => {
//       audio.removeEventListener("loadedmetadata", onLoadedMetadata);
//       audio.removeEventListener("timeupdate", onTimeUpdate);
//       audio.removeEventListener("ended", onEnded);
//     };
//   }, [songs]);

//   // Play/pause toggle
//   const togglePlayPause = () => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (isPlaying) {
//       audio.pause();
//       setIsPlaying(false);
//     } else {
//       const playPromise = audio.play();
//       if (playPromise !== undefined) {
//         playPromise
//           .then(() => {
//             setIsPlaying(true);
//             fetch(`${apiUrl}/recently-played/`, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Token ${token}`,
//               },
//               body: JSON.stringify({
//                 song_title: songs.title,
//                 artist_name: songs.artist.name,
//                 image_url: songs.song_cover_url,
//               }),
//             });

//           })
//           .catch((err) => console.error("Playback error", err));
//       } else {
//         setIsPlaying(true);
//       }
//     }
//   };

//   const handleClick = (id) => {
//     navigate(`/songs/${id}`);
//   };

//   if (loading) return <Loading />;

//   if (error)
//     return (
//       <p className="text-center text-red-500 mt-8 font-semibold">
//         Error: {error.message}
//       </p>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-8">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {songs.map((song) => (
//           <div key={song.id}
//             onClick={() => handleClick(song.id)}
//             class="bg-gradient-to-r from-orange-600 to-red-900  rounded-lg drop-shadow p-4 dark:bg-black dark:shadow-white">
//             <div class="flex flex-col justify-center items-center ">
//               <img class="rounded-lg aspect-square w-64" src={
//                 song.song_cover_url.startsWith('http')
//                   ? song.song_cover_url
//                   : `${song.song_cover_url}`
//               }
//                 alt={song.title} />
//               <p class="mt-2 font-semibold text-md text-gray-600">{song.title}</p>
//               <p class="font-semibold text-xs text-gray-600">{song.artist.name}</p>
//             </div>
//             <div class="flex flex-col justify-center items-center my-4">
//               <input type="range" value="30" class="rounded-lg overflow-hidden appearance-none bg-gray-200 h-1 w-full" />
//               <div class="flex justify-between w-3/5 items-center my-2">
//                 <button class="aspect-square bg-white flex justify-center items-center rounded-full p-2 shadow-lg dark:bg-gray-800">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#816cfa" fill-rule="evenodd" d="M7 6a1 1 0 0 1 2 0v4l6.4-4.8A1 1 0 0 1 17 6v12a1 1 0 0 1-1.6.8L9 14v4a1 1 0 1 1-2 0z" clip-rule="evenodd" /></svg>
//                 </button>
//                 <button onClick={togglePlayPause} class="aspect-square bg-white flex justify-center items-center rounded-full p-2 shadow-lg dark:bg-gray-800">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 512 512"><path fill="#816cfa" d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440" /></svg>
//                 </button>
//                 <button class=" aspect-square bg-white flex justify-center items-center rounded-full p-2 shadow-lg dark:bg-gray-800">
//                   <svg class="rotate-180" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#816cfa" fill-rule="evenodd" d="M7 6a1 1 0 0 1 2 0v4l6.4-4.8A1 1 0 0 1 17 6v12a1 1 0 0 1-1.6.8L9 14v4a1 1 0 1 1-2 0z" clip-rule="evenodd" /></svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../layouts/Loading';
import { apiUrl } from '../../services/api';

const token = sessionStorage.getItem('token');

export default function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      if (!token) return navigate('/login');
      try {
        const response = await axios.get(`${apiUrl}/songs`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setSongs(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [navigate]);

  const handlePlayPause = async (song) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentSong?.id === song.id && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (currentSong?.id !== song.id) {
        setCurrentSong(song);
        audio.src = song.audio.startsWith('http') ? song.audio : `${apiUrl}${song.audio}`;
      }

      try {
        await audio.play();
        setIsPlaying(true);
        setCurrentSong(song);

        await axios.post(`${apiUrl}/recently-played/`, {
          song_title: song.title,
          artist_name: song.artist.name,
          image_url: song.song_cover_url,
        }, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      } catch (err) {
        console.error('Audio play error:', err);
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };

    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const formatTime = (time) =>
    isNaN(time)
      ? '0:00'
      : `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500 mt-8 font-semibold">Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-8 pb-32 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {songs.map((song) => (
          <div key={song.id} className="bg-gradient-to-r from-orange-600 to-red-900 rounded-lg drop-shadow p-4">
            <div className="flex flex-col justify-center items-center cursor-pointer">
              <img
                className="rounded-lg aspect-square w-64"
                src={song.song_cover_url}
                alt={song.title}
                onClick={() => navigate(`/songs/${song.id}`)}
              />
              <p className="mt-2 font-semibold text-md text-white">{song.title}</p>
              <p className="font-semibold text-xs text-gray-300">{song.artist.name}</p>
            </div>
            <div className="flex justify-center mt-4">
              {song.audio ? (
                <button
                  onClick={() => handlePlayPause(song)}
                  className="aspect-square bg-white flex justify-center items-center rounded-full p-2 shadow-lg"
                >
                  {currentSong?.id === song.id && isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#816cfa" viewBox="0 0 24 24">
                      <path d="M10 19H7V5h3v14zm7-14h-3v14h3V5z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#816cfa" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              ) : (
                <span className="text-sm text-red-300 mt-2">No Audio</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Global Audio Tag */}
      <audio ref={audioRef} preload="metadata" />

      {/* Sticky Playbar */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl z-50">
          <div className="flex items-center gap-4">
            <img src={currentSong.song_cover_url} alt={currentSong.title} className="w-12 h-12 rounded" />
            <div>
              <h4 className="text-md font-semibold">{currentSong.title}</h4>
              <p className="text-xs text-gray-400">{currentSong.artist.name}</p>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-2/5">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              className="w-full accent-fuchsia-500"
              onChange={(e) => {
                const newTime = (e.target.value / 100) * duration;
                audioRef.current.currentTime = newTime;
              }}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => handlePlayPause(currentSong)}>
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#fff" viewBox="0 0 24 24">
                  <path d="M10 19H7V5h3v14zm7-14h-3v14h3V5z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#fff" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button onClick={toggleMute}>
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="22" height="22" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-.77-3.36-2-4.44V6.22c1.93 1.25 3.22 3.4 3.22 5.78s-1.29 4.53-3.22 5.78v-1.34c1.23-1.08 2-2.67 2-4.44zM18 12c0 2.5-1.12 4.76-2.93 6.22l1.42 1.42C18.25 17.68 19.5 14.96 19.5 12S18.25 6.32 16.49 4.36l-1.42 1.42C16.88 7.24 18 9.5 18 12zM6.41 4L5 5.41 8.59 9H4v6h4l5 5V9.83L17.17 18 18.59 16.59 6.41 4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="22" height="22" viewBox="0 0 24 24">
                  <path d="M3 10v4h4l5 5V5l-5 5H3zm13.5 2c0-1.77-.77-3.36-2-4.44v8.88c1.23-1.08 2-2.67 2-4.44z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

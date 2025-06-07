/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { getLikedSongs, getUserPlaylists } from '../services/apiServices'
import { useNavigate } from 'react-router-dom'

export default function Library() {
    const [likedSongs, setLikedSongs] = useState([])
    const [playlists, setPlaylists] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [songs, playlists] = await Promise.all([getLikedSongs(), getUserPlaylists(),])
                setLikedSongs(songs.data)
                setPlaylists(playlists.data)
            } catch (error) {
                console.error("Errro", error)
            }
        }
        fetchData()
    }, [])


    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-2xl font-semibold mb-4">Liked Songs</h2>
                {likedSongs.length === 0 ? (
                    <p className="text-zinc-400">You haven't liked any songs yet.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {likedSongs.map((song) => (
                            <div
                                key={song.id}
                                className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 cursor-pointer"
                            >
                                <img
                                    src={song.song.song_cover_url}
                                    alt={song.song.title}
                                    className="w-full h-32 object-cover rounded mb-2"
                                />
                                <h3 className="text-base font-semibold">{song.song.title}</h3>
                                <p className="text-sm text-zinc-400">{song.song.artist.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Your Playlists</h2>
                {playlists.length === 0 ? (
                    <p className="text-zinc-400">No playlists found.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {playlists.map((playlist) => (
                            <div
                                key={playlist.id}
                                className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 cursor-pointer"
                            >
                                <img
                                    src={playlist.songs[0].song_cover_url}
                                    alt={playlist.name}
                                    className="w-full h-32 object-cover rounded mb-2"
                                />
                                <h3 className="text-base font-semibold">{playlist.name}</h3>
                                <p className="text-sm text-zinc-400">
                                    {playlist.songs.length} songs
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

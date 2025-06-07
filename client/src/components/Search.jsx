import { useEffect, useState } from 'react'
import { searchMusic } from '../services/apiServices'

export default function Search() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState({ songs: [], artists: [] })

    useEffect(() => {
        if (query.trim() === '') {
            setResults({ songs: [], artists: [] })
            return
        }

        const fetchResults = async () => {
            try {
                const response = await searchMusic(query)
                setResults(response.data)
            } catch (error) {
                console.error("Search error:", error)
            }
        }

        const debounce = setTimeout(fetchResults, 400)
        return () => clearTimeout(debounce)
    }, [query])

    return (
        <div className="space-y-8">
            <input
                type="text"
                placeholder="Search for songs, artists..."
                className="w-full p-3 rounded-md bg-zinc-800 text-white placeholder-zinc-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {/* Render Songs */}
            {results.songs.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Songs</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {results.songs.map((song) => (
                            <div
                                key={song.id}
                                className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 cursor-pointer"
                            >
                                <img
                                    src={song.song_cover_url}
                                    alt={song.title}
                                    className="rounded h-32 w-full object-cover mb-2"
                                    onError={(e) => {
                                        e.target.src = 'https://randomuser.me/api/portraits/men/75.jpg'  
                                    }}
                                />
                                <h3 className="text-base font-semibold">{song.title}</h3>
                                <p className="text-sm text-zinc-400">{song.artist.name}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Render Artists */}
            {results.artists.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Artists</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {results.artists.map((artist) => (
                            <div
                                key={artist.id}
                                className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 cursor-pointer text-center"
                            >
                                <img
                                    src={artist.image_url}
                                    alt={artist.name}
                                    className="rounded-full mx-auto mb-2 h-24 w-24 object-cover"
                                />
                                <h3 className="text-sm font-medium">{artist.name}</h3>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

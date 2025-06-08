// import { useEffect, useState } from 'react'
// import { searchMusic, getData } from '../services/apiServices'

// export default function Search() {
//     const [query, setQuery] = useState('')
//     const [results, setResults] = useState({ songs: [], artists: [] })
//     const [initialResults, setInitialResults] = useState({ songs: [], artists: [] })
//     const [songPage, setSongPage] = useState(1)
//     const [artistPage, setArtistPage] = useState(1)
//     const SONGS_PER_PAGE = 8
//     const ARTISTS_PER_PAGE = 6

//     useEffect(() => {
//         const fetchInitial = async () => {
//             try {
//                 const songs = await getData(`/songs/?limit=${SONGS_PER_PAGE * songPage}`)
//                 const artists = await getData(`/artists/?limit=${ARTISTS_PER_PAGE * artistPage}`)
//                 setInitialResults({ songs, artists })
//             } catch (error) {
//                 console.error('Initial fetch error:', error)
//             }
//         }

//         if (query.trim() === '') {
//             fetchInitial()
//         }
//     }, [songPage, artistPage, query])

//     useEffect(() => {
//         if (query.trim() === '') {
//             setResults({ songs: [], artists: [] })
//             return
//         }

//         const fetchResults = async () => {
//             try {
//                 const data = await searchMusic(query)
//                 setResults(data)
//             } catch (error) {
//                 console.error("Search error:", error)
//             }
//         }

//         const debounce = setTimeout(fetchResults, 400)
//         return () => clearTimeout(debounce)
//     }, [query])

//     const displaySongs = query.trim() ? results.songs : initialResults.songs
//     const displayArtists = query.trim() ? results.artists : initialResults.artists

//     return (
//         <div className="space-y-8">
//             <input
//                 type="text"
//                 placeholder="Search for songs, artists..."
//                 className="w-full p-3 rounded-md bg-zinc-800 text-white placeholder-zinc-400"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//             />
//             {displaySongs.length > 0 && (
//                 <section>
//                     <h2 className="text-xl font-semibold mb-3">Songs</h2>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                         {displaySongs.map((song) => (
//                             <div
//                                 key={song.id}
//                                 className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 cursor-pointer"
//                             >
//                                 <img
//                                     src={song.song_cover_url}
//                                     alt={song.title}
//                                     className="rounded h-32 w-full object-cover mb-2"
//                                     onError={(e) => {
//                                         e.target.src = 'https://randomuser.me/api/portraits/men/75.jpg'
//                                     }}
//                                 />
//                                 <h3 className="text-base font-semibold">{song.title}</h3>
//                                 <p className="text-sm text-zinc-400">{song.artist?.name}</p>
//                             </div>
//                         ))}
//                     </div>
//                     {query.trim() === '' && (
//                         <div className="text-center mt-4">
//                             <button
//                                 className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded"
//                                 onClick={() => setSongPage(prev => prev + 1)}
//                             >
//                                 Load More Songs
//                             </button>
//                         </div>
//                     )}
//                 </section>
//             )}
//             {displayArtists.length > 0 && (
//                 <section>
//                     <h2 className="text-xl font-semibold mb-3">Artists</h2>
//                     <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
//                         {displayArtists.map((artist) => (
//                             <div
//                                 key={artist.id}
//                                 className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 cursor-pointer text-center"
//                             >
//                                 <img
//                                     src={artist.image_url}
//                                     alt={artist.name}
//                                     className="rounded-full mx-auto mb-2 h-24 w-24 object-cover"
//                                 />
//                                 <h3 className="text-sm font-medium">{artist.name}</h3>
//                             </div>
//                         ))}
//                     </div>
//                     {query.trim() === '' && (
//                         <div className="text-center mt-4">
//                             <button
//                                 className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded"
//                                 onClick={() => setArtistPage(prev => prev + 1)}
//                             >
//                                 Load More Artists
//                             </button>
//                         </div>
//                     )}
//                 </section>
//             )}
//         </div>
//     )
// }


import { useEffect, useState } from 'react'
import { searchMusic, getData } from '../services/apiServices'

export default function Search() {
    const [query, setQuery] = useState('')
    const [allResults, setAllResults] = useState({ songs: [], artists: [] })
    const [visibleSongs, setVisibleSongs] = useState([])
    const [visibleArtists, setVisibleArtists] = useState([])

    const SONGS_STEP = 8
    const ARTISTS_STEP = 6

    // Load counts
    const [songCount, setSongCount] = useState(SONGS_STEP)
    const [artistCount, setArtistCount] = useState(ARTISTS_STEP)

    // Fetch initial full lists
    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const songs = await getData(`/songs/`)
                const artists = await getData(`/artists/`)
                setAllResults({ songs, artists })
                setVisibleSongs(songs.slice(0, SONGS_STEP))
                setVisibleArtists(artists.slice(0, ARTISTS_STEP))
            } catch (error) {
                console.error("Fetch error:", error)
            }
        }

        if (query.trim() === '') {
            fetchInitial()
        }
    }, [query])

    // Search results
    useEffect(() => {
        if (query.trim() === '') return

        const fetchSearchResults = async () => {
            try {
                const data = await searchMusic(query)
                setAllResults(data)
                setVisibleSongs(data.songs.slice(0, SONGS_STEP))
                setVisibleArtists(data.artists.slice(0, ARTISTS_STEP))
                setSongCount(SONGS_STEP)
                setArtistCount(ARTISTS_STEP)
            } catch (error) {
                console.error("Search error:", error)
            }
        }

        const debounce = setTimeout(fetchSearchResults, 400)
        return () => clearTimeout(debounce)
    }, [query])

    // Load More
    const loadMoreSongs = () => {
        const newCount = songCount + SONGS_STEP
        setSongCount(newCount)
        setVisibleSongs(allResults.songs.slice(0, newCount))
    }

    const loadMoreArtists = () => {
        const newCount = artistCount + ARTISTS_STEP
        setArtistCount(newCount)
        setVisibleArtists(allResults.artists.slice(0, newCount))
    }

    return (
        <div className="space-y-8">
            <input
                type="text"
                placeholder="Search for songs, artists..."
                className="w-full p-3 rounded-md bg-zinc-800 text-white placeholder-zinc-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {visibleSongs.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Songs</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {visibleSongs.map((song) => (
                            <div key={song.id} className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 cursor-pointer">
                                <img
                                    src={song.song_cover_url}
                                    alt={song.title}
                                    className="rounded h-32 w-full object-cover mb-2"
                                    onError={(e) => { e.target.src = 'https://randomuser.me/api/portraits/men/75.jpg' }}
                                />
                                <h3 className="text-base font-semibold">{song.title}</h3>
                                <p className="text-sm text-zinc-400">{song.artist?.name}</p>
                            </div>
                        ))}
                    </div>
                    {visibleSongs.length < allResults.songs.length && (
                        <div className="text-center mt-4">
                            <button
                                className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded"
                                onClick={loadMoreSongs}
                            >
                                Load More Songs
                            </button>
                        </div>
                    )}
                </section>
            )}

            {visibleArtists.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-3">Artists</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {visibleArtists.map((artist) => (
                            <div key={artist.id} className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 cursor-pointer text-center">
                                <img
                                    src={artist.image_url}
                                    alt={artist.name}
                                    className="rounded-full mx-auto mb-2 h-24 w-24 object-cover"
                                />
                                <h3 className="text-sm font-medium">{artist.name}</h3>
                            </div>
                        ))}
                    </div>
                    {visibleArtists.length < allResults.artists.length && (
                        <div className="text-center mt-4">
                            <button
                                className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded"
                                onClick={loadMoreArtists}
                            >
                                Load More Artists
                            </button>
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}

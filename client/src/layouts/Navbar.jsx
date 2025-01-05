import React,{useState} from 'react'

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleMouseEnter = () => setIsDropdownOpen(true);
    const handleMouseLeave = () => setIsDropdownOpen(false);

    return (
        <>
            <nav className='flex flex-row justify-center align-middle w-full bg-gray-800 hover:bg-lch'>
                <ul className='flex flex-row pt-4 pb-4 justify-between space-x-20'>
                    <li className='px-2 py-1 rounded-sm mx-1'>
                        <a
                            className='bg-green-700 hover:bg-indigo-500 text-black hover:text-hsl transition-all duration-300 px-4 py-2 rounded-md'
                            href='/'
                        >
                            Home
                        </a>
                    </li>
                    <li className='px-2 py-1 rounded-sm mx-1'>
                        <a
                            className='text-black bg-green-400 hover:bg-green-950 hover:text-purple-600 transition-all duration-300 px-4 py-2 rounded-md'
                            href='/artist'
                        >
                            Artist
                        </a>
                    </li>
                    <li className='px-2 py-1 rounded-sm mx-1'>
                        <a
                            className='text-black bg-green-300 hover:bg-green-950 hover:text-purple-600 transition-all duration-300 px-4 py-2 rounded-md'
                            href='/album'
                        >
                            Album
                        </a>
                    </li>
                    <li className='px-2 py-1 rounded-sm mx-1'>
                        <a
                            className='text-black bg-green-200 hover:bg-green-950 hover:text-purple-600 transition-all duration-300 px-4 py-3 rounded-md'
                            href='/popular_song'
                        >
                            Popular Songs
                        </a>
                    </li>
                    <li className='px-2 py-1 rounded-sm mx-1'>
                        <a
                            className='text-black bg-green-600 hover:bg-green-950 hover:text-purple-600 transition-all duration-300 px-4 py-2 rounded-md'
                            href='/products'
                        >
                            Products
                        </a>
                    </li>
                    <li 
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className='px-2 py-1 rounded-sm mx-1'>
                        <a
                            className='text-black bg-green-500 hover:bg-green-950 hover:text-purple-600 transition-all duration-300 px-4 py-2 rounded-md'
                            href='/users'
                        >
                            User
                        </a>
                        {isDropdownOpen && (
                        <div className="dropdown-content absolute bg-green-500 text-white rounded-md mt-1 z-10">
                        <a href="/createsong" className="block px-4 py-2 hover:bg-green-900">Create Song</a>
                        <a href="/createartist" className="block px-4 py-2 hover:bg-green-900">Create Artist</a>
                        <a href="/createalbum" className="block px-4 py-2 hover:bg-green-900">Create Album</a>
                        </div>
                    )}
                    </li>    
                </ul>
            </nav>
        </>
    )
}

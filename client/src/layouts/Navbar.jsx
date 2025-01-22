import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function Navbar({ isAuthenticated, handleLogout }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdownOpenOdd, setIsDropdownOpenOdd] = useState(false);

    const handleMouseEnter1 = () => setIsDropdownOpen(true);
    const handleMouseLeave1 = () => setIsDropdownOpen(false);

    const handleMouseEnter = () => setIsDropdownOpenOdd(true);
    const handleMouseLeave = () => setIsDropdownOpenOdd(false);

    return (
        <>
            <nav className='flex flex-row justify-center align-middle w-full bg-gray-500'>
                <ul className='flex flex-row pt-2 pb-2 justify-between space-x-20'>
                    {isAuthenticated ? (
                        <>
                        
                        <li className='py-1 rounded-sm mx-1'>
                            <a
                                className='text-black hover:text-white transition-all duration-300 rounded-md'
                                href='/'
                            >
                                Home
                            </a>
                        </li>
                        <li className='py-1 rounded-sm mx-1'>
                            <a
                                className='text-black hover:text-white transition-all duration-300 rounded-md'
                                href='/artist'
                            >
                                Artist
                            </a>
                        </li>
                        <li className='px-2 py-1 rounded-sm mx-1'>
                            <a
                                className='text-black hover:text-white transition-all duration-300 rounded-md'
                                href='/album'
                            >
                                Album
                            </a>
                        </li>   
                        <li className='px-2 py-1 rounded-sm mx-1'>
                            <a
                                className='text-black hover:text-white transition-all duration-300 rounded-md'
                                href='/popular_song'
                            >
                                Popular Songs
                            </a>
                        </li>
                        <li className='px-2 py-1 rounded-sm mx-1'>
                            <a
                                className='text-black hover:text-white transition-all duration-300 rounded-md'
                                href='/profile'
                            >
                                Profile
                            </a>
                        </li>
                        <li 
                            onMouseEnter={handleMouseEnter1}
                            onMouseLeave={handleMouseLeave1}
                            className='px-2 py-1 rounded-sm mx-1'>
                                <ul
                                    className='text-black hover:text-white transition-all duration-300 rounded-md'
                                >
                                    User
                                </ul>
                                {isDropdownOpen && (
                                    <div className="dropdown-content absolute bg-green-500 text-white rounded-md mt-1 z-10">
                                    <a href="/createsong" className="block px-4 py-2 hover:bg-green-900">Create Song</a>
                                    <a href="/createartist" className="block px-4 py-2 hover:bg-green-900">Create Artist</a>
                                    <a href="/createalbum" className="block px-4 py-2 hover:bg-green-900">Create Album</a>
                                    </div>
                            )}
                        </li>
                        <li 
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className='px-2 py-1 rounded-sm mx-1'>
                                Author
                            <ul>
                                {isDropdownOpenOdd && (
                                    <div className="dropdown-content absolute bg-green-500 text-white rounded-md mt-1 z-10">
                                        <li>
                                            <Link to="/author/authors" className="block px-4 py-2 hover:bg-green-900">
                                                Authors
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/author/books" className="block px-4 py-2 hover:bg-green-900">
                                                Books
                                            </Link>
                                        </li>
                                    </div>
                                )}
                            </ul>
                        </li>
                        <li className='px-1 py-0 rounded-sm mx-1'>
                            <button
                                className='text-black hover:text-white transition-all duration-300 rounded-md'
                                onClick={handleLogout}
                            >
                                LogOut
                            </button>
                        </li>
                    </>
                    ) : (
                        <>
                        <li className='px-2 py-1 rounded-sm mx-1'>
                            <a
                                className='text-black hover:text-white transition-all duration-300 rounded-md'
                                href='/login'
                            >
                                Login
                            </a>
                        </li>
                        <li className='px-2 py-1 rounded-sm mx-1'>
                            <a
                                className='text-black hover:text-white transition-all duration-300 rounded-md'
                                href='/register'
                            >
                                Register
                            </a>
                        </li>
                        </>
                    )}
                </ul>
            </nav>
        </>
    )
}

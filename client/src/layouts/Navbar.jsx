import React from 'react'

export default function Navbar() {
    return (
        <>
            <nav className='flex flex-row justify-center align-middle w-full bg-gray-700 hover:bg-lch'>
                <ul className='flex flex-row p-2 space-x-20'>
                    <li className='px-2 py-1 rounded-sm text-orange-200 mx-1'>
                        <a
                            className='bg-green-700 hover:border-l-indigo-500 text-white hover:text-hsl transition-all duration-300 px-2 py-1 rounded-md'
                            href='/'
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            className='bg-slate-600 hover:bg-slate-700 text-white hover:text-orange-400 transition-all duration-300 px-2 py-1 rounded-md'
                            href='/products'
                        >
                            Products
                        </a>
                    </li>
                    <li>
                        <a
                            className='bg-[gray_light] hover:bg-slate-700 text-white hover:text-orange-400 transition-all duration-300 px-2 py-1 rounded-md'
                            href='/users'
                        >
                            User
                        </a>
                    </li>
                    <li>
                        <a
                            className='bg-green-600 hover:bg-slate-700 text-white hover:text-orange-400 transition-all duration-300 px-2 py-1 rounded-md'
                            href='/artist'
                        >
                            Artist
                        </a>
                    </li>
                    <li>
                        <a
                            className='text-white hover:text-orange-400 transition-all duration-300 px-2 py-1 rounded-md'
                            href='/album'
                        >
                            Album
                        </a>
                    </li>
                    <li>
                        <a
                            className='text-white hover:text-green-400 transition-all duration-300 px-2 py-1 rounded-md'
                            href='/popular_song'
                        >
                            Popular Songs
                        </a>
                    </li>
                </ul>
            </nav>
        </>
    )
}

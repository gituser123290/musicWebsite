import React from 'react';
import grass from '../assets/images/img.jpg'
import pic from '../assets/images/img.jpg'
import img from '../assets/images/img.jpg'


export default function AboutPage() {
  return (
    <div className="bg-gray-50 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800">About MusicStream</h1>
        <p className="text-xl text-gray-600 mt-4">
          Discover and enjoy music from your favorite artists, explore new tracks, and create personalized playlists.
        </p>
      </section>
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Our Features</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl text-blue-500 mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-gray-800">Endless Music Library</h3>
            <p className="text-gray-600 mt-2">
              Access millions of songs from various genres, artists, and albums. Always find something new to listen to!
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl text-green-500 mb-4">🔊</div>
            <h3 className="text-xl font-semibold text-gray-800">High-Quality Streaming</h3>
            <p className="text-gray-600 mt-2">
              Enjoy your music in high definition, no buffering, and seamless playback across all devices.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl text-purple-500 mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800">Custom Playlists</h3>
            <p className="text-gray-600 mt-2">
              Create, save, and share playlists based on your favorite tracks. Organize your music however you like.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white py-12">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Meet the Team</h2>
        <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-6 rounded-md shadow-md text-center">
            <img
              src={grass}
              alt="Team member"
              className="rounded-md mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Naurangi Lal</h3>
            <p className="text-gray-600">Lead Developer</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-md shadow-md text-center">
            <img
              src={pic}
              alt="Team member"
              className="rounded-md mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Naurangi Lal</h3>
            <p className="text-gray-600">UI/UX Designer</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-md shadow-md text-center">
            <img
              src={img}
              alt="Team member"
              className="rounded-md mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Naurangi Lal</h3>
            <p className="text-gray-600">Product Manager</p>
          </div>
        </div>
      </section>
      <section className="text-center py-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Get In Touch</h2>
        <p className="text-lg text-gray-600 mb-4">
          Have any questions or feedback? Reach out to us, and we'll get back to you as soon as possible!
        </p>
        <a
          href="mailto:naurangilal9675329115@gmail.com.com"
          className="inline-block bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
};


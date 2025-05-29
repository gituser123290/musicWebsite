import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ReactH5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import grass from '../assets/images/img.jpg';
import pic from '../assets/images/img.jpg';
import img from '../assets/images/img.jpg';

// Inline music icons (simple SVGs from Heroicons style)
const MusicNoteIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-2v13" />
    <circle cx="6" cy="18" r="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SpeakerWaveIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M7 9v6h4l5 5V4L11 9H7z"
    />
  </svg>
);

export default function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const teamMembers = [
    { name: 'Naurangi Lal', role: 'Lead Developer', image: grass, alt: 'Naurangi Lal, Lead Developer' },
    { name: 'Rajesh Kumar', role: 'UI/UX Designer', image: pic, alt: 'Rajesh Kumar, UI/UX Designer' },
    { name: 'Rajesh Kumar', role: 'Product Manager', image: img, alt: 'Rajesh Kumar, Product Manager' },
  ];

  return (
    <div className="min-h-screen bg-animated-gradient text-white py-12 px-4 sm:px-6 lg:px-8">
      <section className="text-center mb-16 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">About MusicStream</h1>
        <p className="text-xl leading-relaxed">
          Discover and enjoy music from your favorite artists, explore new tracks, and create personalized playlists.
        </p>
      </section>
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-semibold text-center mb-10 drop-shadow-md">Our Features</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <FeatureCard
            icon={<MusicNoteIcon className="w-10 h-10 text-orange-400" />}
            title="Endless Music Library"
            description="Access millions of songs from various genres, artists, and albums. Always find something new to listen to!"
            onClick={() => navigate('/songs')}
          >
            <AudioPlayer src="/sample-audio/song1.mp3" />
          </FeatureCard>

          <FeatureCard
            icon={<SpeakerWaveIcon className="w-10 h-10 text-green-400" />}
            title="High-Quality Streaming"
            description="Enjoy your music in high definition, no buffering, and seamless playback across all devices."
          />

          <FeatureCard
            icon={<MusicNoteIcon className="w-10 h-10 text-purple-400" />}
            title="Custom Playlists"
            description="Create, save, and share playlists based on your favorite tracks. Organize your music however you like."
            onClick={() => navigate('/playlists')}
          />
          <FeatureCard
            icon={<MusicNoteIcon className="w-10 h-10 text-pink-400" />}
            title="Browse Artists"
            description="Explore a diverse range of artists and find new favorites. Learn more about their work and journeys."
            onClick={() => navigate('/artists')}
          />
          <FeatureCard
            icon={<MusicNoteIcon className="w-10 h-10 text-blue-400" />}
            title="Browse Albums"
            description="Dive into collections of songs organized by your favorite artists. Discover new albums every day."
            onClick={() => navigate('/albums')}
          />
        </div>
      </section>

      <section className="bg-black bg-opacity-50 py-12 rounded-lg max-w-6xl mx-auto mb-20 shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-8 drop-shadow-md">Meet the Team</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map(({ name, role, image, alt }, index) => (
            <div
              key={index}
              data-aos="fade-up"
              className="bg-gray-900 p-6 rounded-lg shadow-lg text-center hover:scale-105 transition-transform duration-300"
            >
              <img
                src={image}
                alt={alt}
                className="rounded-full mx-auto mb-4 w-32 h-32 object-cover border-4 border-orange-400"
              />
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-gray-400">{role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 drop-shadow-md">Get In Touch</h2>
        <p className="text-lg mb-8 leading-relaxed max-w-xl mx-auto">
          Have any questions or feedback? Reach out to us, and we'll get back to you as soon as possible!
        </p>
        <a
          href="mailto:naurangilal9675329115@gmail.com"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, onClick, children }) {
  return (
    <div
      onClick={onClick}
      className="bg-black bg-opacity-40 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => onClick && e.key === 'Enter' && onClick()}
      data-aos="fade-up"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="mb-4 text-gray-300">{description}</p>
      {children}
    </div>
  );
}

// Audio player wrapper
function AudioPlayer({ src }) {
  return (
    <ReactH5AudioPlayer
      src={src}
      showJumpControls={false}
      customAdditionalControls={[]}
      layout="stacked"
      className="rounded-md shadow-lg"
    />
  );
}


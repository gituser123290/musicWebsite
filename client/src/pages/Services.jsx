import React from 'react';

const servicesData = [
  {
    title: 'Web Development',
    description:
      'We build responsive, SEO-friendly, and fast websites using Python, Django, DRF, React, Node.js, and Tailwind CSS.',
    icon: '🌐',
  },
  {
    title: 'UI/UX Design',
    description:
      'We craft intuitive and beautiful user interfaces that enhance user experiences with modern design principles.',
    icon: '🎨',
  },
  {
    title: 'Upload Song Collection',
    description: (
      <>
        Upload your favorite songs.{' '}
        <a className='text-orange-500 hover:text-white font-semibold text-lg underline' href='/createsong'>Upload a Song</a>.{' '}
        Enjoy a sleek UI to elevate your experience.
      </>
    ),
    icon: '🎧',
  },
  {
    title: 'Upload Artists Collection',
    description: (
      <>
        Share your favorite artists.{' '}
        <a className='text-orange-500 hover:text-white font-semibold text-lg underline' href='/createartist'>Upload Artist</a>.{' '}
        Discover and connect with music communities.
      </>
    ),
    icon: '👩‍🎤',
  },
  {
    title: 'Upload Albums Collection',
    description: (
      <>
        Add your top albums to the collection.{' '}
        <a className='text-orange-500 hover:text-white font-semibold text-lg underline' href='/createalbum'>Upload an Album</a>.{' '}
        Experience smooth navigation and vibrant layouts.
      </>
    ),
    icon: '💿',
  },
];

const ServiceCard = ({ title, description, icon }) => (
  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-md hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform text-white">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold">{title}</h3>
    <p className="mt-2 text-base leading-relaxed">{description}</p>
  </div>
);

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-gray-800 text-white relative pb-24">
      {/* Hero Section */}
      <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-500">
          Explore Our Music Services
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          From web development to uploading your music collection — we’ve got everything you need to showcase your music in style.
        </p>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>
      </div>

      {/* Sticky Audio Player (Placeholder) */}
      <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-md text-white px-6 py-4 flex justify-between items-center shadow-inner">
        <span className="font-semibold">🎶 Now Playing: Your Music Title Here</span>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold transition-all">
          ▶ Play
        </button>
      </div>
    </div>
  );
}

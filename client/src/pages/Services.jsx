import React from 'react';

const servicesData = [
  {
    title: 'Web Development',
    description:
      'We build responsive, SEO-friendly, and fast websites using modern technologies like Python, Django, Django REST FrameWork(DRF), React, Node.js, and Tailwind CSS.',
    icon: '🌐',
  },
  {
    title: 'UI/UX Design',
    description:
      'We craft intuitive and beautiful user interfaces that enhance user experiences with modern design principles.',
    icon: '🎨',
  },
];

const ServiceCard = ({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="text-gray-600 mt-2">{description}</p>
  </div>
);

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Our Services</h1>
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
  );
};



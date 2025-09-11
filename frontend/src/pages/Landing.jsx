import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';

const mockProducts = [
  { id: 1, imageUrl: '', title: 'Notion Templates Pack', price: '$29' },
  { id: 2, imageUrl: '', title: 'Icon Set – 500 Glyphs', price: '$19' },
  { id: 3, imageUrl: '', title: 'Indie Hacker Handbook', price: '$12' },
  { id: 4, imageUrl: '', title: 'SaaS UI Kit', price: '$39' },
  { id: 5, imageUrl: '', title: 'Podcast Starter Pack', price: '$24' },
  { id: 6, imageUrl: '', title: 'Photography LUTs', price: '$15' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Hero />
        </div>
        <ProductGrid products={mockProducts} />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;



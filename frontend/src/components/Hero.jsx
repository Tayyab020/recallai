import React from 'react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-100"
        >
          Create, sell, and grow on your terms
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-zinc-400 text-base sm:text-lg"
        >
          A clean, minimalist toolkit to showcase your products and connect with your audience.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <Button size="lg">Get started</Button>
          <Button variant="outline" size="lg">Learn more</Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;



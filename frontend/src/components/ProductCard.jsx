import React from 'react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const ProductCard = ({ imageUrl, title, price }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:shadow-xl hover:shadow-black/20 transition-shadow"
    >
      <div className="aspect-video bg-zinc-800/60">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="text-zinc-100 font-semibold">{title}</h3>
        <div className="mt-1 text-zinc-400 text-sm">{price}</div>
        <div className="mt-4">
          <Button className="w-full">Buy</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;



import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [] }) => {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} imageUrl={p.imageUrl} title={p.title} price={p.price} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;



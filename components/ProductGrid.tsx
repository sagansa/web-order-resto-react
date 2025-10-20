import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import ProductListCard from './ProductListCard';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  viewMode: 'grid' | 'list';
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductSelect, viewMode }) => {
  if (products.length === 0) {
    return <p className="text-gray-500">No products available.</p>;
  }
  
  // On larger screens, force grid view. The toggle is only shown on mobile.
  // The logic inside App.tsx ensures the toggle is only visible on mobile, so this component can respect the viewMode prop.
  if (viewMode === 'list') {
      return (
          <div className="space-y-3">
              {products.map(product => (
                  <ProductListCard key={product.id} product={product} onSelect={onProductSelect} />
              ))}
          </div>
      )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
      ))}
    </div>
  );
};

export default ProductGrid;
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col"
      onClick={() => onSelect(product)}
    >
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="w-full h-40 object-cover" 
      />
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 uppercase font-medium tracking-wide mb-1">{product.category}</p>
        <div className="flex-grow">
          <h3 className="text-base font-semibold text-gray-800 mb-1" title={product.name}>{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2" title={product.description}>{product.description}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-indigo-600 font-bold text-lg">Rp {product.basePrice.toLocaleString('id-ID')}</p>
          {(product.variants || product.modifiers) && (
             <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Customize</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
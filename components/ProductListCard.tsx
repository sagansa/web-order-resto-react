import React from 'react';
import { Product } from '../types';

interface ProductListCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductListCard: React.FC<ProductListCardProps> = ({ product, onSelect }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 flex items-center"
      onClick={() => onSelect(product)}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-24 h-24 object-cover flex-shrink-0"
      />
      <div className="p-3 flex-grow min-w-0">
        <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">{product.category}</p>
        <h3 className="text-sm font-semibold text-gray-800 truncate" title={product.name}>{product.name}</h3>
        <p className="text-xs text-gray-600 truncate mt-1" title={product.description}>{product.description}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-indigo-600 font-bold text-base">Rp {product.basePrice.toLocaleString('id-ID')}</p>
          {(product.variants || product.modifiers) && (
             <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full flex-shrink-0">Customize</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListCard;

import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import Modal from './Modal';
import ProductListCard from './ProductListCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, products, onProductSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      // Reset search query when modal is closed
      const timeout = setTimeout(() => setSearchQuery(''), 300); // Delay to avoid flash of content
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercasedQuery) ||
      product.category.toLowerCase().includes(lowercasedQuery) ||
      product.description.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, products]);

  const handleSelect = (product: Product) => {
    onProductSelect(product);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search Products">
      <div className="flex flex-col h-[70vh]">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for food, drinks, etc."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            autoFocus
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        
        <div className="mt-4 flex-grow overflow-y-auto pr-2">
          {searchQuery.trim() && filteredProducts.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p className="font-semibold">No products found for "{searchQuery}"</p>
              <p className="text-sm mt-1">Try searching for something else.</p>
            </div>
          )}
          {filteredProducts.length > 0 && (
            <div className="space-y-3">
              {filteredProducts.map(product => (
                <ProductListCard key={product.id} product={product} onSelect={handleSelect} />
              ))}
            </div>
          )}
          {!searchQuery.trim() && (
             <div className="text-center py-10 text-gray-400 flex flex-col items-center justify-center h-full">
                <p>Start typing to see search results.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;

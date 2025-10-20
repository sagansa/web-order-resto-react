import React from 'react';
import { CartItem } from '../types';

interface OrderItemCardProps {
  item: CartItem;
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onEdit: (item: CartItem) => void;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item, onRemove, onUpdateQuantity, onEdit }) => {
  const handleQuantityChange = (amount: number) => {
    const newQuantity = item.quantity + amount;
    if (newQuantity >= 1) {
      onUpdateQuantity(item.id, newQuantity);
    } else if (newQuantity === 0) {
      onRemove(item.id);
    }
  };

  const customizations = [
    ...item.selectedVariants.map(v => v.optionName),
    ...item.selectedModifiers.map(m => m.optionName)
  ].join(', ');

  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300/70 transition-all duration-200">
      <div className="flex items-start space-x-3">
        <img 
          src={item.product.imageUrl} 
          alt={item.product.name} 
          className="w-14 h-14 object-cover rounded-md flex-shrink-0"
        />
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-grow">
              <h4 className="text-sm font-semibold text-gray-800 truncate" title={item.product.name}>
                {item.product.name}
              </h4>
              {customizations && (
                <p className="mt-0.5 text-xs text-gray-500 line-clamp-2" title={customizations}>
                  {customizations}
                </p>
              )}
              {item.notes && (
                <p className="mt-1.5 text-xs text-gray-800 bg-gray-100 p-2 rounded-md" title={item.notes}>
                  <span className="font-semibold text-gray-600">Note:</span> {item.notes}
                </p>
              )}
            </div>
            <div className="flex items-center flex-shrink-0">
               <button 
                onClick={() => onEdit(item)}
                className="text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-full p-1.5 transition-colors"
                aria-label="Edit item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
                </svg>
              </button>
              <button 
                onClick={() => onRemove(item.id)} 
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1.5 transition-colors" 
                aria-label="Remove item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center space-x-1.5">
              <button 
                onClick={() => handleQuantityChange(-1)} 
                className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Decrease quantity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </svg>
              </button>
              <span className="text-sm font-medium text-gray-800 w-5 text-center">{item.quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)} 
                className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Increase quantity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <p className="text-base font-semibold text-gray-800">Rp {item.totalPrice.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
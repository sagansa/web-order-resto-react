import React from 'react';
import { OrderTypeDetails } from '../types';

interface OrderTypeSelectorProps {
  currentOrderType: OrderTypeDetails | null;
  onSelectDineIn: () => void;
  onSelectTakeaway: () => void;
  isFixed: boolean; // True if determined by URL param
}

const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({ currentOrderType, onSelectDineIn, onSelectTakeaway, isFixed }) => {
  
  const handleDineInClick = () => {
    if (isFixed) return;
    onSelectDineIn();
  };
  
  const handleTakeawayClick = () => {
    if (isFixed) return;
    onSelectTakeaway();
  };
  
  const getTypeLabel = () => {
    if (!currentOrderType) return 'Loading...';
    if (currentOrderType.type === 'Dine In') return `Dine In at Table ${currentOrderType.table}`;
    return 'Takeaway';
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Order Type</h3>
          <p className="text-sm text-gray-600">{getTypeLabel()}</p>
        </div>
        {!isFixed && (
            <div className="flex items-center rounded-lg border p-1 bg-gray-50">
                <button
                    onClick={handleDineInClick}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${currentOrderType?.type === 'Dine In' ? 'bg-indigo-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Dine In
                </button>
                <button
                    onClick={handleTakeawayClick}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentOrderType?.type === 'Takeaway' ? 'bg-indigo-600 text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                    Takeaway
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default OrderTypeSelector;
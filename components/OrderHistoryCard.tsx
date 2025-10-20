import React from 'react';
import { Order } from '../types';

interface OrderHistoryCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({ order, onViewDetails }) => {
  const formattedDate = new Date(order.timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Order #{order.id}</p>
          <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-800">Rp {order.total.toLocaleString('id-ID')}</p>
          <p className="text-xs text-gray-500">{totalItems} item(s)</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
        <button
          onClick={() => onViewDetails(order)}
          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default OrderHistoryCard;

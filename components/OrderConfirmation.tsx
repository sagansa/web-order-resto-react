import React from 'react';
import { Order } from '../types';

interface OrderConfirmationProps {
  order: Order;
  onStartNewOrder: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onStartNewOrder }) => {

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Order Confirmed!</h2>
        <p className="text-gray-500 mt-2">Thank you, {order.customerName}. Your order at <span className="font-semibold">{order.restaurantName}</span> is being prepared.</p>
        
        <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium text-gray-800">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Type:</span>
              <span className="font-medium text-gray-800">{order.orderTypeDetails.type === 'Dine In' ? `Table: ${order.orderTypeDetails.table}`: 'Takeaway'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Items:</span>
              <span className="font-medium text-gray-800">{totalItems}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-gray-600">Payment Status:</span>
              <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>{order.paymentStatus}</span>
            </div>
            {order.paymentStatus === 'Unpaid' && (
                 <div className="text-center pt-4">
                    <p className="font-semibold text-indigo-600">Please complete your payment at the cashier.</p>
                </div>
            )}
            <div className="flex justify-between pt-4 border-t mt-4">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-lg font-bold text-gray-800">Rp {order.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onStartNewOrder}
          className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Start New Order
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;

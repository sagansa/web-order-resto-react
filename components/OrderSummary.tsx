import React from 'react';
import { CartItem, OrderTypeDetails } from '../types';
import OrderItemCard from './OrderItemCard';
import { calculateCartTotals } from '../utils/pricing';

interface OrderSummaryProps {
  cartItems: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onCheckout: () => void;
  onEditItem: (item: CartItem) => void;
  orderTypeDetails: OrderTypeDetails | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems, onRemoveItem, onUpdateQuantity, onCheckout, onEditItem, orderTypeDetails }) => {
  const { subtotal, taxAmount, total, taxRate } = calculateCartTotals(cartItems);
  
  const getOrderTypeLabel = () => {
    if (!orderTypeDetails) return "Select Order Type";
    if (orderTypeDetails.type === 'Dine In') {
      return `Dine In - Table: ${orderTypeDetails.table}`;
    }
    const providerName = orderTypeDetails.provider === 'Non-Online' ? 'Standard' : orderTypeDetails.provider;
    return `Takeaway - ${providerName}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Order Summary</h2>
        <p className="text-sm font-medium text-indigo-600 mt-1">{getOrderTypeLabel()}</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <p className="text-lg">Your cart is empty.</p>
          <p className="text-sm">Add products to get started.</p>
        </div>
      ) : (
        <div className="space-y-4 flex-grow overflow-y-auto pr-2 -mr-2"> {/* Added padding for scrollbar */}
          {cartItems.map(item => (
            <OrderItemCard 
              key={item.id} 
              item={item} 
              onRemove={onRemoveItem} 
              onUpdateQuantity={onUpdateQuantity}
              onEdit={onEditItem}
            />
          ))}
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
              <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-800">
              <span>Total</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <button
            onClick={onCheckout}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
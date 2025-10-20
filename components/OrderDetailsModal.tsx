import React from 'react';
import { Order, CartItem } from '../types';
import Modal from './Modal';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsItem: React.FC<{ item: CartItem }> = ({ item }) => {
    const customizations = [
      ...item.selectedVariants.map(v => v.optionName),
      ...item.selectedModifiers.map(m => m.optionName)
    ].join(', ');

  return (
    <li className="flex items-center justify-between py-3">
        <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center font-semibold text-indigo-600">
                {item.quantity}x
            </div>
            <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                {customizations && <p className="text-xs text-gray-500 truncate">{customizations}</p>}
                {item.notes && <p className="text-xs text-gray-500 mt-1 italic">Note: {item.notes}</p>}
            </div>
        </div>
        <p className="text-sm font-medium text-gray-800">Rp {(item.totalPrice).toLocaleString('id-ID')}</p>
    </li>
  );
};

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!order) {
    return null;
  }
  
  const getOrderTypeLabel = () => {
    if (order.orderTypeDetails.type === 'Dine In') {
      return `Dine In - Table: ${order.orderTypeDetails.table}`;
    }
    const providerName = order.orderTypeDetails.provider === 'Non-Online' ? 'Standard' : order.orderTypeDetails.provider;
    return `Takeaway - ${providerName}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order Details #${order.id}`}>
      <div className="space-y-6">
        {/* Restaurant, Customer & Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
             <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-1">Restaurant</h4>
                <p className="text-gray-600 font-medium">{order.restaurantName}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-1">Customer</h4>
                <p className="text-gray-600">{order.customerName}</p>
                <p className="text-gray-600">{order.customerPhone}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-1">Order Info</h4>
                <p className="text-gray-600">{getOrderTypeLabel()}</p>
                <p className="text-gray-600">
                    Paid via <span className="capitalize">{order.paymentMethod}</span> ({order.paymentStatus})
                </p>
            </div>
        </div>

        {/* Items */}
        <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Items</h4>
            <ul className="divide-y divide-gray-200 border-t border-b">
                {order.items.map((item) => (
                    <OrderDetailsItem key={item.id} item={item} />
                ))}
            </ul>
        </div>
        
        {/* Totals */}
        <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>Rp {order.taxAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-800 pt-2 border-t mt-2">
              <span>Total Paid</span>
              <span>Rp {order.total.toLocaleString('id-ID')}</span>
            </div>
        </div>

      </div>
    </Modal>
  );
};

export default OrderDetailsModal;

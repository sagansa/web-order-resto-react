import React, { useState } from 'react';
import { OrderTypeDetails, TakeawayProvider } from '../types';
import Modal from './Modal';

interface OrderTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: OrderTypeDetails) => void;
}

const OrderTypeModal: React.FC<OrderTypeModalProps> = ({ isOpen, onClose, onSave }) => {
  const [mode, setMode] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [table, setTable] = useState('');
  const [provider, setProvider] = useState<TakeawayProvider>('Non-Online');

  const handleSave = () => {
    if (mode === 'dine-in') {
      if (table.trim()) {
        onSave({ type: 'Dine In', table: table.trim() });
      } else {
        alert('Please enter a table number.');
      }
    } else {
      onSave({ type: 'Takeaway', provider });
    }
  };

  const footerContent = (
    <button
      onClick={handleSave}
      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
    >
      Save Order Type
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Order Type" footerContent={footerContent}>
      <div className="flex justify-center p-1 bg-gray-100 rounded-lg mb-6">
        <button
          onClick={() => setMode('dine-in')}
          className={`px-6 py-2 w-1/2 rounded-md font-medium transition-colors ${mode === 'dine-in' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}
        >
          Dine In
        </button>
        <button
          onClick={() => setMode('takeaway')}
          className={`px-6 py-2 w-1/2 rounded-md font-medium transition-colors ${mode === 'takeaway' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}
        >
          Takeaway
        </button>
      </div>

      {mode === 'dine-in' && (
        <div>
          <label htmlFor="table-number" className="block text-sm font-medium text-gray-700">
            Table Number
          </label>
          <input
            type="text"
            id="table-number"
            value={table}
            onChange={(e) => setTable(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., 12A"
            autoFocus
          />
        </div>
      )}

      {mode === 'takeaway' && (
        <div>
          <label htmlFor="takeaway-provider" className="block text-sm font-medium text-gray-700">
            Takeaway Provider
          </label>
          <select
            id="takeaway-provider"
            value={provider}
            onChange={(e) => setProvider(e.target.value as TakeawayProvider)}
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="Non-Online">Standard (Non-Online)</option>
            <option value="Shopee">Shopee</option>
            <option value="Gojek">Gojek</option>
            <option value="Grab">Grab</option>
          </select>
        </div>
      )}
    </Modal>
  );
};

export default OrderTypeModal;

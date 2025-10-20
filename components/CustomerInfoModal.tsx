import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface CustomerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: { name: string; phone: string; }) => void;
  initialData?: { name: string; phone: string; } | null;
  isEditing?: boolean;
}

const CustomerInfoModal: React.FC<CustomerInfoModalProps> = ({ isOpen, onClose, onSave, initialData, isEditing }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setPhone(initialData?.phone || '');
      setError('');
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      setError('Both name and phone number are required.');
      return;
    }
    if (!/^\d{8,}$/.test(phone.trim())) {
      setError('Please enter a valid phone number (at least 8 digits).');
      return;
    }
    onSave({ name: name.trim(), phone: phone.trim() });
  };

  const title = isEditing ? 'Edit Customer Profile' : 'Customer Information';
  const buttonText = isEditing ? 'Save Changes' : 'Proceed to Payment';

  const footerContent = (
    <button
      onClick={handleSave}
      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
    >
      {buttonText}
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footerContent={footerContent}>
      <div className="space-y-4">
        {!isEditing && <p className="text-sm text-gray-600">Please enter customer details to proceed.</p>}
        <div>
          <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700">
            Customer Name
          </label>
          <input
            type="text"
            id="customer-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., John Doe"
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="customer-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., 081234567890"
          />
        </div>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
    </Modal>
  );
};

export default CustomerInfoModal;

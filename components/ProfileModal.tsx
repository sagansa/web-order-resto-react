import React, { useState } from 'react';
import { Order } from '../types';
import Modal from './Modal';
import OrderHistoryCard from './OrderHistoryCard';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: { name: string; phone: string } | null;
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onEditProfile: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, customer, orders, onViewDetails, onEditProfile }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer Profile">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('details')}
            className={`${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
          >
            My Details
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`${
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
          >
            Order History
          </button>
        </nav>
      </div>

      <div className="pt-6">
        {activeTab === 'details' && (
          <div className="space-y-4">
            {customer ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Name</label>
                  <p className="mt-1 text-base text-gray-900">{customer.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-base text-gray-900">{customer.phone}</p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={onEditProfile}
                    className="w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit Profile
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No customer information saved.</p>
                <button
                  onClick={onEditProfile}
                  className="mt-2 text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Add your details
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
           <div>
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-gray-500 py-10">
                <p className="text-lg">No past orders found.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {orders.map(order => (
                  <OrderHistoryCard key={order.id} order={order} onViewDetails={onViewDetails} />
                ))}
              </div>
            )}
           </div>
        )}
      </div>
    </Modal>
  );
};

export default ProfileModal;

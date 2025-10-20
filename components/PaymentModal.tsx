import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import Modal from './Modal';
import { createMidtransTransaction } from '../utils/midtrans';

// Mock snap.js interface
declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: {
        onSuccess?: (result: any) => void;
        onPending?: (result: any) => void;
        onError?: (result: any) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Omit<Order, 'paymentMethod' | 'paymentStatus'> | null;
  onPaymentSuccess: (finalOrder: Order) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, order, onPaymentSuccess }) => {
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setError('');
    setIsProcessing(false);
  }, [isOpen, order]);

  const handlePayAtCashier = () => {
    if (!order) return;
    const finalOrder: Order = {
        ...order,
        paymentMethod: 'cash',
        paymentStatus: 'Unpaid',
    };
    onPaymentSuccess(finalOrder);
  };

  const handlePayWithMidtrans = async () => {
    if (!order) return;

    setError('');
    setIsProcessing(true);

    try {
      const transactionDetails = {
        totalAmount: order.total,
        customerDetails: { name: order.customerName, phone: order.customerPhone },
        cartItems: order.items,
      };
      const { token } = await createMidtransTransaction(transactionDetails);
      
      let paymentFinished = false;

      window.snap.pay(token, {
        onSuccess: (result) => {
          paymentFinished = true;
          console.log('Midtrans Success:', result);
          const finalOrder: Order = {
            ...order,
            paymentMethod: 'midtrans',
            paymentStatus: 'Paid',
            midtransTransactionId: result.transaction_id,
          };
          onPaymentSuccess(finalOrder);
        },
        onPending: (result) => {
          paymentFinished = true;
          console.log('Midtrans Pending:', result);
          setError('Payment is pending. Please complete the payment.');
          setIsProcessing(false);
        },
        onError: (result) => {
          paymentFinished = true;
          console.error('Midtrans Error:', result);
          setError('Payment failed. Please try again or pay at the cashier.');
          setIsProcessing(false);
        },
        onClose: () => {
          if (paymentFinished) return;
          console.log('Midtrans popup closed by user.');
          setError('Payment process was cancelled.');
          setIsProcessing(false);
        }
      });
    } catch (e) {
      console.error("Payment processing error:", e);
      setError("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Payment Method">
      <div className="space-y-4 text-center">
        <p className="text-gray-600">Please choose how you'd like to pay for your order totaling <span className="font-bold text-gray-800">Rp {order.total.toLocaleString('id-ID')}</span>.</p>
        
        <div className="flex flex-col md:flex-row gap-4 pt-4">
            {/* Pay at Cashier */}
            <button
                onClick={handlePayAtCashier}
                disabled={isProcessing}
                className="w-full flex-1 p-4 rounded-lg border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
            >
                <div className="font-semibold text-lg text-gray-800">Pay at Cashier</div>
                <div className="text-sm text-gray-500 mt-1">Confirm your order now and pay manually at the counter.</div>
            </button>
            
            {/* Pay Online */}
            <button
                onClick={handlePayWithMidtrans}
                disabled={isProcessing}
                className="w-full flex-1 p-4 rounded-lg border-2 border-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
                <div className="font-semibold text-lg text-indigo-700">{isProcessing ? 'Processing...' : 'Pay Now (Online)'}</div>
                <div className="text-sm text-indigo-600 mt-1">Use QRIS, Cards, and more via Midtrans.</div>
            </button>
        </div>
        
        {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </Modal>
  );
};

export default PaymentModal;

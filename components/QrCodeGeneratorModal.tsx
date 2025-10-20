import React, { useState, useEffect, useRef } from 'react';
import { Restaurant } from '../types';
import Modal from './Modal';
import { mockRestaurants } from '../data/mockRestaurant';

// declare qrcode global from script
declare var qrcode: any;

interface QrCodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QrCodeGeneratorModal: React.FC<QrCodeGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(mockRestaurants[0]?.id || '');
  const [table, setTable] = useState<string>('1');
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && selectedRestaurantId && table && qrCodeRef.current && typeof qrcode !== 'undefined') {
        const url = `${window.location.origin}/?restaurantId=${selectedRestaurantId}&table=${table}`;
        qrCodeRef.current.innerHTML = ''; // Clear previous QR code
        try {
            const typeNumber = 4;
            const errorCorrectionLevel = 'L';
            const qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData(url);
            qr.make();
            qrCodeRef.current.innerHTML = qr.createImgTag(6, 12); // (cellSize, margin)
            // The generated img tag does not have alt text, let's add one for accessibility
            const img = qrCodeRef.current.querySelector('img');
            if (img) {
                const restaurantName = mockRestaurants.find(r => r.id === selectedRestaurantId)?.name || 'the restaurant';
                img.alt = `QR Code for ${restaurantName}, Table ${table}`;
                img.style.margin = 'auto'; // Center the image
            }
        } catch(e) {
            console.error("Error generating QR code:", e);
            qrCodeRef.current.innerHTML = '<p class="text-red-500">Could not generate QR code.</p>';
        }
    }
  }, [isOpen, selectedRestaurantId, table]);
  
  const handlePrint = () => {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
          const restaurantName = mockRestaurants.find(r => r.id === selectedRestaurantId)?.name;
          printWindow.document.write('<html><head><title>Print QR Code</title>');
          printWindow.document.write('<style>body { font-family: sans-serif; text-align: center; padding-top: 50px; } img { max-width: 80%; } </style>');
          printWindow.document.write('</head><body>');
          printWindow.document.write(`<h1>${restaurantName}</h1>`);
          printWindow.document.write(`<h2>Table: ${table}</h2>`);
          if (qrCodeRef.current) {
            printWindow.document.write(qrCodeRef.current.innerHTML);
          }
          printWindow.document.write('<p>Scan to order</p>');
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
      }
  };

  const footerContent = (
    <button
      onClick={handlePrint}
      disabled={!selectedRestaurantId || !table.trim()}
      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7V9h6v3z" clipRule="evenodd" />
      </svg>
      Print QR Code
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Restaurant QR Code" footerContent={footerContent}>
        <div className="space-y-6">
            <div>
                <label htmlFor="restaurant-select" className="block text-sm font-medium text-gray-700">
                    Restaurant
                </label>
                <select
                    id="restaurant-select"
                    value={selectedRestaurantId}
                    onChange={(e) => setSelectedRestaurantId(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    {mockRestaurants.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="table-number-input" className="block text-sm font-medium text-gray-700">
                    Table Number
                </label>
                <input
                    type="text"
                    id="table-number-input"
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., 12A"
                />
            </div>
            {(selectedRestaurantId && table.trim()) ? (
                <div className="pt-4 text-center border-t mt-4">
                    <h4 className="text-lg font-medium text-gray-800">Scan to Order</h4>
                    <div ref={qrCodeRef} className="mt-4 flex justify-center items-center h-48 w-48 mx-auto bg-gray-50 p-2 rounded-lg">
                        {/* QR Code will be rendered here */}
                    </div>
                </div>
            ) : (
                 <div className="pt-4 text-center text-gray-500 border-t mt-4">
                    <p>Please select a restaurant and enter a table number.</p>
                </div>
            )}
        </div>
    </Modal>
  );
};

export default QrCodeGeneratorModal;

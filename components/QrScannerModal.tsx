import React, { useEffect, useRef } from 'react';
import Modal from './Modal';

// This is a global variable from the script loaded in index.html
declare var Html5Qrcode: any;

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const scannerRef = useRef<any>(null);
  const readerId = "qr-reader";

  useEffect(() => {
    if (isOpen && typeof Html5Qrcode !== 'undefined') {
      const html5QrCode = new Html5Qrcode(readerId);
      scannerRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      const startScanner = async () => {
        try {
          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText: string) => {
              // Using a local variable for the scanner to ensure we call stop on the correct instance
              if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().then(() => {
                    onScanSuccess(decodedText);
                }).catch(err => {
                    console.error("Failed to stop scanner after success", err);
                    onScanSuccess(decodedText); // Proceed even if stop fails
                });
              }
            },
            (errorMessage: string) => {
              // Error callback, can be ignored.
            }
          );
        } catch (err) {
          console.error("Unable to start QR scanner.", err);
          alert("Could not start QR scanner. Please check camera permissions and refresh the page.");
          onClose();
        }
      };

      startScanner();
    }

    // Cleanup function
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err: any) => {
          // This error can happen if the scanner is already stopped, so we can often ignore it.
          console.warn("QR scanner stop error on cleanup (might be safe to ignore):", err);
        });
        scannerRef.current = null;
      }
    };
  }, [isOpen, onScanSuccess, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Scan Table QR Code">
        <div className="flex flex-col items-center">
            <p className="mb-4 text-gray-600 text-center">Point your camera at the QR code on your table.</p>
            <div id={readerId} style={{ width: '100%', maxWidth: '500px' }}></div>
        </div>
    </Modal>
  );
};

export default QrScannerModal;
'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function WebQRScanner({ onResult }: { onResult: (result: string) => void }) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraStarted, setCameraStarted] = useState(false);

  const startCamera = async () => {
    try {
      const cameraId = (await Html5Qrcode.getCameras())[0]?.id;
      if (!cameraId) throw new Error('No camera found');

      scannerRef.current = new Html5Qrcode('qr-reader');
      await scannerRef.current.start(
        cameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onResult(decodedText);
        },
        (error) => {
          // console.warn('QR scan error:', error);
        }
      );
      setCameraStarted(true);
    } catch (err) {
      console.error('Camera start failed:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().then(() => {
          scannerRef.current?.clear();
        });
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div id="qr-reader" style={{ width: '250px', borderRadius: 8, overflow: 'hidden' }} />

      {!cameraStarted && (
        <button
          onClick={startCamera}
          style={{
            padding: '10px 20px',
            marginTop: '16px',
            backgroundColor: '#007AFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Start Camera Scanner
        </button>
      )}
    </div>
  );
}

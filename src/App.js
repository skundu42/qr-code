import React, { useRef, useState } from 'react';
import { Html5Qrcode } from "html5-qrcode";
import './App.css';

function App() {
  const qrCodeRegionId = "qr-reader";
  const [scanResult, setScanResult] = useState(null);
  const html5QrCode = useRef(null);
  const isScannerRunning = useRef(false);

  const startScanning = async () => {
    if (!isScannerRunning.current) {
      html5QrCode.current = new Html5Qrcode(qrCodeRegionId);
      try {
        await html5QrCode.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            setScanResult(decodedText);
            stopScanning();
          },
          (errorMessage) => {
            console.error("QR Code scanning failed:", errorMessage);
          }
        );
        isScannerRunning.current = true;
      } catch (err) {
        console.error("Error initializing scanner:", err);
      }
    }
  };

  const stopScanning = () => {
    if (html5QrCode.current && isScannerRunning.current) {
      html5QrCode.current.stop()
        .then(() => {
          html5QrCode.current.clear();
          isScannerRunning.current = false;
        })
        .catch((err) => console.error("Stop failed:", err));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h2>QR Code Scanner</h2>
          <button onClick={startScanning}>Open Scanner</button>
          <div id={qrCodeRegionId} style={{ width: "300px", margin: "20px auto" }}></div>
          {scanResult && (
            <p>
              Scanned Result: <strong>{scanResult}</strong>
            </p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;

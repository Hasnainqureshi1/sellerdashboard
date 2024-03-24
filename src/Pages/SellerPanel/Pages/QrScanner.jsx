import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Link } from 'react-router-dom';

const QrScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState(null); // State to hold the scanner instance
//when order complete update the sales in sellers doc
  useEffect(() => {
    const qrScanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });
    qrScanner.render(success, error);

    function success(result) {
      qrScanner.clear();
      console.log(`QR Code detected: ${result}`);
    }
    
    function error(err) {
      console.warn(err);
    }

    setScanner(qrScanner); // Store the scanner instance
    return () => qrScanner.clear(); // Cleanup on component unmount
  }, []);

  const stopScanning = () => {
    if (scanner) {
      scanner.clear(); // Stop scanning
      setIsScanning(false); // Update scanning state
    }
  };

  return (
    <div className="w-full bg-gray-100 flex flex-col px-5">
      <div className="bg-white mt-4 relative">
        <div id="reader" className="flex bg-white z-10 justify-center items-center h-96"></div>
        <div className='p-2'>
          <Link to='/sellerPanel/orders' className="text-green-500 flex justify-center items-center hover:text-green-700" onClick={stopScanning}>
            <p className='text-xl'>Return to Back</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QrScanner;

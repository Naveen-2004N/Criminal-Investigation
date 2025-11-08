import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw } from 'lucide-react';

const WebcamCapture = ({ onCapture, maxImages = 5 }) => {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  
  const videoConstraints = { width: 720, height: 480, facingMode: "user" };

  const capture = useCallback(() => {
    if (webcamRef.current && capturedImages.length < maxImages) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const newImages = [...capturedImages, imageSrc];
        setCapturedImages(newImages);
        onCapture(newImages); // Pass the whole array
      }
    }
  }, [webcamRef, capturedImages, maxImages, onCapture]);

  const resetCapture = () => {
    setCapturedImages([]);
    onCapture([]); // Clear images in parent component
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        <Camera className="inline-block mr-2 text-blue-500" size={20} />
        Face Capture ({capturedImages.length}/{maxImages})
      </h3>
      <div className="relative bg-black rounded-md overflow-hidden">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full"
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={capture}
            disabled={capturedImages.length >= maxImages}
            className="btn btn-primary rounded-full"
          >
            <Camera size={18} className="mr-2" />
            Capture
          </button>
        </div>
      </div>
      
      {capturedImages.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-700">Captured Images</h4>
            <button 
              onClick={resetCapture}
              className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center"
            >
              <RefreshCw size={14} className="mr-1" /> Reset
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {capturedImages.map((img, index) => (
              <div key={index} className="relative">
                <img 
                  src={img} 
                  alt={`captured-${index}`}
                  className="w-full h-20 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;

import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle, Loader, DownloadCloud } from 'lucide-react';
import ImageUploader from '../components/ImageUploader.jsx';
import CriminalCard from '../components/CriminalCard.jsx';
import { getCriminals } from '../services/criminalService.js';
import { loadModels, getFullFaceDescription, createFaceMatcher } from '../utils/faceapi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { notifyDetection } from '../services/notificationService.js'; // --- ADD THIS IMPORT ---

const ModelError = ({ error }) => (
    <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg" role="alert">
        <div className="flex">
            <div className="py-1"><AlertCircle className="h-6 w-6 text-red-400 mr-4"/></div>
            <div>
                <p className="font-bold text-lg mb-2">Critical Error: AI Models Not Found</p>
                <p className="mb-4">The application could not load the required face recognition models. This is usually because they are missing from the `frontend/public/models` directory.</p>
                <p className="font-semibold mb-2">To fix this:</p>
                <ol className="list-decimal list-inside space-y-2 mb-4">
                    <li>Download the model files from the official `face-api.js` repository.</li>
                    <li>Create a folder named `models` inside your `frontend/public/` directory.</li>
                    <li>Place all downloaded model files directly into `frontend/public/models/`.</li>
                    <li>After placing the files, please refresh this page.</li>
                </ol>
                <a 
                  href="https://github.com/justadudewhohacks/face-api.js/tree/master/weights" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <DownloadCloud className="mr-2" size={16} />
                  Get Model Files Here
                </a>
            </div>
        </div>
    </div>
);


const DetectCriminal = () => {
  const [imageBase64, setImageBase64] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedCriminals, setDetectedCriminals] = useState([]);
  const [hasDetected, setHasDetected] = useState(false);
  const [error, setError] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [allCriminals, setAllCriminals] = useState([]);
  const { userInfo } = useAuth();

  useEffect(() => {
    if (userInfo) {
        const initialize = async () => {
            try {
                if (!modelsLoaded) {
                    await loadModels();
                    const matcher = await createFaceMatcher();
                    const criminalsData = await getCriminals();
                    setFaceMatcher(matcher);
                    setAllCriminals(criminalsData);
                    setModelsLoaded(true);
                }
            } catch (err) {
                setError(err.message || 'Could not load AI models.');
                console.error(err);
            }
        };
        initialize();
    }
  }, [userInfo, modelsLoaded]);

  const handleImageSelect = (file, base64) => {
    setImageBase64(base64);
    setHasDetected(false);
    setDetectedCriminals([]);
    setError('');
  };

  const handleImageClear = () => {
    setImageBase64(null);
    setHasDetected(false);
    setDetectedCriminals([]);
    setError('');
  };
  
  const handleDetect = async () => {
    if (!imageBase64 || !faceMatcher) return;
    
    setIsDetecting(true);
    setHasDetected(false);
    setError('');
    
    try {
      const fullDesc = await getFullFaceDescription(imageBase64);
      if (fullDesc && fullDesc.length > 0) {
        const matches = fullDesc.map(fd => {
          const bestMatch = faceMatcher.findBestMatch(fd.descriptor);
          return { bestMatch, detection: fd.detection };
        });

        const matchedCriminals = matches
          .filter(match => match.bestMatch.label !== 'unknown')
          .map(match => {
            const criminal = allCriminals.find(c => c.name === match.bestMatch.label);
            if (!criminal) return null;
            return {
                ...criminal,
                confidence: Math.round((1 - match.bestMatch.distance) * 100)
            };
        }).filter(Boolean);

        if (matchedCriminals.length > 0) {
          console.log(`Detected ${matchedCriminals.length} criminals. Sending notifications...`);
          matchedCriminals.forEach(criminal => {
            try {
              notifyDetection(criminal.name, "Image Upload");
            } catch (error) {
              console.error(`Failed to send notification for ${criminal.name}:`, error);
            }
          });
        }

        setDetectedCriminals(matchedCriminals);

      } else {
        setDetectedCriminals([]);
      }
    } catch (err) {
      setError('Detection failed. Please try again.');
      console.error(err);
    } finally {
      setIsDetecting(false);
      setHasDetected(true);
    }
  };


  if (!modelsLoaded && !error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
        <Loader className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-gray-600 text-lg">Loading AI Models...</p>
        <p className="text-gray-500">This may take a moment on the first visit.</p>
      </div>
    );
  }
  
  if (error && !modelsLoaded) {
      return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Search className="mr-3 text-blue-500" size={28} /> Detect by Image
            </h1>
            <ModelError error={error} />
        </div>
      )
  }
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <Search className="mr-3 text-blue-500" size={28} /> Detect by Image
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ImageUploader onImageSelect={handleImageSelect} onImageClear={handleImageClear} />
          {imageBase64 && (
            <button onClick={handleDetect} disabled={isDetecting || !modelsLoaded} className="btn btn-primary w-full">
              {isDetecting ? 'Detecting...' : 'Detect Criminals'}
            </button>
          )}
          {error && modelsLoaded && <div className="text-red-500 text-center">{error}</div>}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 min-h-[400px]">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Detection Results</h2>
          
          {isDetecting ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 text-center">Analyzing image...</p>
            </div>
          ) : hasDetected ? (
            detectedCriminals.length > 0 ? (
              <div className="space-y-4">
                <div className="text-green-600 font-medium flex items-center">
                  <CheckCircle size={20} className="mr-2" />
                  {detectedCriminals.length} potential match(es) found.
                </div>
                {detectedCriminals.map(match => (
                    <CriminalCard key={match._id} criminal={match} confidence={match.confidence} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle size={48} className="text-orange-500 mb-4" />
                <h3 className="text-lg font-medium">No Matches Found</h3>
                <p className="text-gray-500">No known criminals were found in the uploaded image.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Search size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500">Upload an image to begin detection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetectCriminal;
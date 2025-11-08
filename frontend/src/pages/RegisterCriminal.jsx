import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle, BrainCircuit, AlertCircle, DownloadCloud } from 'lucide-react';
import CriminalForm from '../components/CriminalForm.jsx';
import WebcamCapture from '../components/WebcamCapture.jsx';
import { registerCriminal as apiRegisterCriminal } from '../services/criminalService.js';
import { loadModels, getFullFaceDescription } from '../utils/faceapi.js';

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


const RegisterCriminal = () => {
  const navigate = useNavigate();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadModels()
      .then(() => setModelsLoaded(true))
      .catch(err => {
          console.error(err);
          setError(err.message);
      });
  }, []);

  const handleCapture = (images) => {
    setCapturedImages(images);
  };
  
  const handleSubmit = async (formData) => {
    if (capturedImages.length < 1) {
      setError('Please capture at least 1 face image.');
      return;
    }
    
    setIsRegistering(true);
    setError('');

    try {
      const faceDescriptors = [];
      for (const image of capturedImages) {
        const descriptions = await getFullFaceDescription(image);
        if (descriptions.length > 0) {
          faceDescriptors.push(Array.from(descriptions[0].descriptor));
        }
      }
      
      if (faceDescriptors.length === 0) {
          setError("Could not detect a face in the captured images. Please try again with a clearer picture.");
          setIsRegistering(false);
          return;
      }
      
      const criminalData = { ...formData, images: capturedImages, faceDescriptors };
      await apiRegisterCriminal(criminalData);
      
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register criminal.');
    } finally {
        setIsRegistering(false);
    }
  };
  
  if (!modelsLoaded && !error) {
      return <div className="flex items-center justify-center h-64"><BrainCircuit className="animate-pulse mr-3"/>Loading AI Models for Registration...</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <UserPlus className="mr-3 text-blue-500" size={28} /> Register Criminal
      </h1>
      
      {error && !modelsLoaded && <ModelError error={error} />}
      {error && modelsLoaded && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      
      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-center">
          <CheckCircle size={48} className="text-green-500 mr-4" />
          <div>
            <h3 className="text-xl font-medium text-green-800 mb-1">Registration Successful</h3>
            <p className="text-green-700">Redirecting to dashboard...</p>
          </div>
        </div>
      ) : modelsLoaded ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <WebcamCapture onCapture={handleCapture} maxImages={5} />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-blue-800 font-medium mb-2">Instructions</h3>
              <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                <li>Ensure the face is clearly visible and well-lit.</li>
                <li>Capture from different angles for better recognition.</li>
                <li>Remove glasses or face coverings if possible.</li>
                <li>This system will automatically analyze and store the facial data.</li>
              </ul>
            </div>
          </div>
          <CriminalForm onSubmit={handleSubmit} isSubmitting={isRegistering} />
        </div>
      ) : null}
    </div>
  );
};

export default RegisterCriminal;

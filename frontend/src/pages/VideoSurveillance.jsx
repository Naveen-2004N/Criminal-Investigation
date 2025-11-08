import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Video, Eye, Loader } from 'lucide-react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Link } from 'react-router-dom';
import { loadModels, createFaceMatcher } from '/src/utils/faceapi.js';
import { getCriminals } from '/src/services/criminalService.js';
import { useAuth } from '/src/context/AuthContext.jsx';
import { notifyDetection } from '/src/services/notificationService.js'; // Notification sender

const VideoSurveillance = ({ scheduleNotification }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [detections, setDetections] = useState([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [error, setError] = useState('');
  const [allCriminals, setAllCriminals] = useState([]);
  const detectionIntervalRef = useRef(null);
  const { userInfo } = useAuth();
  

  // ✅ Cooldown map for preventing repeated notifications
  const lastDetectionRef = useRef({});

  const alertSound = useMemo(() => new Audio('/alert.mp3'), []);

  useEffect(() => {
    if (userInfo) {
      const initialize = async () => {
        try {
          if (!modelsLoaded) {
            await loadModels();
            const matcher = await createFaceMatcher();
            setFaceMatcher(matcher);

            const criminalsData = await getCriminals();
            setAllCriminals(criminalsData);

            setModelsLoaded(true);
          }
        } catch (err) {
          setError('Could not load AI models or fetch data. Make sure model files exist and the server is running.');
          console.error(err);
        }
      };
      initialize();
    }
  }, [userInfo, modelsLoaded]);

  // ✅ Detection logic
  const handleVideoPlay = () => {
    if (isActive && faceMatcher) {
      detectionIntervalRef.current = setInterval(async () => {
        if (webcamRef.current && webcamRef.current.video && canvasRef.current) {
          const video = webcamRef.current.video;
          if (video.readyState < 3) return;

          const displaySize = { width: video.videoWidth, height: video.videoHeight };
          faceapi.matchDimensions(canvasRef.current, displaySize);

          const fullDesc = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptors();

          if (fullDesc.length === 0) return;

          const resizedDetections = faceapi.resizeResults(fullDesc, displaySize);
          const context = canvasRef.current.getContext('2d');
          context.clearRect(0, 0, displaySize.width, displaySize.height);

          const matches = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

          matches.forEach((bestMatch, i) => {
            const box = resizedDetections[i].detection.box;
            const text = bestMatch.toString();
            const drawBox = new faceapi.draw.DrawBox(box, {
              label: text,
              boxColor: bestMatch.label === 'unknown' ? 'red' : 'green',
            });
            drawBox.draw(canvasRef.current);

            if (bestMatch.label !== 'unknown') {
              const label = bestMatch.label;
              const now = Date.now();
              const cooldown = 10000; // 10 seconds cooldown

              if (!lastDetectionRef.current[label] || now - lastDetectionRef.current[label] > cooldown) {
                lastDetectionRef.current[label] = now; // record detection time

                const criminal = allCriminals.find(c => c.name === label);
                if (criminal) {
                  const newDetection = {
                    ...criminal,
                    timestamp: new Date().toLocaleTimeString(),
                    confidence: Math.round((1 - bestMatch.distance) * 100),
                  };
                  setDetections(prev => [newDetection, ...prev].slice(0, 10));

                  console.log(`Detected ${label}. Sending notification...`);

                  alertSound.play().catch(() => console.warn('Sound play failed (possibly user interaction required).'));

                  try {
                    notifyDetection(label, 'Live Surveillance');
                    scheduleNotification?.(label); // optional scheduled backend notification
                  } catch (error) {
                    console.error('Failed to send notification:', error);
                  }
                }
              }
            }
          });
        }
      }, 300);
    } else {
      clearInterval(detectionIntervalRef.current);
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  useEffect(() => {
    handleVideoPlay();
    return () => clearInterval(detectionIntervalRef.current);
  }, [isActive, faceMatcher, allCriminals]);

  useEffect(() => {
    if (!isActive) lastDetectionRef.current = {};
  }, [isActive]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <Video className="mr-3 text-blue-500" size={28} /> Live Surveillance
      </h1>

      {!modelsLoaded && !error ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
          <Loader className="animate-spin text-blue-500 mb-4" size={48} />
          <p className="text-gray-600 text-lg">Loading AI Models & Criminal Profiles...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Live Feed</h2>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`btn ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                >
                  {isActive ? 'Stop Surveillance' : 'Start Surveillance'}
                </button>
              </div>
              <div
                className="relative bg-gray-900 rounded-lg overflow-hidden w-full"
                style={{ paddingTop: '56.25%' }}
              >
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  className="absolute top-0 left-0 w-full h-full"
                  videoConstraints={{ width: 1280, height: 720 }}
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
              </div>
            </div>
          </div>

          <div className="card p-6 h-[600px] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-6">Detection Log</h2>
            {detections.length > 0 ? (
              <div className="space-y-4">
                {detections.map((d, i) => (
                  <div key={`${d._id}-${i}`} className="border p-4 rounded-lg hover:bg-gray-50">
                    <Link to={`/profile/${d._id}`}>
                      <div className="flex items-start space-x-3">
                        <img
                          src={d.images[0]}
                          alt={d.name}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-blue-600 hover:underline">{d.name}</h3>
                          <p className="text-sm text-gray-500">Time: {d.timestamp}</p>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {d.confidence}% match
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Eye size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500">
                  {isActive ? 'Scanning for threats...' : 'Start surveillance to view logs'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSurveillance;

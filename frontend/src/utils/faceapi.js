import * as faceapi from 'face-api.js';
import { getLabeledFaceDescriptors } from '/src/services/criminalService.js';

// Function to load the face-api models from the public folder
export const loadModels = async () => {
  const MODEL_URL = '/models';
  try {
    console.log('Starting to load face-api models...');
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    console.log('Face-api models loaded successfully.');
  } catch (error) {
    console.error('Error loading face-api models:', error);
    throw new Error("Failed to load AI models. Check console and ensure 'public/models' directory exists.");
  }
};

// Function to get full face descriptions (landmarks + descriptors) from an image blob
export const getFullFaceDescription = async (blob, inputSize = 512) => {
  const scoreThreshold = 0.5;
  const options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
  const img = await faceapi.fetchImage(blob);
  const detections = await faceapi.detectAllFaces(img, options).withFaceLandmarks().withFaceDescriptors();
  return detections;
};

// Function to create a face matcher from descriptors stored in the database
export const createFaceMatcher = async () => {
  const criminalDescriptors = await getLabeledFaceDescriptors();
  
  if (!criminalDescriptors || criminalDescriptors.length === 0) {
    console.warn("No criminals with face data found in the database to create a face matcher.");
    return null;
  }

  const labeledFaceDescriptors = criminalDescriptors.map(criminal => {
    const descriptors = criminal.faceDescriptors.map(fd => new Float32Array(fd));
    return new faceapi.LabeledFaceDescriptors(criminal.name, descriptors);
  });

  if (labeledFaceDescriptors.length === 0) {
    console.warn("Could not create any labeled descriptors from the database.");
    return null;
  }

  return new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
};

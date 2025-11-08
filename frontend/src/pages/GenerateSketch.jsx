import React, { useState } from 'react';
import { Brush, Image, AlertCircle, Loader2 } from 'lucide-react';
import { generateSketch } from '../services/aiService'; // We will create this service

const GenerateSketch = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) {
      setError('Please enter a description.');
      return;
    }
    setLoading(true);
    setError('');
    setGeneratedImage(null);
    try {
      // This will return an object like { image: 'data:image/png;base64,...' }
      const data = await generateSketch(prompt);
      setGeneratedImage(data.image);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate image. The AI model may be loading.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        <Brush className="inline-block mr-3 text-blue-500" />
        Generate Criminal Sketch
      </h1>
      <p className="text-gray-600">
        Describe the criminal (e.g., "A man in his 40s, with a long beard, a scar over his left eye, wearing a black beanie").
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter description here..."
        />
        
        <button
          type="submit"
          className="flex items-center justify-center px-6 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Brush className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Generating...' : 'Generate Sketch'}
        </button>
      </form>

      {error && (
        <div className="flex items-center p-4 text-red-700 bg-red-100 rounded-lg">
          <AlertCircle className="w-5 h-5 mr-3" />
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center">
          <Loader2 className="inline-block w-8 h-8 animate-spin text-blue-500" />
          <p className="mt-2 text-gray-600">Generating image... This may take a moment.</p>
        </div>
      )}

      {generatedImage && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
          <img
            src={generatedImage}
            alt="Generated sketch from prompt"
            className="w-full max-w-lg mx-auto rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default GenerateSketch;
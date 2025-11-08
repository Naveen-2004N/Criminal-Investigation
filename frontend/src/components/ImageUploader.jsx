import React, { useState, useRef } from 'react';
import { Upload, Image, X } from 'lucide-react';

const ImageUploader = ({ onImageSelect, onImageClear }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onImageSelect(file, e.target.result); // Pass both file and base64
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onImageClear();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
       <h3 className="text-lg font-medium text-gray-800 mb-2">
          <Image className="inline-block mr-2 text-blue-500" size={20} />
          Upload Image
        </h3>
      {!preview ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-700 mb-2">Drag and drop an image here</p>
          <p className="text-gray-500 text-sm mb-4">or</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary"
          >
            Browse Files
          </button>
        </div>
      ) : (
        <div className="relative">
          <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

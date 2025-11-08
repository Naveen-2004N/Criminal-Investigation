import React from 'react';
import { User, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const CriminalCard = ({ criminal, confidence }) => {
  const { _id, name, gender, crimesDone, dob, images } = criminal;
  
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  return (
    <div className="card hover:scale-105 transition-transform duration-300">
      <div className="relative">
        <img 
          src={images[0] || 'https://placehold.co/600x400?text=No+Image'} 
          alt={`Criminal: ${name}`} 
          className="w-full h-48 object-cover object-center"
        />
        {confidence && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {confidence}% Match
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          {dob && (
            <div className="flex items-center">
              <User size={16} className="mr-2 text-blue-500" />
              <span>{calculateAge(dob)} years, {gender}</span>
            </div>
          )}
          
          <div className="flex items-start">
            <FileText size={16} className="mr-2 text-blue-500 mt-0.5" />
            <span className="truncate">{crimesDone}</span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Link 
            to={`/profile/${_id}`} 
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            View Profile →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CriminalCard;

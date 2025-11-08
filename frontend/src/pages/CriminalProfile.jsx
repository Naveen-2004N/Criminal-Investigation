import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin, FileText, Clock, Users, Flag, Heart, Tag, AlertTriangle, Trash2 } from 'lucide-react';
import { useCriminals } from '../context/CriminalContext.jsx'; // Import context

const CriminalProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteCriminal, fetchCriminalById } = useCriminals(); 
  
  const [criminal, setCriminal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const fetchCriminal = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchCriminalById(id);
        
        if (data) {
          setCriminal(data);
        } else {
          setError('Criminal data not found.');
        }

      } catch (err) {
        setError('Criminal not found.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCriminal();
  }, [id, fetchCriminalById]); // This dependency is now stable

  const handleDelete = async () => {
    setDeleteError('');
    if (window.confirm('Are you sure you want to delete this criminal profile? This action cannot be undone.')) {
      try {
        await deleteCriminal(id);
        navigate('/criminals'); // Redirect to the criminals list
      } catch (err) {
        setDeleteError('Failed to delete profile. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading profile...</div>;
  }
  
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
  
  if (!criminal) {
    return null; // Page will be blank if no criminal, which is correct
  }

  const calculateAge = (dob) => {
    const ageDifMs = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800"><User className="inline-block mr-3 text-blue-500" />Criminal Profile</h1>
        <button
          onClick={handleDelete}
          className="flex items-center px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Delete Profile
        </button>
      </div>
      
      {deleteError && <div className="text-center text-red-500">{deleteError}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card">
            <img src={criminal.images[0]} alt={criminal.name} className="w-full h-80 object-cover object-center"/>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{criminal.name}</h2>
              <p className="text-gray-600 mb-6">{calculateAge(criminal.dob)} years, {criminal.gender}</p>
              <div className="space-y-4">
                  <div className="flex"><AlertTriangle className="text-blue-500 mt-1 mr-3 h-5 w-5"/><div><p className="text-sm text-gray-500">Identification</p><p>{criminal.identificationMark}</p></div></div>
                  <div className="flex"><FileText className="text-blue-500 mt-1 mr-3 h-5 w-5"/><div><p className="text-sm text-gray-500">Crimes</p><p>{criminal.crimesDone}</p></div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex"><Calendar className="text-blue-500 mt-1 mr-3"/><div><p className="text-sm text-gray-500">Date of Birth</p><p>{new Date(criminal.dob).toLocaleDateString()}</p></div></div>
              <div className="flex"><Heart className="text-blue-500 mt-1 mr-3"/><div><p className="text-sm text-gray-500">Blood Group</p><p>{criminal.bloodGroup}</p></div></div>
              <div className="flex"><Users className="text-blue-500 mt-1 mr-3"/><div><p className="text-sm text-gray-500">Father's Name</p><p>{criminal.fatherName}</p></div></div>
              <div className="flex"><Users className="text-blue-500 mt-1 mr-3"/><div><p className="text-sm text-gray-500">Mother's Name</p><p>{criminal.motherName}</p></div></div>
              <div className="flex"><Flag className="text-blue-500 mt-1 mr-3"/><div><p className="text-sm text-gray-500">Nationality</p><p>{criminal.nationality}</p></div></div>
              <div className="flex"><Tag className="text-blue-500 mt-1 mr-3"/><div><p className="text-sm text-gray-500">Religion</p><p>{criminal.religion}</p></div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriminalProfile;
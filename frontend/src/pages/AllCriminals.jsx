import React, { useState, useEffect } from 'react';
import { Users, Search } from 'lucide-react';
import CriminalCard from '../components/CriminalCard';
import { getCriminals } from '../services/criminalService';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const AllCriminals = () => {
  const [criminals, setCriminals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth(); // Get user info

  useEffect(() => {
    // Do not fetch until user info is available
    if (!userInfo) {
      setLoading(false);
      return;
    }

    const fetchAndFilterCriminals = async () => {
      try {
        setLoading(true);
        const data = await getCriminals(searchTerm);
        setCriminals(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch criminal data. You might be logged out.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Use a timeout to debounce the search input
    const searchTimeout = setTimeout(() => {
        fetchAndFilterCriminals();
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, userInfo]); // Add userInfo as a dependency

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Users className="mr-3 text-blue-500" size={28} /> All Registered Criminals
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, crime, nationality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input w-full md:w-80 pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading criminals...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : criminals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {criminals.map((criminal) => (
            <CriminalCard key={criminal._id} criminal={criminal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <h2 className="text-xl font-semibold">No Criminals Found</h2>
          <p>{searchTerm ? `Your search for "${searchTerm}" did not match any records.` : 'There are no criminals in the database.'}</p>
        </div>
      )}
    </div>
  );
};

export default AllCriminals;

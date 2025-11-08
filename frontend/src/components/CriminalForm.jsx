import React, { useState } from 'react';

const CriminalForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '', fatherName: '', motherName: '', gender: '', dob: '',
    bloodGroup: '', identificationMark: '', nationality: '',
    religion: '', crimesDone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Criminal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="form-label">Full Name <span className="text-red-500">*</span></label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="form-input" />
        </div>
        <div>
          <label htmlFor="gender" className="form-label">Gender <span className="text-red-500">*</span></label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className="form-input">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="fatherName" className="form-label">Father's Name <span className="text-red-500">*</span></label>
          <input type="text" id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleChange} required className="form-input" />
        </div>
        <div>
          <label htmlFor="motherName" className="form-label">Mother's Name <span className="text-red-500">*</span></label>
          <input type="text" id="motherName" name="motherName" value={formData.motherName} onChange={handleChange} required className="form-input" />
        </div>
        <div>
          <label htmlFor="dob" className="form-label">Date of Birth <span className="text-red-500">*</span></label>
          <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required className="form-input" />
        </div>
        <div>
          <label htmlFor="bloodGroup" className="form-label">Blood Group <span className="text-red-500">*</span></label>
           <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required className="form-input">
            <option value="">Select</option>
            <option value="A+">A+</option> <option value="A-">A-</option> <option value="B+">B+</option>
            <option value="B-">B-</option> <option value="AB+">AB+</option> <option value="AB-">AB-</option>
            <option value="O+">O+</option> <option value="O-">O-</option>
          </select>
        </div>
        <div>
          <label htmlFor="nationality" className="form-label">Nationality <span className="text-red-500">*</span></label>
          <input type="text" id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} required className="form-input" />
        </div>
        <div>
          <label htmlFor="religion" className="form-label">Religion <span className="text-red-500">*</span></label>
          <input type="text" id="religion" name="religion" value={formData.religion} onChange={handleChange} required className="form-input" />
        </div>
      </div>
      <div className="mt-6">
        <label htmlFor="identificationMark" className="form-label">Identification Mark <span className="text-red-500">*</span></label>
        <input type="text" id="identificationMark" name="identificationMark" value={formData.identificationMark} onChange={handleChange} required className="form-input" />
      </div>
      <div className="mt-6">
        <label htmlFor="crimesDone" className="form-label">Crimes <span className="text-red-500">*</span></label>
        <textarea id="crimesDone" name="crimesDone" value={formData.crimesDone} onChange={handleChange} required rows={3} className="form-input" placeholder="List crimes separated by commas" />
      </div>
      <div className="mt-8 text-right">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register Criminal'}
        </button>
      </div>
    </form>
  );
};

export default CriminalForm;

import mongoose from 'mongoose';

const criminalSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    bloodGroup: { type: String, required: true },
    identificationMark: { type: String, required: true },
    nationality: { type: String, required: true },
    religion: { type: String, required: true },
    crimesDone: { type: String, required: true },
    images: [{ type: String, required: true }],
    
    // Field to store face recognition data
    faceDescriptors: {
      type: [[Number]], // Array of arrays of numbers
      required: false, // Not required for seeded data
    },

    status: { type: String, default: 'Under Investigation' },
    riskLevel: { type: String, default: 'Low' },
  },
  {
    timestamps: true,
  }
);

criminalSchema.index({
  name: 'text',
  identificationMark: 'text',
  crimesDone: 'text',
  nationality: 'text'
});

const Criminal = mongoose.model('Criminal', criminalSchema);

export default Criminal;

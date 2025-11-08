import Criminal from '../models/criminalModel.js';

const registerCriminal = async (req, res) => {
  const {
    name,
    fatherName,
    motherName,
    gender,
    dob,
    bloodGroup,
    identificationMark,
    nationality,
    religion,
    crimesDone,
    images, // Expecting an array of base64 strings
    faceDescriptors, // Expecting an array of face descriptor arrays
  } = req.body;

  if (!images || images.length === 0) {
    return res.status(400).json({ message: 'At least one image is required' });
  }
  
  if (!faceDescriptors || faceDescriptors.length === 0) {
    return res.status(400).json({ message: 'Face descriptors could not be generated from the images.' });
  }

  try {
    const criminal = new Criminal({
      name,
      fatherName,
      motherName,
      gender,
      dob,
      bloodGroup,
      identificationMark,
      nationality,
      religion,
      crimesDone,
      images,
      faceDescriptors, // Save the generated descriptors
    });

    const createdCriminal = await criminal.save();
    res.status(201).json(createdCriminal);
  } catch (error) {
    res.status(400).json({ message: 'Invalid criminal data', error: error.message });
  }
};

const getCriminals = async (req, res) => {
  const { search } = req.query;

  try {
    let criminals;
    if (search) {
      criminals = await Criminal.find({ $text: { $search: search } }).sort({
        score: { $meta: 'textScore' },
      });
    } else {
      criminals = await Criminal.find({}).sort({ createdAt: -1 }).limit(20);
    }
    res.json(criminals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getCriminalById = async (req, res) => {
  try {
    const criminal = await Criminal.findById(req.params.id);
    if (criminal) {
      res.json(criminal);
    } else {
      res.status(404).json({ message: 'Criminal not found' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Criminal not found' });
  }
};

const getFaceDescriptors = async (req, res) => {
    try {
        const criminals = await Criminal.find({ 
            faceDescriptors: { $exists: true, $not: { $size: 0 } } 
        }).select('name faceDescriptors');

        res.json(criminals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteCriminal = async (req, res) => {
  try {
    const criminal = await Criminal.findById(req.params.id);
    if (criminal) {
      await criminal.deleteOne();
      res.json({ message: 'Criminal removed' });
    } else {
      res.status(404).json({ message: 'Criminal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { registerCriminal, getCriminals, getCriminalById, getFaceDescriptors, deleteCriminal };
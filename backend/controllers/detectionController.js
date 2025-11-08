import Criminal from '../models/criminalModel.js';

//          It can be kept for other purposes or removed.
const detectCriminal = async (req, res) => {
    res.status(400).json({ message: 'This endpoint is deprecated. Face detection is now performed on the client.' });
};

export { detectCriminal };

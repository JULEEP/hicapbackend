import dotenv from 'dotenv';
import College from '../Models/College.js';


dotenv.config();

export const createCollege = async (req, res) => {
  try {
    const { name, location, image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const college = new College({
      name,
      location,
      image // Save URL directly
    });

    await college.save();

    return res.status(201).json({
      message: 'College created successfully',
      college,
    });
  } catch (error) {
    console.error('Error creating college:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });
    res.status(200).json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSingleCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const college = await College.findById(id);

    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    res.status(200).json(college);
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

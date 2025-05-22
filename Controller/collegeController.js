import dotenv from 'dotenv';
import College from '../Models/College.js';
import Banner from '../Models/Banner.js';


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
    // 📦 Fetch all colleges, sorted by creation date (newest first)
    const colleges = await College.find().sort({ createdAt: -1 });

    // 🖼️ Fetch all banners
    const banners = await Banner.find().sort({ createdAt: -1 });

    // ✅ Send both in response
    res.status(200).json({
      message: 'Colleges and banners fetched successfully',
      colleges,
      banners
    });

  } catch (error) {
    console.error('Error fetching colleges and banners:', error);
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



export const createBanner = async (req, res) => {
  try {
    const { images } = req.body;

    // ✅ Check if images array is valid
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'At least one image URL is required' });
    }

    // 🔁 Optional: Validate that all items are strings (URLs)
    const invalidImages = images.filter(img => typeof img !== 'string');
    if (invalidImages.length > 0) {
      return res.status(400).json({ message: 'All images must be valid URLs in string format' });
    }

    // 📦 Create new banner
    const banner = new Banner({
      images // Store array of image URLs
    });

    await banner.save();

    // ✅ Response
    return res.status(201).json({
      message: 'Banner created successfully',
      banner,
    });

  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllBanners = async (req, res) => {
  try {
    // 📦 Fetch all banners from the database
    const banners = await Banner.find();

    // ✅ Response
    return res.status(200).json({
      message: 'Banners fetched successfully',
      banners,
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

import jwt from 'jsonwebtoken'; // For JWT token generation
import dotenv from 'dotenv';
import User from '../Models/User.js';
import multer from 'multer'; // Import multer for file handling
import path from 'path';  // To resolve file paths
import cloudinary from '../config/cloudinary.js';
import { fileURLToPath } from 'url';
import College from '../Models/College.js';
import Form from '../Models/Form.js';



dotenv.config();



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});




export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      aadhaarCardNumber,
      password,
      confirmPassword
    } = req.body;

    // Check required fields
    if (!name || !mobile || !aadhaarCardNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }, { aadhaarCardNumber }]
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const newUser = new User({
      name,
      email,
      mobile,
      aadhaarCardNumber,
      password,
      confirmPassword // ✅ Storing confirmPassword as per your request
    });

    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h'
    });

    // Response
    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        aadhaarCardNumber: newUser.aadhaarCardNumber,
        password: newUser.password,
        confirmPassword: newUser.confirmPassword,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    });

  } catch (error) {
    console.error('Error in registerUser:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



export const loginUser = async (req, res) => {
  const { mobile, password } = req.body;

  // 🔒 Validate input
  if (!mobile || !password) {
    return res.status(400).json({ error: 'Mobile number and password are required' });
  }

  // 📞 Check mobile format
  const mobilePattern = /^[0-9]{10}$/;
  if (!mobilePattern.test(mobile)) {
    return res.status(400).json({ error: 'Invalid mobile number format' });
  }

  try {
    // 🔍 Find user by mobile
    const user = await User.findOne({ mobile });

    // ❌ User not found
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }

    // ❌ Password mismatch (no bcrypt used)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    // ✅ Respond with user info
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email || null,
        mobile: user.mobile,
        aadhaarCardNumber: user.aadhaarCardNumber || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const logoutUser = async (req, res) => {
  try {
    // 🔓 Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.status(200).json({ message: 'Logout successful. Token cleared.' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};





// User Controller (GET User)
export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;  // Get the user ID from request params

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    return res.status(200).json({
      message: 'User details retrieved successfully!',
      id: user._id,               // Include the user ID in the response
      name: user.name,            // Include the name
      email: user.email,          // Include the email
      mobile: user.mobile,        // Include the mobile number
      aadhaarCardNumber: user.aadhaarCardNumber,  // Include the Aadhaar card number
      profileImage: user.profileImage || 'https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4406.jpg?w=2000', // Include profile image (or default if none)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};





// Get current directory for handling paths correctly in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage for profile images using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads', 'profiles')); // Folder where profile images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Use timestamp to avoid conflicts
  },
});

// Filter to ensure only image files can be uploaded
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Invalid file type. Only JPG, JPEG, and PNG files are allowed.'));
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

export const createProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Get the userId from request params

    // Check if the user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Check if a file is uploaded
    if (!req.files || !req.files.profileImage) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    // Get the uploaded file (profileImage)
    const profileImage = req.files.profileImage;

    // Upload the profile image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(profileImage.tempFilePath, {
      folder: 'poster', // Cloudinary folder where images will be stored
    });

    // Save the uploaded image URL to the user's profile
    existingUser.profileImage = uploadedImage.secure_url;

    // Save the updated user data to the database
    await existingUser.save();

    // Respond with the updated user profile
    return res.status(200).json({
      message: 'Profile image uploaded successfully!',
      user: {
        id: existingUser._id,
        profileImage: existingUser.profileImage,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
// Update Profile Image (with userId in params)
export const editProfileImage = async (req, res) => {
  try {
    const userId = req.params.id; // Get the userId from request params

    // Check if the user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Check if a new file is uploaded
    if (!req.files || !req.files.profileImage) {
      return res.status(400).json({ message: 'No new file uploaded!' });
    }

    const newProfileImage = req.files.profileImage;

    // OPTIONAL: Delete previous image from Cloudinary if you stored public_id
    // You can store public_id during upload for this purpose

    // Upload the new image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(newProfileImage.tempFilePath, {
      folder: 'poster',
    });

    // Update the profileImage field with new URL
    existingUser.profileImage = uploadedImage.secure_url;

    // Save updated user
    await existingUser.save();

    // Respond
    return res.status(200).json({
      message: 'Profile image updated successfully!',
      user: {
        id: existingUser._id,
        profileImage: existingUser.profileImage,
      },
    });

  } catch (error) {
    console.error('Error updating profile image:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Get Profile (with userId in params)
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;  // Get the user ID from request params

    // Find user by ID and populate the subscribedPlans
    const user = await User.findById(userId).populate('subscribedPlans.planId');  // Assuming `subscribedPlans` references `Plan` model

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Respond with user details along with subscribed plans and include dob and marriageAnniversaryDate
    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      profileImage: user.profileImage,
      dob: user.dob || null,  // Return dob or null if not present
      marriageAnniversaryDate: user.marriageAnniversaryDate || null,  // Return marriageAnniversaryDate or null if not present
      subscribedPlans: user.subscribedPlans,  // Include subscribedPlans in the response
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};



// Step 1: Verify mobile number exists
export const verifyMobile = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({ message: 'User with this mobile number does not exist' });
    }

    // Return userId so it can be passed to step 2
    return res.status(200).json({
      message: 'Mobile number verified. You can now reset your password.',
      userId: user._id
    });

  } catch (error) {
    console.error('Error in verifyMobile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};




// Step 2: Reset password using userId
export const resetPassword = async (req, res) => {
  try {
    const { userId, password, confirmPassword } = req.body;

    if (!userId || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    user.confirmPassword = confirmPassword;

    await user.save();

    return res.status(200).json({
      message: 'Password updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        aadhaarCardNumber: user.aadhaarCardNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



export const submitForm = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, mobile, email, aadhar, pan, upi, group, collegeId } = req.body;

    if (!name || !mobile || !email || !aadhar || !pan || !upi || !group || !collegeId) {
      return res.status(400).json({ message: 'All fields including collegeId are required' });
    }

    // Check if college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    // Create the form with student ID
    const form = new Form({
      name,
      mobile,
      email,
      aadhar,
      pan,
      upi,
      group,
      college: collegeId,
      student: userId   // ✅ storing userId in student field
    });

    await form.save();

    // Add form to user's forms array
    const user = await User.findById(userId);
    if (user) {
      user.forms.push(form._id);
      await user.save();
    }

    // Populate college details and student info
    const populatedForm = await Form.findById(form._id)
      .populate('college')
      .populate('student', 'username email'); // optional: populate student info

    return res.status(201).json({
      message: 'Form submitted successfully',
      form: populatedForm
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getSubmittedFormsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const submittedForms = await Form.find({
      student: userId,
      status: 'Submitted'
    })
      .populate('college')
      .populate('student', 'username email');

    return res.status(200).json({
      message: 'Submitted forms fetched successfully',
      forms: submittedForms
    });
  } catch (error) {
    console.error('Error fetching submitted forms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

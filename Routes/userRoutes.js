import express from 'express';
import { 
    registerUser,
     loginUser, 
     getUser, 
     createProfile, 
     editProfileImage, 
     getProfile,
     verifyMobile,
     resetPassword,
     submitForm,
     getSubmittedFormsByUser,
     logoutUser,
     submitContactUsForm,
     submitContactUsFormWithDescription,
     addCourse,
     getCourses,
     enrollInCourse,
     getEnrolledCourses,
     generatePasswordForAdmin,
    } from '../Controller/UserController.js'; // Import UserController
const router = express.Router();

// Registration Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);
router.post('/logout', logoutUser);
// Get user details (GET)
router.get('/get-user/:userId', getUser);  // Adding a middleware to verify JWT token

// Update user details (PUT)
// Create a new profile with Form Data (including profile image)
router.post('/create-profile/:id', createProfile);  // Profile creation with userId in params

// Edit the user profile by userId
router.put('/edit-profile/:id', editProfileImage);  // Profile editing by userId

// Get the user profile by userId
router.get('/get-profile/:id', getProfile);  // Get profile by userId
router.post('/verify', verifyMobile);  // Get profile by userId
router.post('/reset-password', resetPassword);  // Get profile by userId
router.post('/submitform/:userId', submitForm);  // Get profile by userId
router.get('/getsubmittedform/:userId', getSubmittedFormsByUser);  // Get profile by userId
router.post('/contact-us', submitContactUsForm);  // Get profile by userId
router.post('/contact', submitContactUsFormWithDescription);  // Get profile by userId
router.post('/add-courses', addCourse);
router.get('/allcourses', getCourses);
router.post('/enrollcourse', enrollInCourse);
router.get('/myenrolledcourses/:userId', getEnrolledCourses);  // Get profile by userId
router.post('/generatepassword/:userId', generatePasswordForAdmin);  // Get profile by userId




















export default router;

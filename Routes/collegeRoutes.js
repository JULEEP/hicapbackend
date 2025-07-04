import express from 'express';
import {
  createBanner,
  createCollege,
  getAllColleges,
  getAllQuestions,
  getSingleCollege,
  postQuestion
} from '../Controller/collegeController.js';

const router = express.Router()

router.post('/create-college', createCollege);
router.get('/getallcolleges', getAllColleges);
router.get('/getsinglecollege/:id', getSingleCollege);
router.post('/createbanner', createBanner);
router.post('/postqna', postQuestion);
router.get('/allqna', getAllQuestions);  // This is the new route


export default router;

import express from 'express';
import {
  createBanner,
  createCollege,
  getAllColleges,
  getSingleCollege
} from '../Controller/collegeController.js';

const router = express.Router()

router.post('/create-college', createCollege);
router.get('/getallcolleges', getAllColleges);
router.get('/getsinglecollege/:id', getSingleCollege);
router.post('/createbanner', createBanner);

export default router;

import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
  },
  image: {
    type: String, // Cloudinary secure URL
  },
}, { timestamps: true });

const College = mongoose.model('College', collegeSchema);
export default College;

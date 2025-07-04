import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { type: String, },
  duration: { type: String,},
  liveProjects: { type: Number, },
  rating: { type: Number, },
  description: { type: String, },
  image: { type: String, },
});

const Course = mongoose.model('Course', courseSchema);

export default Course;

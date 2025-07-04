import mongoose from 'mongoose';

const { Schema } = mongoose;

const EnrollmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  additionalMessage: {
    type: String,
    default: '',
  },
});

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

export default Enrollment;

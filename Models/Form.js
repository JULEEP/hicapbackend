import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  name: { type: String },
  mobile: { type: String },
  email: { type: String },
  aadhar: { type: String },
  pan: { type: String },
  upi: { type: String },
  group: { type: String },

  // Link to a college
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  },

  // Link to student (User model)
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Status: only 'Pending' or 'Submitted'
  status: {
    type: String,
    enum: ['Pending', 'Submitted'],
    default: 'Pending'
  },

  // Timestamp
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Define and export the model separately
const Form = mongoose.model('Form', formSchema);
export default Form;

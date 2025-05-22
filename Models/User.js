import mongoose from 'mongoose';

const { Schema } = mongoose;


// User Schema without required and trim
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // Removed 'required' and 'trim'
  },
  email: {
    type: String,
    lowercase: true,
  },
  mobile: {
    type: String,
  },
  otp: {
    type: String,
  },
  password: {
  type: String,
},
confirmPassword: {
  type: String,
},
aadhaarCardNumber: {
  type: String,
  unique: true
},
  forms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }],
}, {
  timestamps: true  // CreatedAt and UpdatedAt fields automatically
});

// Create model based on schema
const User = mongoose.model('User', userSchema);

export default User;

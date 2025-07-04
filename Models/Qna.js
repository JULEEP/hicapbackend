import mongoose from 'mongoose';

const qnaSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  answer: {
    type: String,
    default: null, // Initially answer is null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Qna = mongoose.model('Qna', qnaSchema);

export default Qna;

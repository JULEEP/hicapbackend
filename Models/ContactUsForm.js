import mongoose from 'mongoose';

const contactUsFormSchema = new mongoose.Schema(
  {
    fullName: { type: String,  },
    email: { type: String,  },
    mobile: { type: String,  },
    currentStatus: { type: String,  },
    description: { type: String,  }

  },
  { timestamps: true }
);

const ContactUsForm = mongoose.model('ContactUsForm', contactUsFormSchema);
export default ContactUsForm;

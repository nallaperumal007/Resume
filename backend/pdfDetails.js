const mongoose = require('mongoose');

// Define the schema
const pdfDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  skillSet: { type: String, required: true },
  remarks: { type: String, required: true },
  portfolio: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true },
  techStack: { type: String, required: true },
  resume: { type: String, required: true }  // Storing filename for the resume
});

// Create the model
const PdfDetails = mongoose.model('PdfDetails', pdfDetailsSchema);

module.exports = PdfDetails;

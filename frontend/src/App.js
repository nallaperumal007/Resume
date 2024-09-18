import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PdfComp from './PdfComp';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Import the custom CSS file

function App() {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    location: '',
    email: '',
    skillSet: '',
    remarks: '',
    portfolio: '',
    address: '',
    type: '',
    techStack: '',
    resume: null
  });
  const [allImage, setAllImage] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    try {
      const result = await axios.get('http://localhost:5000/get-files');
      setAllImage(result.data.data);
    } catch (error) {
      console.error('Error fetching files', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0]
    });
  };

  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      resume: null
    });
    document.querySelector('input[name="resume"]').value = '';
  };

  const validateForm = () => {
    const { name, mobileNumber, location, email, skillSet, remarks, portfolio, address, type, techStack, resume } = formData;
    if (!name || !mobileNumber || !location || !email || !skillSet || !remarks || !portfolio || !address || !type || !techStack || !resume) {
      toast.error('Please fill out all fields and upload a resume.');
      return false;
    }
    return true;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const result = await axios.post('http://localhost:5000/upload-files', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (result.data.status === 'ok') {
        toast.success('Uploaded Successfully!');
        getFiles();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error uploading file', error);
      toast.error('Error uploading file.');
    }
  };

  const handleInsertClick = () => {
    setShowForm(true);
    setShowTable(false);
    setSelectedPdf(null);
  };

  const handleTableClick = () => {
    setShowForm(false);
    setShowTable(true);
    setSelectedPdf(null);
  };

  const handleRowClick = (pdf) => {
    setSelectedPdf(pdf);
    setShowForm(false);
    setShowTable(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={handleInsertClick}>
          Insert
        </button>
        <button className="btn btn-secondary" onClick={handleTableClick}>
          Table Format
        </button>
      </div>

      {showForm && (
        <form className="form-container p-4 border rounded" onSubmit={submitForm}>
          <h4 className="mb-4 text-center">Submit Your Details</h4>
          <div className="form-group mb-3">
            <label htmlFor="name" className="custom-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control custom-input"
              id="name"
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="mobileNumber" className="custom-label">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              className="form-control custom-input"
              id="mobileNumber"
              placeholder="Enter your mobile number"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="location" className="custom-label">Location</label>
            <input
              type="text"
              name="location"
              className="form-control custom-input"
              id="location"
              placeholder="Enter your location"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email" className="custom-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control custom-input"
              id="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="skillSet" className="custom-label">Skill Set</label>
            <textarea
              name="skillSet"
              className="form-control custom-input"
              id="skillSet"
              placeholder="Enter your skill set"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="remarks" className="custom-label">Remarks</label>
            <textarea
              name="remarks"
              className="form-control custom-input"
              id="remarks"
              placeholder="Enter your remarks"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="portfolio" className="custom-label">Portfolio</label>
            <input
              type="text"
              name="portfolio"
              className="form-control custom-input"
              id="portfolio"
              placeholder="Enter your portfolio URL"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="address" className="custom-label">Address</label>
            <input
              type="text"
              name="address"
              className="form-control custom-input"
              id="address"
              placeholder="Enter your address"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="type" className="custom-label">Type</label>
            <select
              name="type"
              className="form-control custom-input"
              id="type"
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Type1">Type1</option>
              <option value="Type2">Type2</option>
            </select>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="techStack" className="custom-label">Tech Stack</label>
            <input
              type="text"
              name="techStack"
              className="form-control custom-input"
              id="techStack"
              placeholder="Enter your tech stack"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="resume" className="custom-label">Resume</label>
            <input
              type="file"
              name="resume"
              className="form-control custom-input"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
            />
            {formData.resume && (
              <button
                type="button"
                className="btn btn-danger mt-2"
                onClick={handleRemoveFile}
              >
                Remove File
              </button>
            )}
          </div>
          <button className="btn btn-primary w-100" type="submit">
            Submit
          </button>
        </form>
      )}

      {showTable && (
        <div className="mt-4">
          <h2 className="mb-4 text-center">Submitted Details</h2>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allImage.map((data) => (
                <tr key={data._id}>
                  <td>{data.name}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleRowClick(data)}
                    >
                      View
                    </button>
                    <a
                      href={`http://localhost:5000/files/${data.resume}`}
                      className="btn btn-secondary btn-sm"
                      download
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedPdf && (
        <div className="mt-4 card p-4">
          <h2 className="card-title">Details</h2>
          <h3 className="card-subtitle mb-3">Name: {selectedPdf.name}</h3>
          <p><strong>Mobile Number:</strong> {selectedPdf.mobileNumber}</p>
          <p><strong>Location:</strong> {selectedPdf.location}</p>
          <p><strong>Email:</strong> {selectedPdf.email}</p>
          <p><strong>Skill Set:</strong> {selectedPdf.skillSet}</p>
          <p><strong>Remarks:</strong> {selectedPdf.remarks}</p>
          <p><strong>Portfolio:</strong> {selectedPdf.portfolio}</p>
          <p><strong>Address:</strong> {selectedPdf.address}</p>
          <p><strong>Type:</strong> {selectedPdf.type}</p>
          <p><strong>Tech Stack:</strong> {selectedPdf.techStack}</p>
          <PdfComp pdfFile={`http://localhost:5000/files/${selectedPdf.resume}`} />
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default App;

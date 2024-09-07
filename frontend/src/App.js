import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PdfComp from './PdfComp';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

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
    resume: null // Changed to null for file upload
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
    document.querySelector('input[name="resume"]').value = ''; // Clear the file input field
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
      if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
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
    <div className="App container">
      <div className="button-container">
        <button className="btn btn-primary" onClick={handleInsertClick}>
          Insert
        </button>
        <button className="btn btn-primary" onClick={handleTableClick}>
          Table Format
        </button>
      </div>

      {showForm && (
        <form className="formStyle" onSubmit={submitForm}>
          <h4>Submit Your Details</h4>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Name"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mobileNumber"
            className="form-control"
            placeholder="Mobile Number"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            className="form-control"
            placeholder="Location"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <textarea
            name="skillSet"
            className="form-control"
            placeholder="Skill Set"
            onChange={handleChange}
            required
          />
          <textarea
            name="remarks"
            className="form-control"
            placeholder="Remarks"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="portfolio"
            className="form-control"
            placeholder="Portfolio"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            className="form-control"
            placeholder="Address"
            onChange={handleChange}
            required
          />
          <select
            name="type"
            className="form-control"
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="Type1">Type1</option>
            <option value="Type2">Type2</option>
          </select>
          <input
            type="text"
            name="techStack"
            className="form-control"
            placeholder="Tech Stack"
            onChange={handleChange}
            required
          />
          <div className="file-input-container">
            <input
              type="file"
              name="resume"
              className="form-control"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
            />
            {formData.resume && (
              <button
                type="button"
                className="delete-icon"
                onClick={handleRemoveFile}
              >
                &times;
              </button>
            )}
          </div>
          <button className="btn btn-primary mt-2" type="submit">
            Submit
          </button>
        </form>
      )}

      {showTable && (
        <div className="table-container">
          <h2>Submitted Details</h2>
          <table className="pdf-table">
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
                      className="btn btn-primary mr-2"
                      onClick={() => handleRowClick(data)}
                    >
                      View
                    </button>
                    <a
                      href={`http://localhost:5000/files/${data.resume}`}
                      className="btn btn-secondary"
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
        <div className="card">
          <h2>Details</h2>
          <h3>Name: {selectedPdf.name}</h3>
          <p>Mobile Number: {selectedPdf.mobileNumber}</p>
          <p>Location: {selectedPdf.location}</p>
          <p>Email: {selectedPdf.email}</p>
          <p>Skill Set: {selectedPdf.skillSet}</p>
          <p>Remarks: {selectedPdf.remarks}</p>
          <p>Portfolio: {selectedPdf.portfolio}</p>
          <p>Address: {selectedPdf.address}</p>
          <p>Type: {selectedPdf.type}</p>
          <p>Tech Stack: {selectedPdf.techStack}</p>
          <PdfComp pdfFile={`http://localhost:5000/files/${selectedPdf.resume}`} />
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default App;

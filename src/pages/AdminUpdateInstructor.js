import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminUpdateInstructor = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const id = location?.state?.instructorId
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
    fiscalCode: '',
    brevetNumber: '',
    qualifications: [{ name: '', expirationDate: '' }],
    piva: '',
    address: '',
    city: '',
    region: '',
    email: '',
    phone: '',
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  console.log('formData: ', formData);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    // Fetch existing instructor details
    const fetchInstructorDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/instructors/${id}`,{headers: { 'x-auth-token': `${localStorage.getItem('token')}` }});
        setFormData(res.data); // Assume the API returns instructor details in the same structure
      } catch (err) {
        console.error(err);
        setMessage('Error fetching instructor details.');
      }
    };

    fetchInstructorDetails();
  }, [id]);

  const handleChange = (e, index, field) => {
    if (field === 'qualifications') {
      const newQualifications = [...formData.qualifications];
      newQualifications[index][e.target.name] = e.target.value;
      setFormData({ ...formData, qualifications: newQualifications });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleQualificationChange = (index, e) => {
    const newQualifications = [...formData.qualifications];
    newQualifications[index][e.target.name] = e.target.value;
    setFormData({ ...formData, qualifications: newQualifications });
  };

  const handleAddQualification = () => {
    setFormData({
      ...formData,
      qualifications: [
        ...formData.qualifications,
        { name: '', expirationDate: '' },
      ],
    });
  };

  const handleRemoveQualification = (index) => {
    const newQualifications = formData.qualifications.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, qualifications: newQualifications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/instructors/update/${id}`, // Use appropriate update endpoint
        formData,
        {headers: { 'x-auth-token': `${localStorage.getItem('token')}` }}
      );
      alert('Instructor update successfully')
      setShowModal(false)

      // Redirect or perform any other action on success
    } catch (err) {
      console.error(err.response.data);
      alert('Error updating instructor. Please try again.');
    }
  };

  return (
    <div className='container mt-5'>
      <h2 className='mb-4'>Update Instructor</h2>
      {showModal && (
        <div className='modal modal-xl show d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Instructor Registered</h5>
                <button
                  type='button'
                  className='close'
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <div className='table-responsive'>
                  <p className='text-center'>Are you sure Want to update</p>
                  <div className='d-flex align-items-center justify-content-center gap-4'>
                    <button
                      onClick={handleSubmit}
                      className='btn btn-primary btn-sm'
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <form >
        <div className='row'>
          <div className='col-md-6 mb-3'>
            <label htmlFor='firstName' className='form-label'>
              First Name
            </label>
            <input
              type='text'
              className='form-control'
              id='firstName'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              placeholder='First Name'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='lastName' className='form-label'>
              Last Name
            </label>
            <input
              type='text'
              className='form-control'
              id='lastName'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              placeholder='Last Name'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='fiscalCode' className='form-label'>
              Fiscal Code
            </label>
            <input
              type='text'
              className='form-control'
              id='fiscalCode'
              name='fiscalCode'
              value={formData.fiscalCode}
              onChange={handleChange}
              placeholder='Fiscal Code'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='brevetNumber' className='form-label'>
              Brevet Number
            </label>
            <input
              type='text'
              className='form-control'
              id='brevetNumber'
              name='brevetNumber'
              value={formData.brevetNumber}
              onChange={handleChange}
              placeholder='Brevet Number'
              required
            />
          </div>

          {/* Qualification Fields */}
          {formData?.qualifications?.map((qualification, index) => (
            <div key={index} className='col-md-12 mb-3'>
              <div className='row'>
                <div className='col-md-5'>
                  <label
                    htmlFor={`qualification-name-${index}`}
                    className='form-label'
                  >
                    Qualification
                  </label>
                  <select
                    className='form-select'
                    id={`qualification-name-${index}`}
                    name='name'
                    value={qualification.name}
                    defaultValue={qualification.name}
                    onChange={(e) => handleQualificationChange(index, e)}
                  >
                    <option value={qualification.name}>{qualification.name}</option>
                    <option value='blsk'>BLSK</option>
                    <option value='bls'>BLS</option>
                    <option value='blsd'>BLSD</option>
                  </select>
                </div>
                <div className='col-md-5'>
                  <label
                    htmlFor={`expirationDate-${index}`}
                    className='form-label'
                  >
                    Expiration Date
                  </label>
                  <input
                    className='form-control'
                    id={`expirationDate-${index}`}
                    name='expirationDate'
                    value={qualification?.expirationDate}
                    onChange={(e) => handleQualificationChange(index, e)}
                    required
                  />
                </div>
                <div className='col-md-2 d-flex align-items-end'>
                  <button
                    type='button'
                    className='btn btn-danger'
                    onClick={() => handleRemoveQualification(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className='col-md-12 mb-3 text-end'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={handleAddQualification}
            >
              Add Qualification
            </button>
          </div>

          {/* Other fields */}
          <div className='col-md-6 mb-3'>
            <label htmlFor='piva' className='form-label'>
              PIVA
            </label>
            <input
              type='text'
              className='form-control'
              id='piva'
              name='piva'
              value={formData.piva}
              onChange={handleChange}
              placeholder='PIVA'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='address' className='form-label'>
              Address
            </label>
            <input
              type='text'
              className='form-control'
              id='address'
              name='address'
              value={formData.address}
              onChange={handleChange}
              placeholder='Address'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='city' className='form-label'>
              City
            </label>
            <input
              type='text'
              className='form-control'
              id='city'
              name='city'
              value={formData.city}
              onChange={handleChange}
              placeholder='City'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='region' className='form-label'>
              Region
            </label>
            <input
              type='text'
              className='form-control'
              id='region'
              name='region'
              value={formData.region}
              onChange={handleChange}
              placeholder='Region'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Email'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='phone' className='form-label'>
              Phone
            </label>
            <input
              type='tel'
              className='form-control'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              placeholder='Phone'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='username' className='form-label'>
              Username
            </label>
            <input
              type='text'
              className='form-control'
              id='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='Username'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Password'
            />
          </div>
        </div>

        <button type='button' onClick={()=>setShowModal(true)} className='btn btn-primary'>
          Update Instructor
        </button>
        <button type='button' onClick={()=>navigate('/admin-dashboard')} className='btn btn-info'>
          Back
        </button>

      </form>
    </div>
  );
};

export default AdminUpdateInstructor;

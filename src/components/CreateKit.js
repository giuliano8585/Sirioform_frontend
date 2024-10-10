import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateKit = () => {
  const [kitData, setKitData] = useState({
    code: '',
    type: '',
    isRefreshKit:false,
    description: '',
    cost1: '',
    cost2: '',
    cost3: '',
    profileImage: null,
  });
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setKitData({ ...kitData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setKitData({ ...kitData, profileImage: e.target.files[0] });
  };

  const handleRadioChange = (e) => {
    setKitData({ ...kitData, isRefreshKit: e.target.value === 'true' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('code', kitData.code);
    formData.append('type', kitData.type);
    formData.append('isRefreshKit', kitData.isRefreshKit);
    formData.append('description', kitData.description);
    formData.append('cost1', kitData.cost1);
    formData.append('cost2', kitData.cost2);
    formData.append('cost3', kitData.cost3);

    if (kitData.profileImage) {
      formData.append('profileImage', kitData.profileImage);
    }

    try {
      await axios.post('http://localhost:5000/api/kits/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      alert('Kit creato con successo!');
      setShowApproveConfirmModal(false);
      navigate('/admin-dashboard');
    } catch (err) {
      console.error(err);
      alert('Errore nella creazione del kit.');
      setShowApproveConfirmModal(false);
    }
  };

  // Navigate back
  const goBack = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className='container mt-5'>
      <h1 className='mb-4'>Crea Kit</h1>
      <form encType='multipart/form-data'>
      <div className='form-group mb-3 d-flex gap-4 align-items-center'>
          <label>Is Refresh Kit?</label>
          <div>
            <input
              type='radio'
              id='refreshKitFalse'
              name='isRefreshKit'
              value='false'
              checked={kitData.isRefreshKit === false}
              onChange={handleRadioChange}
            />
            <label htmlFor='refreshKitFalse'>No</label>
          </div>
          <div>
            <input
              type='radio'
              id='refreshKitTrue'
              name='isRefreshKit'
              value='true'
              checked={kitData.isRefreshKit === true}
              onChange={handleRadioChange}
            />
            <label htmlFor='refreshKitTrue'>Yes</label>
          </div>
        </div>
        <div className='form-group mb-3'>
          <label htmlFor='code'>Codice Kit</label>
          <input
            id='code'
            name='code'
            value={kitData.code}
            onChange={handleChange}
            className='form-control'
            placeholder='Codice Kit'
            required
          />
        </div>
        <div className='form-group mb-3'>
          <label htmlFor='type'>Tipologia</label>
          <input
            id='type'
            name='type'
            value={kitData.type}
            onChange={handleChange}
            className='form-control'
            placeholder='Tipologia'
            required
          />
        </div>
        <div className='form-group mb-3'>
          <label htmlFor='description'>Descrizione</label>
          <input
            id='description'
            name='description'
            value={kitData.description}
            onChange={handleChange}
            className='form-control'
            placeholder='Descrizione'
            required
          />
        </div>
        <div className='form-group mb-3'>
          <label htmlFor='cost1'>Costo 1</label>
          <input
            id='cost1'
            name='cost1'
            value={kitData.cost1}
            onChange={handleChange}
            className='form-control'
            placeholder='Costo 1'
            required
          />
        </div>
        <div className='form-group mb-3'>
          <label htmlFor='cost2'>Costo 2</label>
          <input
            id='cost2'
            name='cost2'
            value={kitData.cost2}
            onChange={handleChange}
            className='form-control'
            placeholder='Costo 2'
            required
          />
        </div>
        <div className='form-group mb-3'>
          <label htmlFor='cost3'>Costo 3</label>
          <input
            id='cost3'
            name='cost3'
            value={kitData.cost3}
            onChange={handleChange}
            className='form-control'
            placeholder='Costo 3'
            required
          />
        </div>
        <div className='form-group mb-3'>
          <label className='form-label' htmlFor='customFile'>
            Upload Profile Image
          </label>
          <input
            type='file'
            className='form-control'
            id='customFile'
            onChange={handleFileChange}
            accept='image/*'
          />
        </div>
        <button
          type='button'
          onClick={() => setShowApproveConfirmModal(true)}
          className='btn btn-primary me-2'
        >
          Crea
        </button>
        <button type='button' className='btn btn-secondary' onClick={goBack}>
          Indietro
        </button>
      </form>
      {showApproveConfirmModal && (
        <div className='modal modal-xl show d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Confirm</h5>
                <button
                  type='button'
                  className='close'
                  onClick={() => setShowApproveConfirmModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <div className='table-responsive'>
                  <p className='text-center'>
                    are you sure want to Approve center
                  </p>
                  <div className='d-flex align-items-center justify-content-center gap-4'>
                    <button
                      onClick={() => setShowApproveConfirmModal(false)}
                      className='btn btn-info btn-sm'
                    >
                      No
                    </button>
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
    </div>
  );
};

export default CreateKit;

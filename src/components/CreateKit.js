import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateKit = () => {
  const [kitData, setKitData] = useState({
    code: '',
    type: '',
    description: '',
    cost1: '',
    cost2: '',
    cost3: '',
    profileImage: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setKitData({ ...kitData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setKitData({ ...kitData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('code', kitData.code);
    formData.append('type', kitData.type);
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
        },
      });
      alert('Kit creato con successo!');
      navigate('/admin-dashboard');
    } catch (err) {
      console.error(err);
      alert('Errore nella creazione del kit.');
    }
  };

  // Navigate back
  const goBack = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className='container mt-5'>
      <h1 className='mb-4'>Crea Kit</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            accept="image/*" 
          />
        </div>
        <button type='submit' className='btn btn-primary me-2'>
          Crea
        </button>
        <button type='button' className='btn btn-secondary' onClick={goBack}>
          Indietro
        </button>
      </form>
    </div>
  );
};

export default CreateKit;

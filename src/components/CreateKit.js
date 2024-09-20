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
    cost3: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setKitData({ ...kitData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/kits/create', kitData);
      alert('Kit creato con successo!');
      navigate('/admin-dashboard');
    } catch (err) {
      console.error(err);
      alert('Errore nella creazione del kit.');
    }
  };

  const goBack = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Crea Kit</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="code">Codice Kit</label>
          <input
            id="code"
            name="code"
            value={kitData.code}
            onChange={handleChange}
            className="form-control"
            placeholder="Codice Kit"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="type">Tipologia</label>
          <input
            id="type"
            name="type"
            value={kitData.type}
            onChange={handleChange}
            className="form-control"
            placeholder="Tipologia"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="description">Descrizione</label>
          <input
            id="description"
            name="description"
            value={kitData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Descrizione"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="cost1">Costo 1</label>
          <input
            id="cost1"
            name="cost1"
            value={kitData.cost1}
            onChange={handleChange}
            className="form-control"
            placeholder="Costo 1"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="cost2">Costo 2</label>
          <input
            id="cost2"
            name="cost2"
            value={kitData.cost2}
            onChange={handleChange}
            className="form-control"
            placeholder="Costo 2"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="cost3">Costo 3</label>
          <input
            id="cost3"
            name="cost3"
            value={kitData.cost3}
            onChange={handleChange}
            className="form-control"
            placeholder="Costo 3"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">Crea</button>
        <button type="button" className="btn btn-secondary" onClick={goBack}>Indietro</button>
      </form>
    </div>
  );
};

export default CreateKit;



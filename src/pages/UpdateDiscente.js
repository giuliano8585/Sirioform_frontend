import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function UpdateDiscente() {
  const loaction = useLocation();
  const id = loaction?.state?.id;
  const [discente, setDiscente] = useState({
    nome: '',
    cognome: '',
    codiceFiscale: '',
    indirizzo: '',
    città: '',
    regione: '',
    email: '',
    telefono: '',
    patentNumber: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscente = async () => {
      try {
        const res = await axios.get(
          `http://172.232.209.245/api/discenti/${id}`,
          { headers: { 'x-auth-token': `${localStorage.getItem('token')}` } }
        );
        setDiscente(res?.data);
      } catch (err) {
        console.error(err);
        alert('Errore durante il caricamento del discente');
      }
    };
    fetchDiscente();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiscente({ ...discente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://172.232.209.245/api/discenti/${id}`, discente, {
        headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
      });
      alert('Discente aggiornato correttamente!');
      navigate('/admin-dashboard');
    } catch (err) {
      console.error(err);
      alert("Errore durante l'aggiornamento del discente");
    }
  };

  return (
    <div className='container'>
      <h2>Aggiorna Discente</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='form-label'>Nome:</label>
          <input
            type='text'
            name='nome'
            className='form-control'
            value={discente?.nome}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Cognome:</label>
          <input
            type='text'
            name='cognome'
            className='form-control'
            value={discente?.cognome}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Codice Fiscale:</label>
          <input
            type='text'
            name='codiceFiscale'
            className='form-control'
            value={discente?.codiceFiscale}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Indirizzo:</label>
          <input
            type='text'
            name='indirizzo'
            className='form-control'
            value={discente?.indirizzo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Città:</label>
          <input
            type='text'
            name='città'
            className='form-control'
            value={discente?.città}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Regione:</label>
          <input
            type='text'
            name='regione'
            className='form-control'
            value={discente?.regione}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Email:</label>
          <input
            type='email'
            name='email'
            className='form-control'
            value={discente?.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Telefono:</label>
          <input
            type='text'
            name='telefono'
            className='form-control'
            value={discente?.telefono}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Patent Number (optional):</label>
          <input
            type='text'
            name='patentNumber'
            className='form-control'
            value={discente?.patentNumber}
            onChange={handleInputChange}
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Aggiorna
        </button>
        <button
          type='button'
          className='btn btn-secondary ms-2'
          onClick={() => navigate('/admin-dashboard')}
        >
          Torna alla Dashboard
        </button>
      </form>
    </div>
  );
}

export default UpdateDiscente;

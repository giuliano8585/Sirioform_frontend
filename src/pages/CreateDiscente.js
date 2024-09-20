import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateDiscente() {
  const [discente, setDiscente] = useState({
    nome: '',
    cognome: '',
    codiceFiscale: '',
    indirizzo: '',
    città: '',
    regione: '',
    email: '',
    telefono: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiscente({ ...discente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/discenti',
        discente,
        {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        }
      );
      alert('Discente aggiunto correttamente!');
      setDiscente({
        nome: '',
        cognome: '',
        codiceFiscale: '',
        indirizzo: '',
        città: '',
        regione: '',
        email: '',
        telefono: '',
      });
    } catch (err) {
      console.error(err);
      alert('Errore durante l\'aggiunta del discente');
    }
  };

  return (
    <div className="container">
      <h2>Gestione Discente</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome:</label>
          <input
            type="text"
            name="nome"
            className="form-control"
            value={discente.nome}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cognome:</label>
          <input
            type="text"
            name="cognome"
            className="form-control"
            value={discente.cognome}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Codice Fiscale:</label>
          <input
            type="text"
            name="codiceFiscale"
            className="form-control"
            value={discente.codiceFiscale}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Indirizzo:</label>
          <input
            type="text"
            name="indirizzo"
            className="form-control"
            value={discente.indirizzo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Città:</label>
          <input
            type="text"
            name="città"
            className="form-control"
            value={discente.città}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Regione:</label>
          <input
            type="text"
            name="regione"
            className="form-control"
            value={discente.regione}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={discente.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Telefono:</label>
          <input
            type="text"
            name="telefono"
            className="form-control"
            value={discente.telefono}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Aggiungi</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>
          Torna alla Dashboard
        </button>
      </form>
    </div>
  );
}

export default CreateDiscente;

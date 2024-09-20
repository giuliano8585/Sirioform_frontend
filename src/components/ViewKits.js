import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewKits.css'; // Assicurati di avere un file CSS per eventuali stili personalizzati

const ViewKits = () => {
  const [kits, setKits] = useState([]);

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/kits', {
          headers: {
            'x-auth-token': token
          }
        });
        setKits(res.data);
      } catch (err) {
        console.error('Errore nel recupero dei Kit', err);
      }
    };

    fetchKits();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Visualizza Kit</h2>
      <div className="row">
        {kits.map(kit => (
          <div key={kit._id} className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Codice: {kit.code}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Nome: {kit.type}</h6>
                <p className="card-text">Descrizione: {kit.description}</p>
                <p className="card-text">Prezzo 1: {kit.cost1}€</p>
                <p className="card-text">Prezzo 2: {kit.cost2}€</p>
                <p className="card-text">Prezzo 3: {kit.cost3}€</p>
                <button className="btn btn-primary">Compra</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewKits;

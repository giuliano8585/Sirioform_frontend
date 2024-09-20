import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewKits = () => {
  const [kits, setKits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/kits/all');
        setKits(res.data);
      } catch (err) {
        console.error(err);
        alert('Errore nel recupero dei kit.');
      }
    };

    fetchKits();
  }, []);

  const goBack = () => {
    navigate(-1); // Torna indietro alla dashboard precedente
  };

  return (
    <div>
      <h1>Visualizza Kit</h1>
      <ul>
        {kits.map((kit) => (
          <li key={kit._id}>
            {kit.code} - {kit.type} - {kit.description} - {kit.cost1} - {kit.cost2} - {kit.cost3}
          </li>
        ))}
      </ul>
      <button onClick={goBack}>Indietro</button>
    </div>
  );
};

export default ViewKits;

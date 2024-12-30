import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Store() {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const [prodotti, setProdotti] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera i prodotti acquistati dall'utente per popolare lo store
    const fetchProdottiAcquistati = async () => {
      try {
        const res = await axios.get(
          'http://172.232.209.245/api/orders/acquistati',
          {
            headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
          }
        );
        setProdotti(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProdottiAcquistati();
  }, []);

  const handleViewDetails = (productId, data) => {
    navigate(`/store/${productId}`, { state: { data: data } });
  };

  return (
    <div className='container mt-4'>
      <h2>Il mio Store</h2>
      {prodotti.length === 0 ? (
        <p>Non hai ancora acquistato alcun kit.</p>
      ) : (
        <table className='table'>
          <thead>
            <tr>
              <th>Prodotto</th>
              <th>Total Quantità</th>
              <th>Remaining Quantità</th>
              <th>used Quantità</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {prodotti.map((prodotto) => (
              <tr key={prodotto._id}>
                <td>{prodotto.title}</td>
                <td>{prodotto.totalQuantity}</td>
                <td>{prodotto.quantity}</td>
                <td>
                  {Number(prodotto.totalQuantity) - Number(prodotto.quantity)}
                </td>
                <td>
                  <button
                    className='btn btn-info'
                    onClick={() => handleViewDetails(prodotto._id, prodotto)}
                  >
                    Dettagli
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        className='btn btn-secondary mt-3'
        onClick={() =>
          navigate(
            decodedToken.user.role == 'admin'
              ? '/admin-dashboard'
              : decodedToken.user.role == 'center'
              ? '/center-dashboard'
              : '/instructor-dashboard'
          )
        }
      >
        Torna alla Dashboard
      </button>
    </div>
  );
}

export default Store;

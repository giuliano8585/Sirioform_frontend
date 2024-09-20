import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function StoreDetails() {
  const { productId } = useParams();
  const location = useLocation()
  const data = location?.state?.data
  console.log('data: ', data);
  const [orderItems, setOrderItems] = useState([]);
  console.log('orderItems: ', orderItems);
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Recupera i dettagli degli ordini per il prodotto selezionato
  //   const fetchOrderDetails = async () => {
  //     try {
  //       const res = await axios.get('http://localhost:5000/api/orders/acquistati', {
  //         headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
  //       });
  //       // Trova il prodotto con l'ID selezionato
  //       const prodottoDettagli = res.data.find(prod => prod._id === productId);
  //       if (prodottoDettagli && prodottoDettagli.orderItems) {
  //         setOrderItems(prodottoDettagli.orderItems);
  //       } else {
  //         setOrderItems([]);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchOrderDetails();
  // }, [productId]);

  return (
    <div className="container mt-4">
      <h2>Dettagli Prodotto</h2>
      {data && data?.length === 0 ? (
        <p>Nessun dettaglio disponibile per questo prodotto.</p>
      ) : (
        <ul className="list-group">
          {data?.progressiveNumbers?.map((item, index) => (
            <li key={index} className="list-group-item">
              Codici: {item ? item : 'Nessun codice disponibile'}
            </li>
          ))}
        </ul>
      )}
      <button className="btn btn-secondary mt-3" onClick={() => navigate('/store')}>
        Torna allo Store
      </button>
    </div>
  );
}

export default StoreDetails;

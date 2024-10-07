import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminAllDiscente() {
  const [discenti, setDiscenti] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscenti = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/discenti/all', {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        });
        setDiscenti(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDiscenti();
  }, []);

  return (
    <div className='container mt-4'>
      <h2>Lista Discenti</h2>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cognome</th>
            <th>created By</th>
            <th>Codice Fiscale</th>
            <th>Indirizzo</th>
            <th>Città</th>
            <th>Regione</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Num. Brevetto</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {discenti?.length > 0 ? (
            discenti?.map((discente) => (
              <tr key={discente._id}>
                <td>{discente.nome}</td>
                <td>{discente.cognome}</td>
                <td>
                  {discente?.userId?.role == 'center'
                    ? discente?.userId?.name
                    : discente?.userId?.firstName +
                      ' ' +
                      discente?.userId?.lastName}
                </td>
                <td>{discente.codiceFiscale}</td>
                <td>{discente.indirizzo}</td>
                <td>{discente.città}</td>
                <td>{discente.regione}</td>
                <td>{discente.email}</td>
                <td>{discente.telefono}</td>
                <td>{discente.patentNumber}</td>
                <td>
                  <button
                    className='btn btn-primary mt-4'
                    onClick={() =>
                      navigate('/update-discente', {
                        state: { id: discente?._id },
                      })
                    }
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='8' className='text-muted'>
                Nessun discente trovato.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Bottone per tornare alla dashboard */}
      <button className='btn btn-secondary mt-4' onClick={() => navigate(-1)}>
        Torna alla Dashboard
      </button>
    </div>
  );
}

export default AdminAllDiscente;

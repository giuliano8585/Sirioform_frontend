import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

function CreateCorso() {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tipologiaProdotti, setTipologiaProdotti] = useState([]); // Per il menu a tendina
  const [giornate, setGiornate] = useState([
    { dataInizio: '', dataFine: '', oraInizio: '', oraFine: '' },
  ]);

  const [corso, setCorso] = useState({
    tipologia: '',
    città: '',
    via: '',
    numeroDiscenti: '',
    istruttori: [],
    direttoriCorso: [],
  });

  const [availableKits, setAvailableKits] = useState(0); // Numero massimo di kit disponibili

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          'http://localhost:5000/api/auth/centers/me',
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
        setData(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.error || 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Recupera i prodotti acquistati dall'utente per popolare il menu a tendina
    const fetchProdottiAcquistati = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/orders/acquistati',
          {
            headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
          }
        );
        setTipologiaProdotti(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProdottiAcquistati();
  }, []);

  const handleIstruttoreChange = (e) => {
    const selectedIstruttore = e.target.value;
    setCorso({
      ...corso,
      istruttori: [...corso.istruttori, selectedIstruttore],
    });
  };

  const removeIstruttore = (id) => {
    setCorso({
      ...corso,
      istruttori: corso.istruttori.filter((istruttore) => istruttore !== id),
    });
  };
  const removeDirecttore = (id) => {
    setCorso({
      ...corso,
      direttoriCorso: corso.direttoriCorso.filter(
        (direttori) => direttori !== id
      ),
    });
  };

  const handleDirettoreChange = (e) => {
    const selectedDirettore = e.target.value;
    setCorso({
      ...corso,
      direttoriCorso: [...corso.direttoriCorso, selectedDirettore],
    });
  };

  const handleTipologiaChange = (e) => {
    const selectedProduct = tipologiaProdotti.find(
      (prod) => prod._id === e.target.value
    );
    setAvailableKits(selectedProduct ? selectedProduct.quantity : 0); // Aggiorna il numero di kit disponibili
    setCorso({ ...corso, tipologia: e.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCorso({ ...corso, [name]: value });
  };

  const handleGiornataChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGiornate = [...giornate];
    updatedGiornate[index][name] = value;
    setGiornate(updatedGiornate);
  };

  const addGiornata = () => {
    const lastGiornata = giornate[giornate.length - 1]; // Get the last giornata added
    if (lastGiornata && lastGiornata.dataFine === '') {
      alert(
        'Errore: Completa i campi della giornata precedente prima di aggiungerne una nuova.'
      );
      return;
    }

    // Add a new giornata only if previous fields are complete
    setGiornate([
      ...giornate,
      { dataInizio: '', dataFine: '', oraInizio: '', oraFine: '' },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Controlla se il numero di discenti supera il numero di kit disponibili
    if (parseInt(corso.numeroDiscenti, 10) > availableKits) {
      alert(
        `Non puoi inserire più di ${availableKits} discenti per il corso ${corso.tipologia}.`
      );
      return;
    }

    for (let i = 0; i < giornate.length; i++) {
      const { dataInizio, dataFine, oraInizio, oraFine } = giornate[i];

      // Date validation
      if (new Date(dataInizio) > new Date(dataFine)) {
        alert(
          `Errore: la data di inizio non può essere successiva alla data di fine nella giornata ${
            i + 1
          }.`
        );
        return;
      }

      // Time validation
      if (oraInizio >= oraFine) {
        alert(
          `Errore: L'ora di inizio non può essere uguale o successiva all'ora di fine nella giornata ${
            i + 1
          }.`
        );
        return;
      }

      // Ensure that the start date of the next section is after the end date of the previous section
      if (i > 0 && new Date(dataInizio) <= new Date(giornate[i - 1].dataFine)) {
        alert(
          `Errore: La data di inizio della giornata ${
            i + 1
          } deve essere successiva alla data di fine della giornata ${i}.`
        );
        return;
      }
    }

    Swal.fire({
      title: 'Are you sure want to create course?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(
          'http://localhost:5000/api/corsi',
          {
            ...corso,
            giornate,
          },
          {
            headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
          }
        )
          .then((res) => {
            if (res?.status === 200||201) {
              Swal.fire('Saved!', '', 'success');
              navigate(decodedToken.user.role=='admin'?"/admin-dashboard":decodedToken.user.role=='center'?'/center-dashboard':'/instructor-dashboard');
            } else {
              Swal.fire('Something went wrong', '', 'info');
            }
          })
          .catch((err) => {
            console.error('Error assigning sanitario:', err);
            Swal.fire('Something went wrong', '', 'info');
          });
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='container mt-4'>
      <h2>Crea Corso</h2>
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-md-6 mb-3'>
            <label>Tipologia:</label>
            <select
              className='form-control'
              name='tipologia'
              value={corso.tipologia}
              onChange={handleTipologiaChange}
              required
            >
              <option value=''>Seleziona una tipologia</option>
              {tipologiaProdotti.map((prodotto) => (
                <option key={prodotto._id} value={prodotto._id}>
                  {prodotto.title} (Disponibili: {prodotto.quantity})
                </option>
              ))}
            </select>
          </div>
          <div className='col-md-6 mb-3'>
            <label>Numero Discenti:</label>
            <input
              type='number'
              className='form-control'
              name='numeroDiscenti'
              value={corso.numeroDiscenti}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label>Città:</label>
            <input
              type='text'
              className='form-control'
              name='città'
              value={corso.città}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label>Via:</label>
            <input
              type='text'
              className='form-control'
              name='via'
              value={corso.via}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='col-md-6 mb-3 d-flex align-items-end gap-2'>
            <div className='col-9'>
              <label>Istruttore:</label>
              <select
                className='form-control'
                name='istruttore'
                onChange={handleIstruttoreChange}
              >
                <option value=''>Seleziona un Istruttore</option>
                {data?.role == 'center' ? (data?.instructors?.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                  {instructor?.firstName + ' ' + instructor?.lastName}
                  </option>
                ))):(
                  <option value={data?._id}>
                    {data?.firstName + ' ' + data?.lastName}
                  </option>
                )
                
              }
              </select>
              <ul>
                {data?.role == 'center' &&
                  corso.istruttori.map((istruttore, index) => (
                    <li key={index}>
                      {data?.instructors?.find(
                        (instr) => instr._id === istruttore
                      )?.firstName +
                        ' ' +
                        data?.instructors?.find(
                          (instr) => instr._id === istruttore
                        )?.lastName}
                      <button onClick={() => removeIstruttore(istruttore)}>
                        Remove
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
            <button
              type='button'
              className='btn btn-primary col-3'
              onClick={handleIstruttoreChange}
            >
              Add Istruttore
            </button>
          </div>

          <div className='col-md-6 mb-3 d-flex align-items-end gap-2'>
            <div className='col-9'>
              <label>Direttore Corso:</label>
              <select
                className='form-control'
                name='direttoreCorso'
                onChange={handleDirettoreChange}
              >
                <option value=''>Seleziona un Direttore</option>
                {data?.sanitarios?.map((direttore) => (
                  <option key={direttore._id} value={direttore._id}>
                    {direttore?.firstName + ' ' + direttore?.lastName}
                  </option>
                ))}
              </select>
              <ul>
                {corso.direttoriCorso.map((direttore, index) => (
                  <li key={index}>
                    {data?.sanitarios?.find((san) => san._id === direttore)
                      ?.firstName +
                      ' ' +
                      data?.sanitarios?.find((san) => san._id === direttore)
                        ?.lastName}
                    <button onClick={() => removeDirecttore(direttore)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type='button'
              className='btn btn-primary col-3'
              onClick={handleDirettoreChange}
            >
              Add Direttore
            </button>
          </div>
        </div>

        <h4>Giornate del Corso</h4>
        {giornate.map((giornata, index) => (
          <div className='row' key={index}>
            <div className='col-md-3 mb-3'>
              <label>Data Inizio:</label>
              <input
                type='date'
                className='form-control'
                name='dataInizio'
                value={giornata.dataInizio}
                onChange={(e) => handleGiornataChange(index, e)}
                required
              />
            </div>
            <div className='col-md-3 mb-3'>
              <label>Data Fine:</label>
              <input
                type='date'
                className='form-control'
                name='dataFine'
                value={giornata.dataFine}
                onChange={(e) => handleGiornataChange(index, e)}
                required
              />
            </div>
            <div className='col-md-3 mb-3'>
              <label>Ora Inizio:</label>
              <input
                type='time'
                className='form-control'
                name='oraInizio'
                value={giornata.oraInizio}
                onChange={(e) => handleGiornataChange(index, e)}
                required
              />
            </div>
            <div className='col-md-3 mb-3'>
              <label>Ora Fine:</label>
              <input
                type='time'
                className='form-control'
                name='oraFine'
                value={giornata.oraFine}
                onChange={(e) => handleGiornataChange(index, e)}
                required
              />
            </div>
          </div>
        ))}
        <button
          type='button'
          className='btn btn-secondary mb-4'
          onClick={addGiornata}
        >
          Aggiungi Giornata
        </button>

        <button type='submit' className='btn btn-primary'>
          Crea Corso
        </button>
        <button
          type='button'
          className='btn btn-secondary ms-3'
          onClick={() => navigate(-1)}
        >
          Torna alla Dashboard
        </button>
      </form>
    </div>
  );
}

export default CreateCorso;

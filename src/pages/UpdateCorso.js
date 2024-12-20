import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

function UpdateCorso() {
  const location = useLocation();
  const id = location?.state?.id;
  const [data, setData] = useState(null);
  console.log('data: ', data);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const [giornate, setGiornate] = useState([
    { dataInizio: '', dataFine: '', oraInizio: '', oraFine: '' },
  ]);

  const [corso, setCorso] = useState({
    città: '',
    via: '',
    numeroDiscenti: '',
    istruttore: [],
    direttoreCorso: [],
  });
  console.log('corso: ', corso);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          'http://18.171.180.225/api/auth/centers/me',
          { headers: { 'x-auth-token': token } }
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
    const fetchCourseData = async () => {
      try {
        const res = await axios.get(
          `http://18.171.180.225/api/corsi/user-courses/${id}`,
          {
            headers: { 'x-auth-token': token },
          }
        );
        setCorso(res.data);
        setGiornate(res.data.giornate);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.error || 'An error occurred');
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

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
    setGiornate([
      ...giornate,
      { dataInizio: '', dataFine: '', oraInizio: '', oraFine: '' },
    ]);
  };

  const handleIstruttoreChange = (e) => {
    const selectedIstruttore = e.target.value;
    if (!corso.istruttore.includes(selectedIstruttore)) {
      setCorso({
        ...corso,
        istruttore: [...corso.istruttore, selectedIstruttore],
      });
    }
  };

  const removeIstruttore = (id) => {
    setCorso({
      ...corso,
      istruttore: corso.istruttore.filter((istruttore) => istruttore !== id),
    });
  };

  const handleDirettoreChange = (e) => {
    const selectedDirettore = e.target.value;
    if (!corso.direttoreCorso.includes(selectedDirettore)) {
      setCorso({
        ...corso,
        direttoreCorso: [...corso.direttoreCorso, selectedDirettore],
      });
    }
  };

  const removeDirettore = (id) => {
    setCorso({
      ...corso,
      direttoreCorso: corso.direttoreCorso.filter(
        (direttore) => direttore !== id
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://18.171.180.225/api/corsi/courses/${id}`,
        {
          ...corso,
          giornate,
        },
        { headers: { 'x-auth-token': token } }
      );
      Swal.fire('Course updated successfully!', '', 'success');
      navigate(
        decodedToken.user.role === 'admin'
          ? '/admin-dashboard'
          : '/center-dashboard'
      );
    } catch (error) {
      Swal.fire('Failed to update the course', '', 'error');
    }
  };

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   return date?.toLocaleDateString('it-IT');
  // };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='container mt-4'>
      <h2>Update Corso</h2>
      <form onSubmit={handleSubmit}>
        <div className='row'>
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

          {/* Istruttori */}
          <div className='col-md-6 mb-3'>
            <label>Istruttori:</label>
            <select className='form-control' onChange={handleIstruttoreChange}>
              <option value=''>Seleziona un Istruttore</option>
              {data?.role === 'center' ? (
                data?.instructors?.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {instructor.firstName + ' ' + instructor.lastName}
                  </option>
                ))
              ) : (
                <option value={data}>
                  {data?.firstName + ' ' + data?.lastName}
                </option>
              )}
            </select>
            <ul>
              {corso?.istruttore?.map((istruttore, index) => (
                <li key={index}>
                  {data?.instructors?.find((instr) => instr?._id === istruttore)
                    ?.firstName +
                    ' ' +
                    data?.instructors?.find(
                      (instr) => instr?._id === istruttore
                    )?.lastName}
                  <button
                    type='button'
                    onClick={() => removeIstruttore(istruttore)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Direttori Corso */}
          <div className='col-md-6 mb-3'>
            <label>Direttori Corso:</label>
            <select className='form-control' onChange={handleDirettoreChange}>
              <option value=''>Seleziona un Direttore</option>
              {data?.sanitarios?.map((direttore) => (
                <option key={direttore._id} value={direttore._id}>
                  {direttore?.firstName + ' ' + direttore?.lastName}
                </option>
              ))}
            </select>
            <ul>
              {corso?.direttoreCorso?.map((direttore, index) => (
                <li key={index}>
                  {data?.sanitarios?.find((san) => san._id === direttore)
                    ?.firstName +
                    ' ' +
                    data?.sanitarios?.find((san) => san._id === direttore)
                      ?.lastName}
                  <button
                    type='button'
                    onClick={() => removeDirettore(direttore)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Giornate */}
          {giornate?.map((giornata, index) => (
            <div key={index} className='col-md-12 mb-3'>
              <label>Giornata {index + 1}</label>
              <input
                type='date'
                className='form-control'
                name='dataInizio'
                value={giornata?.dataInizio?.split('T')[0]}
                onChange={(e) => handleGiornataChange(index, e)}
                required
              />
              <input
                type='date'
                className='form-control'
                name='dataFine'
                value={giornata?.dataFine?.split('T')[0]}
                onChange={(e) => handleGiornataChange(index, e)}
                required
              />
              <input
                type='time'
                className='form-control'
                name='oraInizio'
                value={giornata.oraInizio}
                onChange={(e) => handleGiornataChange(index, e)}
                required
              />
              <input
                type='time'
                className='form-control'
                name='oraFine'
                value={giornata.oraFine}
                onChange={(e) => handleGiornataChange(index, e)}
                required
              />
            </div>
          ))}

          {/* <button type="button" onClick={addGiornata}>
            Add Giornata
          </button> */}

          <button type='submit' className='btn btn-primary'>
            Update Corso
          </button>
        </div>
      </form>
      <button className='btn btn-secondary mt-4' onClick={() => navigate(-1)}>
        Torna alla Dashboard
      </button>
    </div>
  );
}

export default UpdateCorso;

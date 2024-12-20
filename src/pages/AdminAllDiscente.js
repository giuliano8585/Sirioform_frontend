import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminAllDiscente() {
  const [discenti, setDiscenti] = useState([]);
  const [completeCourseModal, setCompleteCourseModel] = useState(false);
  const [discenteId, setDiscenteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscenti = async () => {
      try {
        const res = await axios.get('http://18.171.180.225/api/discenti/all', {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        });
        setDiscenti(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDiscenti();
  }, []);

  const handleCompleteCourses = (id) => {
    setCompleteCourseModel(!completeCourseModal);
    setDiscenteId(id);
  };

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
            <th></th>
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
                <td>
                  {' '}
                  {discente?.patentNumber !== null ||
                  discente?.patentNumber !== ''
                    ? discente?.patentNumber[0]
                    : discente?.patentNumber[1]}
                </td>
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
                <td>
                  <button
                    className='btn btn-primary'
                    onClick={() => handleCompleteCourses(discente?._id)}
                  >
                    complete courses
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

      {completeCourseModal && (
        <CompleteCourseModal
          discenteId={discenteId}
          handleCompleteCourses={handleCompleteCourses}
        />
      )}
    </div>
  );
}

export default AdminAllDiscente;

const CompleteCourseModal = ({ discenteId, handleCompleteCourses }) => {
  const [data, setData] = useState([]);
  console.log('data: ', data);
  useEffect(() => {
    const handleCompleteCourse = async (courseId) => {
      try {
        const res = await axios.get(
          `http://18.171.180.225/api/corsi/discente-courses/${discenteId}`,
          {
            headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
          }
        );
        console.log('res: ', res);
        setData(res?.data);
      } catch (err) {
        console.error('Error fetching instructors:', err);
      }
    };
    handleCompleteCourse();
  }, []);
  return (
    <div className='modal modal-xl show d-block' tabIndex='-1'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Assign Discente Modal</h5>
            <button
              type='button'
              className='close'
              onClick={handleCompleteCourses}
            >
              <span>&times;</span>
            </button>
          </div>
          <div className='modal-body'>
            <div className='table-responsive'>
              <table className='table table-striped table-bordered'>
                <thead className='thead-dark'>
                  <tr>
                    <th>Nome</th>
                    <th>completed At</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data
                      ?.filter((item) => item?.status == 'complete')
                      .map((discente, index) => (
                        <tr key={index}>
                          <td>{discente.città}</td>
                          <td>{discente.updatedAt?.split('T')[0]}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan='5'>No Direttore Corso found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

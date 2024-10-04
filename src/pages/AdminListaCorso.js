import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminListaCorso() {
  const [render,setRender] = useState(false)
  const [corso, setCorso] = useState([]);
  console.log('corso: ', corso);
  const [showSanitariosModal, setShowSanitariosModal] = useState(false);
  const [selectedDirettoreCorso, setSelectedDirettoreCorso] = useState([]);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState([]);
  const [showGiornateModal, setShowGiornateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [courseId, setCourseId] = useState(false);
  const [selectedGiornate, setSelecteGiornate] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCorso = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/corsi/', {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        });
        setCorso(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCorso();
  }, [render]);

  const handleOpenModal = (direttoreCorso) => {
    setSelectedDirettoreCorso(direttoreCorso || []);
    setShowSanitariosModal(true);
  };
  const handleOpenInstructorModal = (direttoreCorso) => {
    setSelectedInstructor(direttoreCorso || []);
    setShowInstructorModal(true);
  };
  const handleOpenGiornateModal = (direttoreCorso) => {
    setSelecteGiornate(direttoreCorso || []);
    setShowGiornateModal(true);
  };
  const handleOpenCourseModal = (courseId) => {
    setCourseId(courseId);
    setShowStatusModal(true);
  };

  return (
    <div className='container mt-4'>
      <h2>Lista corso</h2>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Città</th>
            <th>Via</th>
            <th>Created By</th>
            <th>Course</th>
            <th>Numero Discenti</th>
            <th>Current Status</th>
            <th>direttore Details</th>
            <th>Città</th>
            <th>Regione</th>
          </tr>
        </thead>
        <tbody>
          {corso?.length > 0 ? (
            corso.map((corsoItem) => (
              <tr key={corsoItem._id}>
                <td>{corsoItem.città}</td>
                <td>{corsoItem.via}</td>
                <td>{corsoItem.userId?.name}</td>
                <td>{corsoItem?.tipologia?.type}</td>
                <td>{corsoItem.status}</td>
                <td>{corsoItem.numeroDiscenti}</td>
                <td>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => handleOpenModal(corsoItem.direttoreCorso)}
                  >
                    direttore Details
                  </button>
                </td>
                <td>
                  {' '}
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() =>
                      handleOpenInstructorModal(corsoItem.istruttore)
                    }
                  >
                    instruttore Details
                  </button>
                </td>
                <td>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => handleOpenGiornateModal(corsoItem.giornate)}
                  >
                    Giornate Details
                  </button>
                </td>
                <td>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => handleOpenCourseModal(corsoItem?._id)}
                  >
                    Change Status
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='8' className='text-muted'>
                Nessun corso trovato.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className='btn btn-secondary mt-4' onClick={() => navigate(-1)}>
        Torna alla Dashboard
      </button>

      {showSanitariosModal && (
        <SanitariosModal
          setShowSanitariosModal={setShowSanitariosModal}
          direttoreCorso={selectedDirettoreCorso}
        />
      )}
      {showInstructorModal && (
        <InstuctorModal
          setShowInstructorModal={setShowInstructorModal}
          instructorDetails={selectedInstructor}
        />
      )}
      {showGiornateModal && (
        <GiornateModal
          setShowGiornateModal={setShowGiornateModal}
          giornateDetails={selectedGiornate}
        />
      )}
      {showStatusModal && (
        <StatusModal
          setShowStatusModal={setShowStatusModal}
          courseId={courseId}
          setRender={setRender}
          render={render}
        />
      )}
    </div>
  );
}

export default AdminListaCorso;

const SanitariosModal = ({ setShowSanitariosModal, direttoreCorso }) => {
  return (
    <div className='modal modal-xl show d-block' tabIndex='-1'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Sanitari Associati</h5>
            <button
              type='button'
              className='close'
              onClick={() => setShowSanitariosModal(false)}
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
                    <th>Cognome</th>
                    <th>E-Mail</th>
                    <th>Indirizzo</th>
                  </tr>
                </thead>
                <tbody>
                  {direttoreCorso?.length > 0 ? (
                    direttoreCorso.map((sanitario, index) => (
                      <tr key={index}>
                        <td>{sanitario.firstName}</td>
                        <td>{sanitario.lastName}</td>
                        <td>{sanitario.email}</td>
                        <td>{sanitario.address}</td>
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
const InstuctorModal = ({ setShowInstructorModal, instructorDetails }) => {
  console.log('instructorDetails: ', instructorDetails);
  return (
    <div className='modal modal-xl show d-block' tabIndex='-1'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Sanitari Associati</h5>
            <button
              type='button'
              className='close'
              onClick={() => setShowInstructorModal(false)}
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
                    <th>Cognome</th>
                    <th>E-Mail</th>
                    <th>Indirizzo</th>
                  </tr>
                </thead>
                <tbody>
                  {instructorDetails?.length > 0 ? (
                    instructorDetails.map((instructor, index) => (
                      <tr key={index}>
                        <td>{instructor.firstName}</td>
                        <td>{instructor.lastName}</td>
                        <td>{instructor.email}</td>
                        <td>{instructor.address}</td>
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

const GiornateModal = ({ setShowGiornateModal, giornateDetails }) => {
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };
  return (
    <div className='modal modal-xl show d-block' tabIndex='-1'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Sanitari Associati</h5>
            <button
              type='button'
              className='close'
              onClick={() => setShowGiornateModal(false)}
            >
              <span>&times;</span>
            </button>
          </div>
          <div className='modal-body'>
            <div className='table-responsive'>
              <table className='table table-striped table-bordered'>
                <thead className='thead-dark'>
                  <tr>
                    <th>dataInizio</th>
                    <th>dataFine</th>
                    <th>oraInizio</th>
                    <th>oraFine</th>
                  </tr>
                </thead>
                <tbody>
                  {giornateDetails?.length > 0 ? (
                    giornateDetails.map((giornate, index) => (
                      <tr key={index}>
                        <td>{formatDate(giornate?.dataInizio?.split('T')[0])}</td>
                        <td>{formatDate(giornate?.dataFine?.split('T')[0])}</td>
                        <td>{giornate.oraInizio}</td>
                        <td>{giornate.oraFine}</td>
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

const StatusModal = ({ setShowStatusModal, courseId,setRender,render }) => {
  const [status, setStatus] = useState('active');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/corsi/courses/${courseId}/status`,
        {
          status: status,
        },
        {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        }
      );
      alert('Corso status change con successo!');
      setRender(!render)
      setShowStatusModal(false)
    } catch (err) {
      console.error(err);
      alert('Errore durante la creazione del corso');
    }
  };

  return (
    <div className='modal modal-xl show d-block' tabIndex='-1'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Change Status</h5>
            <button
              type='button'
              className='close'
              onClick={() => setShowStatusModal(false)}
            >
              <span>&times;</span>
            </button>
          </div>
          <div className='modal-body'>
            <form action='submit' onSubmit={handleSubmit}>
              <select className='col-12 form-control' onChange={(e) => setStatus(e.target.value)} name='' id=''>
                <option value='active'>Active</option>
                <option value='unActive'>Un Active</option>
              </select>
              <button type='submit' className='btn btn-primary'>
                Change Status
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

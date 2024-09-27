import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InstructorList = () => {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [sanitarios, setSanitarios] = useState([]);
  const [allSanitarios, setAllSanitarios] = useState([]);
  const [qualificationData, setQualificationData] = useState([]);
  const [viewingSanitarios, setViewingSanitarios] = useState(false);
  const [assigningSanitarios, setAssigningSanitarios] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteCenterModal, setShowDeleteCenterModal] = useState(false);
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [filteredSanitariosData, setFilteredSanitariosData] =
    useState(allSanitarios);
  const [filteredViewSanitariosData, setFilteredViewSanitariosData] =
    useState(sanitarios);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredSanitariosData(
      allSanitarios?.filter(
        (sanitarios) =>
          sanitarios?.firstName?.toLowerCase().includes(query) ||
          sanitarios?.lastName?.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, allSanitarios]);

  const handleDeleteCenter = async () => {};

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredViewSanitariosData(
      sanitarios?.filter(
        (sanitarios) =>
          sanitarios?.firstName?.toLowerCase().includes(query) ||
          sanitarios?.lastName?.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, sanitarios]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/instructors');
        setInstructors(res.data);
      } catch (err) {
        console.error('Error fetching instructors:', err);
      }
    };

    fetchInstructors();
  }, []);

  const handleAssignSanitario = async (instructorId) => {
    setSelectedInstructor(instructorId);
    try {
      const res = await axios.get('http://localhost:5000/api/sanitarios');
      setAllSanitarios(res.data);
      setAssigningSanitarios(true);
    } catch (err) {
      console.error('Error fetching sanitarios:', err);
    }
  };

  const handleAddSanitario = async (sanitarioId) => {
    if (!sanitarioId) return;

    try {
      await axios.post(
        'http://localhost:5000/api/instructors/assign-sanitario',
        {
          instructorId: selectedInstructor,
          sanitarioId: sanitarioId,
        }
      );
      alert('Sanitario assegnato con successo!');
      setSelectedInstructor(null);
    } catch (err) {
      console.error('Error assigning sanitario:', err);
    }
  };

  const handleViewSanitarios = async (instructorId) => {
    setSelectedInstructor(instructorId);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/instructors/${instructorId}/sanitarios`
      );
      setSanitarios(res.data);
      setViewingSanitarios(true); // Stato per visualizzare i sanitari associati
    } catch (err) {
      console.error('Error fetching assigned sanitarios:', err);
    }
  };

  const handleRemoveSanitario = async (sanitarioId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/instructors/remove-sanitario',
        {
          instructorId: selectedInstructor,
          sanitarioId,
        }
      );
      setSanitarios(sanitarios.filter((s) => s._id !== sanitarioId));
    } catch (err) {
      console.error('Error removing sanitario:', err);
    }
  };

  return (
    <div className='container mt-4'>
      <h1 className='mb-4'>Lista Istruttori</h1>
      <div className='table-responsive'>
        <table className='table table-striped table-bordered'>
          <thead className='thead-dark'>
            <tr>
              <th>Numero Brevetto</th>
              <th>Nome</th>
              <th>Cognome</th>
              <th>P.Iva</th>
              <th>Indirizzo</th>
              <th>Regione</th>
              <th>Telefono</th>
              <th>E-Mail</th>
              <th>Codice Fiscale</th>
              <th>Stato</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor._id}>
                <td>{instructor.brevetNumber}</td>
                <td>{instructor.firstName}</td>
                <td>{instructor.lastName}</td>
                <td>{instructor.piva}</td>
                <td>{instructor.address}</td>
                <td>{instructor.region}</td>
                <td>{instructor.phone}</td>
                <td>{instructor.email}</td>
                <td>{instructor.fiscalCode}</td>
                <td>
                  <button
                    className='btn btn-primary mb-2'
                    onClick={() => handleAssignSanitario(instructor._id)}
                  >
                    Assegna Sanitario
                  </button>
                  <button
                    className='btn btn-info mb-2'
                    onClick={() => handleViewSanitarios(instructor._id)}
                  >
                    Lista Sanitari
                  </button>
                  <button
                    className='btn btn-primary mb-2'
                    onClick={() => {
                      setShowQualificationModal(true);
                      setQualificationData(instructor?.qualifications);
                    }}
                  >
                    Abilitazioni
                  </button>
                  <button
                    className='btn btn-danger'
                    onClick={() =>
                      setShowDeleteCenterModal(!showDeleteCenterModal)
                    }
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className='btn btn-secondary'
        onClick={() => window.history.back()}
      >
        Indietro
      </button>

      {/* Modal per Assegnare Sanitario */}
      {selectedInstructor && assigningSanitarios && (
        <div className='modal modal-xl show d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Assegna Sanitario</h5>
                <button
                  type='button'
                  className='close'
                  onClick={() => setAssigningSanitarios(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <input
                  className='form-control mb-3'
                  placeholder='search sanitario'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className='table-responsive'>
                  <table className='table table-striped table-bordered'>
                    <thead className='thead-dark'>
                      <tr>
                        <th>Nome</th>
                        <th>Cognome</th>
                        <th>E-Mail</th>
                        <th>Indirizzo</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSanitariosData?.map((sanitarios) => (
                        <tr key={sanitarios._id}>
                          <td>{sanitarios.firstName}</td>
                          <td>{sanitarios.lastName}</td>
                          <td>{sanitarios.email}</td>
                          <td>
                            {sanitarios.address}, {sanitarios.city},{' '}
                            {sanitarios.region}
                          </td>
                          <td>
                            <button
                              type='button'
                              className='btn  btn-primary'
                              onClick={() => handleAddSanitario(sanitarios._id)}
                            >
                              Assegna
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteCenterModal && (
        <div className='modal show d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Delete Center</h5>
                <button
                  type='button'
                  className='close'
                  onClick={() => setShowDeleteCenterModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body mx-auto '>
                <h5 className='modal-title py-3'>
                  Are you sure want to Delete
                </h5>
                <div className='d-flex align-items-center gap-3 mx-auto'>
                  <button
                    type='button'
                    className='close  btn-primary'
                    onClick={() => setShowDeleteCenterModal(false)}
                  >
                    <span>Close</span>
                  </button>
                  <button
                    type='button'
                    className='close  btn-danger'
                    onClick={() => handleDeleteCenter(false)}
                  >
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQualificationModal && (
        <div className='modal show d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Qualification Data</h5>
                <button
                  type='button'
                  className='close'
                  onClick={() => setShowQualificationModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body mx-auto '>
                <table className='table table-striped table-bordered'>
                  <thead className='thead-dark'>
                    <tr>
                      <th>Qualification Type</th>
                      <th>Expiration Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qualificationData?.map((qualifications) => (
                      <tr key={qualifications._id}>
                        <td>{qualifications.name}</td>
                        <td>{qualifications.expirationDate?.split('T')[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className='d-flex align-items-center gap-3 mx-auto'>
                  <button
                    type='button'
                    className='close  btn-primary'
                    onClick={() => setShowQualificationModal(false)}
                  >
                    <span>Close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal per Visualizzare Sanitari */}
      {selectedInstructor && viewingSanitarios && (
        <div className='modal modal-xl show d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Sanitari Associati</h5>
                <button
                  type='button'
                  className='close'
                  onClick={() => setSelectedInstructor(null)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <input
                  className='form-control mb-3'
                  placeholder='search sanitario'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className='table-responsive'>
                  <table className='table table-striped table-bordered'>
                    <thead className='thead-dark'>
                      <tr>
                        <th>Nome</th>
                        <th>Cognome</th>
                        <th>E-Mail</th>
                        <th>Indirizzo</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredViewSanitariosData?.map((sanitarios) => (
                        <tr key={sanitarios._id}>
                          <td>{sanitarios.firstName}</td>
                          <td>{sanitarios.lastName}</td>
                          <td>{sanitarios.email}</td>
                          <td>
                            {sanitarios.address}, {sanitarios.city},{' '}
                            {sanitarios.region}
                          </td>
                          <td>
                            <button
                              type='button'
                              className='btn btn-danger'
                              onClick={() =>
                                handleRemoveSanitario(sanitarios._id)
                              }
                            >
                              Elimina
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorList;

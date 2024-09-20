import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InstructorList = () => {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [sanitarios, setSanitarios] = useState([]);
  const [allSanitarios, setAllSanitarios] = useState([]);
  const [sanitarioToAdd, setSanitarioToAdd] = useState('');
  const [viewingSanitarios, setViewingSanitarios] = useState(false); // Stato per visualizzare i sanitari associati

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
      setViewingSanitarios(false); // Assicurati di chiudere la visualizzazione dei sanitari associati
    } catch (err) {
      console.error('Error fetching sanitarios:', err);
    }
  };

  const handleAddSanitario = async () => {
    if (!sanitarioToAdd) return;

    try {
      await axios.post('http://localhost:5000/api/instructors/assign-sanitario', {
        instructorId: selectedInstructor,
        sanitarioId: sanitarioToAdd,
      });
      alert('Sanitario assegnato con successo!');
      setSanitarioToAdd('');
      setSelectedInstructor(null);
    } catch (err) {
      console.error('Error assigning sanitario:', err);
    }
  };

  const handleViewSanitarios = async (instructorId) => {
    setSelectedInstructor(instructorId);
    try {
      const res = await axios.get(`http://localhost:5000/api/instructors/${instructorId}/sanitarios`);
      setSanitarios(res.data);
      setViewingSanitarios(true); // Stato per visualizzare i sanitari associati
    } catch (err) {
      console.error('Error fetching assigned sanitarios:', err);
    }
  };

  const handleRemoveSanitario = async (sanitarioId) => {
    try {
      await axios.post('http://localhost:5000/api/instructors/remove-sanitario', {
        instructorId: selectedInstructor,
        sanitarioId,
      });
      setSanitarios(sanitarios.filter((s) => s._id !== sanitarioId));
    } catch (err) {
      console.error('Error removing sanitario:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista Istruttori</h1>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
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
                    className="btn btn-primary mb-2"
                    onClick={() => handleAssignSanitario(instructor._id)}
                  >
                    Assegna Sanitario
                  </button>
                  <button
                    className="btn btn-info mb-2"
                    onClick={() => handleViewSanitarios(instructor._id)}
                  >
                    Lista Sanitari
                  </button>
                  <button className="btn btn-primary mb-2">Abilitazioni</button>
                  <button className="btn btn-danger">Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn btn-secondary" onClick={() => window.history.back()}>Indietro</button>

      {/* Modal per Assegnare Sanitario */}
      {selectedInstructor && !viewingSanitarios && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assegna Sanitario</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setSelectedInstructor(null)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <select
                  className="form-control mb-3"
                  value={sanitarioToAdd}
                  onChange={(e) => setSanitarioToAdd(e.target.value)}
                >
                  <option value="">Seleziona Sanitario</option>
                  {allSanitarios.map((sanitario) => (
                    <option key={sanitario._id} value={sanitario._id}>
                      {sanitario.firstName} {sanitario.lastName}
                    </option>
                  ))}
                </select>
                <button className="btn btn-primary" onClick={handleAddSanitario}>
                  Assegna
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal per Visualizzare Sanitari */}
      {selectedInstructor && viewingSanitarios && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sanitari Associati</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setSelectedInstructor(null)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  {sanitarios.map((sanitario) => (
                    <li key={sanitario._id} className="list-group-item d-flex justify-content-between align-items-center">
                      {sanitario.firstName} {sanitario.lastName}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveSanitario(sanitario._id)}
                      >
                        Elimina
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorList;

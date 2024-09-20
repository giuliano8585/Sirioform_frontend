import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CenterList = () => {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [sanitarios, setSanitarios] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [allSanitarios, setAllSanitarios] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);
  const [sanitarioToAdd, setSanitarioToAdd] = useState('');
  const [instructorToAdd, setInstructorToAdd] = useState('');
  const [showSanitarioModal, setShowSanitarioModal] = useState(false);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [showAssignedSanitariosModal, setShowAssignedSanitariosModal] = useState(false);
  const [showAssignedInstructorsModal, setShowAssignedInstructorsModal] = useState(false);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/centers');
        setCenters(res.data);
      } catch (err) {
        console.error('Error fetching centers:', err);
      }
    };

    fetchCenters();
  }, []);

  const handleAssignSanitario = async (centerId) => {
    setSelectedCenter(centerId);
    try {
      const res = await axios.get('http://localhost:5000/api/sanitarios');
      setAllSanitarios(res.data);
      setShowSanitarioModal(true);
    } catch (err) {
      console.error('Error fetching sanitarios:', err);
    }
  };

  const handleAddSanitario = async () => {
    if (!sanitarioToAdd) return;

    try {
      await axios.post('http://localhost:5000/api/centers/assign-sanitario', {
        centerId: selectedCenter,
        sanitarioId: sanitarioToAdd,
      });
      alert('Sanitario assegnato con successo!');
      setSanitarioToAdd('');
      setShowSanitarioModal(false);
    } catch (err) {
      console.error('Error assigning sanitario:', err);
    }
  };

  const handleViewSanitarios = async (centerId) => {
    setSelectedCenter(centerId);
    try {
      const res = await axios.get(`http://localhost:5000/api/centers/${centerId}/sanitarios`);
      setSanitarios(res.data);
      setShowAssignedSanitariosModal(true);
    } catch (err) {
      console.error('Error fetching assigned sanitarios:', err);
    }
  };

  const handleRemoveSanitario = async (sanitarioId) => {
    try {
      await axios.post('http://localhost:5000/api/centers/remove-sanitario', {
        centerId: selectedCenter,
        sanitarioId,
      });
      setSanitarios(sanitarios.filter((s) => s._id !== sanitarioId));
    } catch (err) {
      console.error('Error removing sanitario:', err);
    }
  };

  const handleAssignInstructor = async (centerId) => {
    setSelectedCenter(centerId);
    try {
      const res = await axios.get('http://localhost:5000/api/instructors');
      setAllInstructors(res.data);
      setShowInstructorModal(true);
    } catch (err) {
      console.error('Error fetching instructors:', err);
    }
  };

  const handleAddInstructor = async () => {
    if (!instructorToAdd) return;

    try {
      await axios.post('http://localhost:5000/api/centers/assign-instructor', {
        centerId: selectedCenter,
        instructorId: instructorToAdd,
      });
      alert('Istruttore assegnato con successo!');
      setInstructorToAdd('');
      setShowInstructorModal(false);
    } catch (err) {
      console.error('Error assigning instructor:', err);
    }
  };

  const handleViewInstructors = async (centerId) => {
    setSelectedCenter(centerId);
    try {
      const res = await axios.get(`http://localhost:5000/api/centers/${centerId}/instructors`);
      setInstructors(res.data);
      setShowAssignedInstructorsModal(true);
    } catch (err) {
      console.error('Error fetching assigned instructors:', err);
    }
  };

  const handleRemoveInstructor = async (instructorId) => {
    try {
      await axios.post('http://localhost:5000/api/centers/remove-instructor', {
        centerId: selectedCenter,
        instructorId,
      });
      setInstructors(instructors.filter((i) => i._id !== instructorId));
    } catch (err) {
      console.error('Error removing instructor:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista Centri</h1>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Codice Univoco</th>
              <th>Denominazione</th>
              <th>Data Fondazione</th>
              <th>P. Iva</th>
              <th>Indirizzo</th>
              <th>Regione</th>
              <th>Telefono</th>
              <th>Email</th>
              <th>Stato</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center) => (
              <tr key={center._id}>
                <td>{center.code}</td>
                <td>{center.name}</td>
                <td>{center.foundationDate}</td>
                <td>{center.piva}</td>
                <td>{center.address}</td>
                <td>{center.region}</td>
                <td>{center.phone}</td>
                <td>{center.email}</td>
                <td>
                  <button
                    className="btn btn-primary mb-2"
                    onClick={() => handleAssignSanitario(center._id)}
                  >
                    Assegna Sanitario
                  </button>
                  <button
                    className="btn btn-primary mb-2"
                    onClick={() => handleViewInstructors(center._id)}
                  >
                    Istruttori
                  </button>
                  <button
                    className="btn btn-primary mb-2"
                    onClick={() => handleAssignInstructor(center._id)}
                  >
                    Assegna Istruttori
                  </button>
                  <button className="btn btn-primary mb-2">Abilita</button>
                  <button className="btn btn-danger mb-2">Elimina</button>
                  <button
                    className="btn btn-info"
                    onClick={() => handleViewSanitarios(center._id)}
                  >
                    Lista Sanitari
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn btn-secondary" onClick={() => window.history.back()}>Indietro</button>

      {/* Modal per Assegnare Sanitario */}
      {showSanitarioModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assegna Sanitario</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowSanitarioModal(false)}
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

      {/* Modal per Assegnare Istruttore */}
      {showInstructorModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assegna Istruttore</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowInstructorModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <select
                  className="form-control mb-3"
                  value={instructorToAdd}
                  onChange={(e) => setInstructorToAdd(e.target.value)}
                >
                  <option value="">Seleziona Istruttore</option>
                  {allInstructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.firstName} {instructor.lastName}
                    </option>
                  ))}
                </select>
                <button className="btn btn-primary" onClick={handleAddInstructor}>
                  Assegna
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal per Visualizzare Sanitari */}
      {showAssignedSanitariosModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sanitari Associati</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowAssignedSanitariosModal(false)}
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

      {/* Modal per Visualizzare Istruttori */}
      {showAssignedInstructorsModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Istruttori Associati</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowAssignedInstructorsModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  {instructors.map((instructor) => (
                    <li key={instructor._id} className="list-group-item d-flex justify-content-between align-items-center">
                      {instructor.firstName} {instructor.lastName}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveInstructor(instructor._id)}
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

export default CenterList;

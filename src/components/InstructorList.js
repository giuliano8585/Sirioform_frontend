import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const InstructorList = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [sanitarios, setSanitarios] = useState([]);
  const [allSanitarios, setAllSanitarios] = useState([]);
  const [qualificationData, setQualificationData] = useState([]);
  const [viewingSanitarios, setViewingSanitarios] = useState(false);
  const [assigningSanitarios, setAssigningSanitarios] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstructorData, setSelectedInstructorData] = useState(null);
  const [showDeleteCenterModal, setShowDeleteCenterModal] = useState(false);
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [filteredSanitariosData, setFilteredSanitariosData] =
    useState(allSanitarios);
  const [filteredViewSanitariosData, setFilteredViewSanitariosData] =
    useState(sanitarios);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [render, setRender] = useState(false);
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
        setFilteredInstructors(res?.data);
      } catch (err) {
        console.error('Error fetching instructors:', err);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/instructors/${selectedInstructor}`
        );
        setSelectedInstructorData(res.data);
      } catch (err) {
        console.error('Error fetching centers:', err);
      }
    };
    if (selectedInstructor !== null) {
      fetchCenters();
    }
  }, [selectedInstructor, render]);

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
    Swal.fire({
      title: 'Do you want to Assign Sanitario?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post('http://localhost:5000/api/instructors/assign-sanitario', {
            instructorId: selectedInstructor,
            sanitarioId: sanitarioId,
          })
          .then((res) => {
            if (res?.status === 200) {
              Swal.fire('Saved!', '', 'success');
              setRender(!render);
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
    Swal.fire({
      title: 'Do you want to save the changes?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post('http://localhost:5000/api/instructors/remove-sanitario', {
            instructorId: selectedInstructor,
            sanitarioId,
          })
          .then((res) => {
            if (res?.status === 200) {
              setSanitarios(sanitarios.filter((s) => s._id !== sanitarioId));
              Swal.fire('Saved!', '', 'success');
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

  const handleDeleteInstructor = async (id) => {
    Swal.fire({
      title: 'Are you sure want to Delete the Instructor?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/api/instructors/${id}`, {
            headers: {
              'x-auth-token': localStorage.getItem('token'),
            },
          })
          .then((res) => {
            if (res?.status === 200) {
              Swal.fire('Saved!', '', 'success');
              setRender(!render);
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = instructors.filter((instructor) => {
      const fullName = `${instructor?.firstName || ''} ${
        instructor?.lastName || ''
      }`.toLowerCase();
      const region = instructor?.region?.toLowerCase() || '';
      const searchValue = e.target.value.toLowerCase();

      return fullName.includes(searchValue) || region.includes(searchValue);
    });
    setFilteredInstructors(filtered);
  };

  return (
    <div className='container mt-4'>
      <div className='d-flex justify-content-between'>
        <h1 className='mb-4'>Lista Istruttori</h1>
        <div className=''>
          <input
            type='text'
            className='form-control me-2'
            placeholder='Search by instrucor Name and region'
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
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
            {filteredInstructors?.map((instructor) => (
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
                    onClick={() => handleDeleteInstructor(instructor?._id)}
                  >
                    Elimina
                  </button>
                  <button
                    className='btn btn-primary'
                    onClick={() =>
                      navigate('/admin/update-instructor', {
                        state: { instructorId: instructor?._id },
                      })
                    }
                  >
                    Update Instructor
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
                      {filteredSanitariosData
                        ?.filter(
                          (item) =>
                            !selectedInstructorData?.sanitarios?.some(
                              (sanatrio) => sanatrio?._id === item._id
                            )
                        )
                        ?.map((sanitarios) => (
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
                                onClick={() =>
                                  handleAddSanitario(sanitarios._id)
                                }
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
      {viewingSanitarios && (
        <div className='modal modal-xl show d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Sanitari Associati</h5>
                <button
                  type='button'
                  className='close'
                  onClick={() => setViewingSanitarios(false)}
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

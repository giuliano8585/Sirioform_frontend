import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AdminUnActiveRefreshCourse() {
  const [render, setRender] = useState(false);
  const [corso, setCorso] = useState([]);
  const [showSanitariosModal, setShowSanitariosModal] = useState(false);
  const [selectedDirettoreCorso, setSelectedDirettoreCorso] = useState([]);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState([]);
  const [showGiornateModal, setShowGiornateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [courseId, setCourseId] = useState(false);
  const [selectedGiornate, setSelecteGiornate] = useState([]);

  const navigate = useNavigate();

  const [filteredCorso, setFilteredCorso] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    courseType: '',
    centerName: '',
    instructorName: '',
  });

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

  useEffect(() => {
    let filtered = [...corso];
    if (filters.startDate) {
      filtered = filtered.filter(
        (c) =>
          new Date(c?.giornate[0]?.dataInizio?.split('T')[0]) >=
          new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (c) =>
          new Date(c.giornate[0]?.dataFine?.split('T')[0]) <=
          new Date(filters.endDate)
      );
    }
    if (filters.courseType) {
      filtered = filtered.filter((c) =>
        c.tipologia?.type
          .toLowerCase()
          .includes(filters.courseType.toLowerCase())
      );
    }
    if (filters.centerName) {
      filtered = filtered.filter((c) =>
        c.userId?.name?.toLowerCase().includes(filters.centerName.toLowerCase())
      );
    }
    if (filters.instructorName) {
      filtered = filtered.filter((c) => {
        const fullName = `${c.userId?.firstName} ${c.userId?.lastName}`;
        return fullName
          .toLowerCase()
          .includes(filters.instructorName.toLowerCase());
      });
    }
    setFilteredCorso(filtered);
  }, [filters, corso]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className='container mt-4'>
      <div className='d-flex align-items-center justify-content-between'>
        <h2>Lista corso</h2>
        <div className='filters'>
          <input
            type='date'
            name='startDate'
            value={filters.startDate}
            onChange={handleFilterChange}
            placeholder='Start Date'
          />
          <input
            type='date'
            name='endDate'
            value={filters.endDate}
            onChange={handleFilterChange}
            placeholder='End Date'
          />
          <input
            type='text'
            name='courseType'
            value={filters.courseType}
            onChange={handleFilterChange}
            placeholder='Course Type'
          />
          <input
            type='text'
            name='centerName'
            value={filters.centerName}
            onChange={handleFilterChange}
            placeholder='Center Name'
          />
          <input
            type='text'
            name='instructorName'
            value={filters.instructorName}
            onChange={handleFilterChange}
            placeholder='Instructor Name'
          />
        </div>
      </div>
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
          {filteredCorso?.filter((items)=>items?.status=='unactive'&&items?.isRefreshCourse==true)?.length > 0 ? (
            filteredCorso?.filter((items)=>items?.status=='unactive'&&items?.isRefreshCourse==true)?.map((corsoItem) => (
              <tr key={corsoItem._id}>
                <td>{corsoItem.città}</td>
                <td>{corsoItem.via}</td>
                <td>
                  {corsoItem.userId?.role == 'center'
                    ? corsoItem.userId?.name
                    : corsoItem.userId?.firstName +
                      ' ' +
                      corsoItem.userId?.lastName}
                </td>
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

export default AdminUnActiveRefreshCourse;

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
                        <td>
                          {formatDate(giornate?.dataInizio?.split('T')[0])}
                        </td>
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

const StatusModal = ({ setShowStatusModal, courseId, setRender, render }) => {
  const [status, setStatus] = useState('active');
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.preventDefault();
    Swal.fire({
      title: 'Do you want to Change the status of the Course?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `http://localhost:5000/api/corsi/courses/${courseId}/status`,
            {
              status: status,
            },
            {
              headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
            }
          )
          .then((res) => {
            if (res?.status === 200) {
              Swal.fire('Saved!', '', 'success');
              setRender(!render);
              setShowStatusModal(false);
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
            <form onSubmit={handleSubmit}>
              <select
                className='col-12 form-control'
                onChange={(e) => setStatus(e.target.value)}
                name=''
                id=''
              >
                <option value='active'>Active</option>
                <option value='unActive'>Un Active</option>
              </select>
              <button
                type='submit'
                className='btn btn-primary'
              >
                Change Status
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
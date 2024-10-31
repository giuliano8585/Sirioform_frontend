

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

    const AdminEndCourse = () => {
  const [render, setRender] = useState(false);
  const [corso, setCorso] = useState([]);
  const [showSanitariosModal, setShowSanitariosModal] = useState(false);
  const [selectedDirettoreCorso, setSelectedDirettoreCorso] = useState([]);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState([]);
  const [showGiornateModal, setShowGiornateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDiscenteModal, setShowDiscenteModal] = useState(false);
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
  const handleOpenDiscenteModal = (courseId) => {
    setCourseId(courseId);
    setShowDiscenteModal(true);
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


  const handleDeleteCourse = async (id) => {
    Swal.fire({
      title: 'Are you sure want to Delete the Course?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `http://localhost:5000/api/corsi/courses/${id}`,
            {
              headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
            }
          )
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

  const handleDownloadPdf = (corsoItem) => {
    const doc = new jsPDF();

    doc.text(`Course Details`, 10, 10);
    doc.text(`Città: ${corsoItem.città}`, 10, 20);
    doc.text(`Via: ${corsoItem.via}`, 10, 30);
    doc.text(
      `Created By: ${corsoItem.userId?.role === 'center' ? corsoItem.userId?.name : corsoItem.userId?.firstName + ' ' + corsoItem.userId?.lastName}`,
      10, 40
    );
    doc.text(`Course Type: ${corsoItem?.tipologia?.type}`, 10, 50);
    doc.text(`Status: ${corsoItem?.status}`, 10, 60);
    doc.text(`Numero Discenti: ${corsoItem?.numeroDiscenti}`, 10, 70);
    doc.text(`dataFine: ${corsoItem?.giornate[0]?.dataFine?.split('T')[0]}`, 10, 80);
    doc.text(`dataInizio: ${corsoItem?.giornate[0]?.dataInizio?.split('T')[0]}`, 10, 90);
    doc.text(`oraFine: ${corsoItem?.giornate[0]?.oraFine}`, 10, 100);
    doc.text(`oraInizio: ${corsoItem?.giornate[0]?.oraInizio}`, 10, 110);
    doc.text(`istruttore: ${corsoItem?.istruttore?.map((items)=> `instructor Name : ${items?.firstName +" "+items?.lastName} `)}`, 10, 120);
    doc.text(`direttoreCorso: ${corsoItem?.direttoreCorso?.map((items)=> `director Name : ${items?.firstName +" "+items?.lastName} `)}`, 10, 130);
    doc.text(`progressiveNumber: ${corsoItem?.progressiveNumber}`, 10, 140);
    doc.save(`${corsoItem.città}_course_details.pdf`);
  }
  
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
          {filteredCorso?.filter((items)=>(items?.status=='end'||items?.status=='finalUpdate')&&items?.isRefreshCourse!==true)?.length > 0 ? (
            filteredCorso?.filter((items)=>(items?.status=='end'||items?.status=='finalUpdate')&&items?.isRefreshCourse!==true)?.map((corsoItem) => (
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
                <td>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => handleOpenDiscenteModal(corsoItem?._id)}
                  >
                    All Discente
                  </button>
                </td>
                <td>
                  <button
                    type='button'
                    className='btn btn-danger'
                    onClick={() => handleDeleteCourse(corsoItem?._id)}
                  >
                    Delete Course
                  </button>
                </td>
                <td>
                <button
                    type='button'
                    className='btn btn-secondary ml-2'
                    onClick={() => handleDownloadPdf(corsoItem)}
                  >
                    Download PDF
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
      {showDiscenteModal && (
        <DiscenteModal
          setShowDiscenteModal={setShowDiscenteModal}
          courseId={courseId}
          setRender={setRender}
          render={render}
        />
      )}
    </div>
  );
}

export default AdminEndCourse

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
  const [status, setStatus] = useState('complete');

  const handleSubmit = async (e) => {
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
                <option value='complete'>Complete</option>
                <option value='finalUpdate'>Update</option>
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


const DiscenteModal = ({ setShowDiscenteModal, courseId, setRender, render }) => {
  const [data, setData] = useState();

  useEffect(()=>{
    const handleData = async (e) => {
      axios.get(
        `http://localhost:5000/api/corsi/user-course/${courseId}/`,
        {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        }
      )
      .then((res) => {
        if (res?.status === 200) {
          setData(res?.data?.course?.discente)
        } else {
          Swal.fire('Something went wrong', '', 'info');
        }
      })
      .catch((err) => {
        console.error('Error assigning sanitario:', err);
        Swal.fire('Something went wrong', '', 'info');
      });
    };
    handleData()
  },[courseId])

  return (
    <div className='modal modal-xl show d-block' tabIndex='-1'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Discente</h5>
            <button
              type='button'
              className='close'
              onClick={() => setShowDiscenteModal(false)}
            >
              <span>&times;</span>
            </button>
          </div>
          <div className='modal-body'>
          <div className='table-responsive'>
              <table className='table table-striped table-bordered'>
                <thead className='thead-dark'>
                  <tr>
                    <th>nome</th>
                    <th>cognome</th>
                    <th>email</th>
                    <th>telefono</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data.map((data, index) => (
                      <tr key={index}>
                        <td>
                          {data?.nome}
                        </td>
                        <td>{data?.cognome}</td>
                        <td>{data?.email}</td>
                        <td>{data?.telefono}</td>
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
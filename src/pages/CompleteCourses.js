import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function CompleteCourses() {
  const [corso, setCorso] = useState([]);
  const [showSanitariosModal, setShowSanitariosModal] = useState(false);
  const [selectedDirettoreCorso, setSelectedDirettoreCorso] = useState([]);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState([]);
  const [showGiornateModal, setShowGiornateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedGiornate, setSelecteGiornate] = useState([]);
  const [courseId, setCourseId] = useState();


  const navigate = useNavigate();

  useEffect(() => {
    const fetchCorso = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/corsi/user-courses',
          {
            headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
          }
        );
        setCorso(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCorso();
  }, []);

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
      <h2>Completed Lista corso</h2>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Città</th>
            <th>Via</th>
            <th>report code</th>
            <th>Type</th>
            <th>Numero Discenti</th>
            <th>Data creazione</th>
            <th>direttore </th>
            <th>Istruttori</th>
            <th>Giornate</th>
          </tr>
        </thead>
        <tbody>
          {corso?.filter(
            (item) =>
              item?.status == 'complete'
          ).length > 0 ? (
            corso
              ?.filter(
                (item) =>
                  item?.status == 'complete'
              )
              .map((corsoItem) => (
                <tr key={corsoItem._id}>
                  <td>{corsoItem.città}</td>
                  <td>{corsoItem.via}</td>
                  <td>{corsoItem.progressiveNumber}</td>
                  <td>{corsoItem?.tipologia?.type}</td>
                  <td>{corsoItem.numeroDiscenti}</td>
                  <td>{corsoItem.createdAt?.split('T')[0]}</td>
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
                      onClick={() =>
                        handleOpenGiornateModal(corsoItem.giornate)
                      }
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
                      All Discente
                    </button>
                  </td>
                  {corsoItem?.status == 'update' && (
                    <td>
                      <button
                        type='button'
                        className='btn btn-primary'
                        onClick={() =>
                          navigate('/update-course',{state:{id:corsoItem._id,data:corsoItem}})
                        }
                      >
                        Edit
                      </button>
                    </td>
                  )}
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
          // setRender={setRender}
          // render={render}
        />
      )}
    </div>
  );
}

export default CompleteCourses;

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
                        <td>{giornate.dataInizio}</td>
                        <td>{giornate.dataFine}</td>
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
  const [data, setData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  console.log('selectedUsers: ', selectedUsers);
  const [selectAll, setSelectAll] = useState(false);
  console.log('selectAll: ', selectAll);

  // Fetch data on mount
  useEffect(() => {
    const handleData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/corsi/user-course/${courseId}/`,
          {
            headers: { "x-auth-token": `${localStorage.getItem("token")}` },
          }
        );
        if (res?.status === 200) {
          setData(res?.data?.course?.discente || []);
        } else {
          Swal.fire("Something went wrong", "", "info");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        Swal.fire("Something went wrong", "", "info");
      }
    };
    handleData();
  }, [courseId]);

  // Handle individual checkbox change
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle "Select All" checkbox change
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]); // Deselect all
    } else {
      setSelectedUsers(data.map((user) => user._id)); // Select all
    }
    setSelectAll(!selectAll);
  };

  // Send certificates to selected users
  const sendCertificates = async (isForAll) => {
    try {
      const payload = {
        courseId,
        recipients: isForAll ? "all" : selectedUsers,
      };

      const res = await axios.post(
        `http://localhost:5000/api/corsi/courses/${courseId}/send-email`,
        payload,
        {
          headers: { "x-auth-token": `${localStorage.getItem("token")}` },
        }
      );

      if (res.status === 200) {
        Swal.fire("Certificates Sent!", res.data.message, "success");
        setSelectedUsers([]);
        setSelectAll(false);
      }
    } catch (err) {
      console.error("Error sending certificates:", err);
      Swal.fire("Error", "Unable to send certificates", "error");
    }
  };

  return (
    <div className="modal modal-xl show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Discente</h5>
            <button
              type="button"
              className="close"
              onClick={() => setShowStatusModal(false)}
            >
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Nome</th>
                    <th>Cognome</th>
                    <th>Email</th>
                    <th>Telefono</th>
                    <th>Patent Number</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data.map((user, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleCheckboxChange(user._id)}
                          />
                        </td>
                        <td>{user?.nome}</td>
                        <td>{user?.cognome}</td>
                        <td>{user?.email}</td>
                        <td>{user?.telefono}</td>
                        <td>
                          {user?.patentNumber[0] === ""
                            ? user?.patentNumber[1]
                            : user?.patentNumber[0]}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No Direttore Corso found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-3 d-flex justify-content-end">
              <button
                className="btn btn-primary mr-2"
                onClick={() => sendCertificates(false)}
                disabled={selectedUsers.length === 0}
              >
                Send to Selected
              </button>
              <button
                className="btn btn-success"
                onClick={() => sendCertificates(true)}
              >
                Send to All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ListaInstructorCourses() {
  const [corso, setCorso] = useState([]);
  const [showSanitariosModal, setShowSanitariosModal] = useState(false);
  const [selectedDirettoreCorso, setSelectedDirettoreCorso] = useState([]);
  const [selectedCorsoData, setSelectedCorsoData] = useState([]);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState([]);
  const [showGiornateModal, setShowGiornateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [allDiscente, setAllDiscente] = useState([]);
  const [editQuantityModal, setEditQuantityModal] = useState(false);
  const [allCourseDiscente, setAllCourseDiscente] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [allCourseProgressiveNumber, setAllCourseProgressiveNumber] = useState(
    []
  );
  const [showDiscenteModal, setShowDiscenteModal] = useState(false);
  const [render, setRender] = useState(false);
  const [showCourseDiscenteModal, setShowCourseDiscenteModal] = useState(false);
  const [showCourseProgressiveModal, setShowCourseProgressiveModal] =
    useState(false);
  const [selectedGiornate, setSelecteGiornate] = useState([]);

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
  // useEffect(() => {
  //   const fetchSelectedCorsoData = async () => {
  //     try {
  //       const res = await axios.get(
  //         `http://localhost:5000/api/corsi/user-course/${selectedCourse}`,
  //         {
  //           headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
  //         }
  //       );
  //       setSelectedCorsoData(res.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  // fetchSelectedCorsoData();
  // }, [selectedCourse, render]);

  const handleDiscente = async (courseId) => {
    setSelectedCourse(courseId);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/corsi/user-course/${courseId}`,
        {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        }
      );
      setAllCourseDiscente(res.data?.course?.discente);
      setShowCourseDiscenteModal(true);
    } catch (err) {
      console.error('Error fetching instructors:', err);
    }
  };
  const handleProgressiveNumber = async (courseId) => {
    setSelectedCourse(courseId);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/corsi/user-course/${courseId}`,
        {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        }
      );
      setAllCourseProgressiveNumber(res.data);
      setShowCourseProgressiveModal(true);
    } catch (err) {
      console.error('Error fetching instructors:', err);
    }
  };

  useEffect(() => {
    if (render) {
      const handleProgressiveNumber = async (selectedCourse) => {
        setSelectedCourse(selectedCourse);
        try {
          const res = await axios.get(
            `http://localhost:5000/api/corsi/user-course/${selectedCourse}`,
            {
              headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
            }
          );
          setAllCourseProgressiveNumber(res.data);
          setShowCourseProgressiveModal(true);
        } catch (err) {
          console.error('Error fetching instructors:', err);
        }
      };
      handleProgressiveNumber();
    }
  }, [render]);

  const handleAllDiscente = async (courseId) => {
    setSelectedCourse(courseId);
    try {
      const res = await axios.get('http://localhost:5000/api/discenti/', {
        headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
      });
      setAllDiscente(res.data);
      setShowDiscenteModal(true);
    } catch (err) {
      console.error('Error fetching instructors:', err);
    }
  };

  const handleEndCourse = (courseId) => {
    if (!courseId) return;
    Swal.fire({
      title: 'Do you want to End the Course?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `http://localhost:5000/api/corsi/courses/${courseId}/status`,
            {
              status: 'end',
            },
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
            Swal.fire(err?.response?.data?.message, '', 'info');
          });
      }
    });
  };

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
  const handleEditQuantity = (id) => {
    setCourseId(id);
    setEditQuantityModal(true);
  };

  return (
    <div className='container mt-4'>
      <h2>Lista corso</h2>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>Città</th>
            <th>Via</th>
            <th>Type</th>
            <th>Numero Discenti</th>
            <th>Data creazione</th>
            <th>direttore </th>
            <th>Istruttori</th>
            <th>Giornate</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {corso?.filter(
            (item) =>
              item?.status == 'active' &&
              item?.isRefreshCourse !== true &&
              item?.isForInstructor !== true
          )?.length > 0 ? (
            corso
              .filter(
                (item) =>
                  item?.status == 'active' &&
                  item?.isRefreshCourse !== true &&
                  item?.isForInstructor !== true
              )
              .map((corsoItem) => (
                <tr key={corsoItem._id}>
                  <td>{corsoItem.città}</td>
                  <td>{corsoItem.via}</td>
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
                      onClick={() => handleAllDiscente(corsoItem._id)}
                    >
                      Assign Discente
                    </button>
                  </td>
                  <td>
                    <button
                      type='button'
                      className='btn btn-primary'
                      onClick={() => handleDiscente(corsoItem?._id)}
                    >
                      All Discente
                    </button>
                  </td>
                  <td>
                    <button
                      type='button'
                      className='btn btn-primary'
                      onClick={() => handleProgressiveNumber(corsoItem?._id)}
                    >
                      final course
                    </button>
                  </td>
                  <td>
                    <button
                      type='button'
                      className='btn btn-danger'
                      onClick={() => handleEndCourse(corsoItem?._id)}
                    >
                      End Course
                    </button>
                  </td>
                  <td>
                    <button
                      type='button'
                      className='btn btn-primary'
                      onClick={() => handleEditQuantity(corsoItem?._id)}
                    >
                      Add Quantity
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
      {showDiscenteModal && (
        <DiscenteModal
          setShowDiscenteModal={setShowDiscenteModal}
          alldiscente={allDiscente}
          selectedCorsoData={selectedCorsoData}
          selectedCourse={selectedCourse}
          setRender={setRender}
          render={render}
        />
      )}
      {showCourseDiscenteModal && (
        <CourseDiscenteModal
          setShowCourseDiscenteModal={setShowCourseDiscenteModal}
          allCoursediscente={allCourseDiscente}
          selectedCorsoData={selectedCorsoData}
          selectedCourse={selectedCourse}
          setRender={setRender}
          render={render}
        />
      )}
      {showCourseProgressiveModal && (
        <CourseProgressiveNumber
          setShowCourseDiscenteModal={setShowCourseProgressiveModal}
          allCoursediscente={allCourseProgressiveNumber}
          selectedCorsoData={selectedCorsoData}
          selectedCourse={selectedCourse}
          setRender={setRender}
          render={render}
        />
      )}
      {showGiornateModal && (
        <GiornateModal
          setShowGiornateModal={setShowGiornateModal}
          giornateDetails={selectedGiornate}
        />
      )}
      {editQuantityModal && (
        <EditQuantityModal
          editQuantityModal={setEditQuantityModal}
          id={courseId}
        />
      )}
    </div>
  );
}

export default ListaInstructorCourses;

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

const DiscenteModal = ({
  setShowDiscenteModal,
  alldiscente,
  selectedCourse,
  selectedCorsoData,
  setRender,
  render,
}) => {
  const handleAssignDiscente = (discenteId) => {
    if (!discenteId) return;
    Swal.fire({
      title: 'Do you want to save the changes?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            'http://localhost:5000/api/corsi/assign-discente',
            {
              courseId: selectedCourse,
              discenteId: discenteId,
            },
            {
              headers: {
                'x-auth-token': localStorage.getItem('token'),
              },
            }
          )
          .then((res) => {
            if (res?.status === 200) {
              Swal.fire('Saved!', '', 'success');
              setRender(!render);
              setShowDiscenteModal(false);
            } else {
              Swal.fire('Something went wrong', '', 'info');
            }
          })
          .catch((err) => {
            console.log('Error assigning sanitario:', err);
            Swal.fire(err?.response?.data?.error, '', 'info');
          });
      }
    });
  };
  return (
    <div className='modal modal-xl show d-block' tabIndex='-1'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Assign Discente Modal</h5>
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
                    <th>Nome</th>
                    <th>Cognome</th>
                    <th>E-Mail</th>
                    <th>Indirizzo</th>
                  </tr>
                </thead>
                <tbody>
                  {alldiscente?.length > 0 ? (
                    alldiscente
                      ?.filter(
                        (item) =>
                          !selectedCorsoData?.course?.discente?.some(
                            (descente) => descente._id === item._id
                          )
                      )
                      .map((discente, index) => (
                        <tr key={index}>
                          <td>{discente.nome}</td>
                          <td>{discente.cognome}</td>
                          <td>{discente.email}</td>
                          <td>{discente.indirizzo}</td>
                          <td>
                            <button
                              type='button'
                              className='btn btn-primary'
                              onClick={() =>
                                handleAssignDiscente(discente?._id)
                              }
                            >
                              Assign Discente
                            </button>
                          </td>
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
const CourseDiscenteModal = ({
  setShowCourseDiscenteModal,
  allCoursediscente,
  selectedCourse,
  setRender,
  render,
}) => {
  const handleDownloadDiscente = (discenteData) => {
    const doc = new jsPDF();
    doc.text('Discente List', 14, 10);

    const headers = [
      'Nome',
      'Cognome',
      'Codice Fiscale',
      'Indirizzo',
      'Città',
      'Regione',
      'Email',
      'Telefono',
    ];

    const bodyData = discenteData.map((discente) => [
      discente.nome,
      discente.cognome,
      discente.codiceFiscale,
      discente.indirizzo,
      discente.città,
      discente.regione,
      discente.email,
      discente.telefono,
    ]);

    doc.autoTable({
      head: [headers],
      body: bodyData,
      startY: 20,
    });
    doc.save('Discente_List.pdf');
  };

  const handleremoveDiscente = (discenteId) => {
    if (!discenteId) return;
    Swal.fire({
      title: 'Do you want to save the changes?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            'http://localhost:5000/api/corsi/remove-discente',
            {
              courseId: selectedCourse,
              discenteId: discenteId,
            },
            {
              headers: {
                'x-auth-token': localStorage.getItem('token'),
              },
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

  return (
    <div className='modal modal-xl show d-block' tabIndex='-1'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Assign Discente</h5>
            <button
              type='button'
              className='close'
              onClick={() => setShowCourseDiscenteModal(false)}
            >
              <span>&times;</span>
            </button>
          </div>
          <div className='d-flex align-items-center justify-content-end'>
            <button
              className='btn btn-primary'
              onClick={() => handleDownloadDiscente(allCoursediscente)}
            >
              Download
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
                  {allCoursediscente?.length > 0 ? (
                    allCoursediscente?.map((discente, index) => (
                      <tr key={index}>
                        <td>{discente?.nome}</td>
                        <td>{discente?.cognome}</td>
                        <td>{discente?.email}</td>
                        <td>{discente?.indirizzo}</td>
                        <td>
                          {' '}
                          <button
                            type='button'
                            className='btn btn-danger'
                            onClick={() => handleremoveDiscente(discente?._id)}
                          >
                            Remove Discente
                          </button>
                        </td>
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
const CourseProgressiveNumber = ({
  setShowCourseDiscenteModal,
  allCoursediscente,
  selectedCourse,
  setRender,
  render,
}) => {
  const [patentNumbers, setPatentNumbers] = useState({});
  console.log('patentNumbers: ', patentNumbers);

  const handleChangeValue = (discenteId, value) => {
    setPatentNumbers((prev) => ({
      ...prev,
      [discenteId]: value,
    }));
  };

  const handleAssignProgressiveNumber = (id, patentNumber) => {
    if (!id) return;
    Swal.fire({
      title: 'Do you want to save the changes?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `http://localhost:5000/api/discenti/${id}`,
            {
              patentNumber: patentNumber,
            },
            {
              headers: {
                'x-auth-token': localStorage.getItem('token'),
              },
            }
          )
          .then((res) => {
            console.log('res: ', res);
            if (res?.status === 200) {
              Swal.fire('Saved!', '', 'success');
              setRender(!render);
            } else {
              Swal.fire(res?.message, '', 'info');
            }
          })
          .catch((err) => {
            console.error('Error assigning sanitario:', err);
            Swal.fire(err?.response?.data?.message, '', 'info');
          });
      }
    });
  };

  return (
    <div className='modal modal-xl show d-block' tabIndex='-1'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Assign Progressive Number</h5>
            <button
              type='button'
              className='close'
              onClick={() => setShowCourseDiscenteModal(false)}
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
                    <th>patent Number</th>
                  </tr>
                </thead>
                <tbody>
                  {allCoursediscente?.course?.discente?.length > 0 ? (
                    allCoursediscente?.course?.discente?.map(
                      (discente, index) => (
                        <tr key={index}>
                          <td>{discente?.nome}</td>
                          <td>{discente?.cognome}</td>
                          <td>{discente?.email}</td>
                          <td>
                            {discente?.patentNumber?.length === 1 ? (
                              <p className=''>{discente.patentNumber[0]}</p>
                            ) : discente?.patentNumber?.length > 1 ? (
                              <>
                                <p className=''>{discente.patentNumber[0]}</p>
                                <p className=''>
                                  {
                                    discente.patentNumber[
                                      discente.patentNumber.length - 1
                                    ]
                                  }
                                </p>
                              </>
                            ) : null}
                          </td>
                          <td>
                            <select
                              className='form-select'
                              aria-label='Select Patent Number'
                              name='patentNumber'
                              value={patentNumbers[discente._id] || ''}
                              onChange={(e) =>
                                handleChangeValue(discente._id, e.target.value)
                              }
                            >
                              <option value=''>Select Patent Number</option>
                              {allCoursediscente?.progressiveNumbers?.map(
                                (option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                )
                              )}
                            </select>
                          </td>
                          <td>
                            <button
                              disabled={!patentNumbers[discente._id]}
                              type='button'
                              className='btn btn-primary'
                              onClick={() =>
                                handleAssignProgressiveNumber(
                                  discente?._id,
                                  patentNumbers[discente._id]
                                )
                              }
                            >
                              Assign kit Number
                            </button>
                          </td>
                        </tr>
                      )
                    )
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

const EditQuantityModal = ({ editQuantityModal, id }) => {
  const [value, setValue] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:5000/api/corsi/courses/add-quatity/${id}`,
        {
          numeroDiscenti: value,
        },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      Swal.fire('Course updated successfully!', '', 'success');
    } catch (error) {
      Swal.fire(error?.response?.data?.message, '', 'error');
    }
  };
  return (
    <div className='modal modal-xl show d-block' tabIndex='-1'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Edit Quantity</h5>
            <button
              type='button'
              className='close'
              onClick={() => editQuantityModal(false)}
            >
              <span>&times;</span>
            </button>
          </div>
          <div className='modal-body'>
            <form onSubmit={handleSubmit}>
              <div class='form-group'>
                <label for='exampleInputEmail1'>Add Quantity</label>
                <input
                  type='text'
                  class='form-control'
                  id='exampleInputEmail1'
                  aria-describedby='emailHelp'
                  placeholder='Add Quantity'
                  onChange={(e) => setValue(e.target.value)}
                  value={value}
                />
              </div>
              <button type='submit' class='btn btn-primary'>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

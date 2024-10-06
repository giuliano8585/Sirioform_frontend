import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const UnapprovedInstructors = () => {
  const navigate = useNavigate()
  const [instructors, setInstructors] = useState([]);
  const token = localStorage.getItem('token')
  const decodedToken = jwtDecode(token);
  const [showApproveConfirmModal , setShowApproveConfirmModal] = useState(false)


  useEffect(() => {
    const fetchUnapprovedInstructors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/instructors/unapproved');
        setInstructors(res.data);
      } catch (err) {
        console.error('Error fetching unapproved instructors:', err);
      }
    };

    fetchUnapprovedInstructors();
  }, []);

  const approveInstructor = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/instructors/approve/${id}`);
      setInstructors(instructors.filter(instructor => instructor._id !== id));
    } catch (err) {
      console.error('Error approving instructor:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Istruttori da Abilitare</h1>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor._id}>
                <td>{instructor.firstName}</td>
                <td>{instructor.lastName}</td>
                <td>{instructor.email}</td>
                <td>{instructor.phone}</td>
                <td>
                  <button className="btn btn-success mb-2" onClick={() =>setShowApproveConfirmModal(true)}>Approva</button>
                </td>
                {showApproveConfirmModal && (
                            <div
                              className='modal modal-xl show d-block'
                              tabIndex='-1'
                            >
                              <div className='modal-dialog'>
                                <div className='modal-content'>
                                  <div className='modal-header'>
                                    <h5 className='modal-title'>
                                      Confirm
                                    </h5>
                                    <button
                                      type='button'
                                      className='close'
                                      onClick={() =>
                                        setShowApproveConfirmModal(
                                          false
                                        )
                                      }
                                    >
                                      <span>&times;</span>
                                    </button>
                                  </div>
                                  <div className='modal-body'>
                                    <div className='table-responsive'>
                                      <p className='text-center'>
                                        are you sure want to Approve center
                                      </p>
                                      <div className='d-flex align-items-center justify-content-center gap-4'>
                                        <button
                                          onClick={() =>
                                            setShowApproveConfirmModal(
                                              false
                                            )
                                          }
                                          className='btn btn-info btn-sm'
                                        >
                                          No
                                        </button>
                                        <button
                                          onClick={() =>
                                            approveInstructor(instructor._id)
                                          }
                                          className='btn btn-primary btn-sm'
                                        >
                                          Yes
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="btn btn-primary"  onClick={() => navigate(decodedToken.user.role=='admin'?"/admin-dashboard":decodedToken.user.role=='center'?'/center-dashboard':'instructor-dashboard')}>Back</div>
    </div>
  );
};

export default UnapprovedInstructors;

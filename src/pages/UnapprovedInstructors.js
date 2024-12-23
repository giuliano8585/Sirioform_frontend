import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

const UnapprovedInstructors = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);

  useEffect(() => {
    const fetchUnapprovedInstructors = async () => {
      try {
        const res = await axios.get(
          'http://172.232.209.245/api/instructors/unapproved'
        );
        setInstructors(res.data.filter((item) => item?.role == 'instructor'));
      } catch (err) {
        console.error('Error fetching unapproved instructors:', err);
      }
    };

    fetchUnapprovedInstructors();
  }, []);

  const approveInstructor = async (id) => {
    Swal.fire({
      title: 'Do you want to Approve the Instructor?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://172.232.209.245/api/instructors/approve/${id}`)
          .then((res) => {
            if (res?.status === 200) {
              Swal.fire('Saved!', '', 'success');
              setInstructors(
                instructors.filter((instructor) => instructor._id !== id)
              );
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
    <div className='container mt-4'>
      <h1 className='mb-4'>Istruttori da Abilitare</h1>
      <div className='table-responsive'>
        <table className='table table-striped table-bordered'>
          <thead className='thead-dark'>
            <tr>
              <th>Nome</th>
              <th>Cognome</th>
              <th>brevet Number</th>
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
                <td>{instructor.brevetNumber}</td>
                <td>{instructor.email}</td>
                <td>{instructor.phone}</td>
                <td>
                  <button
                    className='btn btn-success mb-2'
                    onClick={() => approveInstructor(instructor._id)}
                  >
                    Approva
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className='btn btn-primary'
        onClick={() =>
          navigate(
            decodedToken.user.role == 'admin'
              ? '/admin-dashboard'
              : decodedToken.user.role == 'center'
              ? '/center-dashboard'
              : 'instructor-dashboard'
          )
        }
      >
        Back
      </div>
    </div>
  );
};

export default UnapprovedInstructors;

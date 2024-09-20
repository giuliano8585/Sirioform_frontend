import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UnapprovedInstructors = () => {
  const [instructors, setInstructors] = useState([]);

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
                  <button className="btn btn-success mb-2" onClick={() => approveInstructor(instructor._id)}>Approva</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnapprovedInstructors;

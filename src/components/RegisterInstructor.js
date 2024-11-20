import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

const RegisterInstructor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fiscalCode: '',
    brevetNumber: '',
    qualifications: [{ qualificationId: '', expirationDate: '' }],
    piva: '',
    address: '',
    city: '',
    region: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    repeatPassword: '',
  });

  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/;

  const validateForm = () => {
    const newErrors = {};
    for (const [key, value] of Object.entries(formData)) {
      if (key !== 'qualifications' && !value) {
        newErrors[key] = 'This field is required';
      }
    }

    if (formData.password && !passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must be at least 12 characters long and include uppercase, lowercase, a number, and a special character.';
    }

    if (
      formData.password &&
      formData.repeatPassword &&
      formData.password !== formData.repeatPassword
    ) {
      newErrors.repeatPassword = 'Passwords do not match';
    }

    // Validate qualifications
    formData.qualifications.forEach((qual, index) => {
      if (!qual.name || !qual.expirationDate) {
        newErrors[`qualifications-${index}`] =
          'All qualification fields are required.';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e, index, field) => {
    if (field === 'qualifications') {
      const newQualifications = [...formData.qualifications];
      newQualifications[index][e.target.name] = e.target.value;
      setFormData({ ...formData, qualifications: newQualifications });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: '' }));
  };
  const qualificationOptions = ['BLSK', 'BLS', 'BLSD'];

    const handleQualificationChange = (index, e) => {
    const newQualifications = [...formData.qualifications];
    newQualifications[index][e.target.name] = e.target.value;
    setFormData({ ...formData, qualifications: newQualifications });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`qualifications-${index}`]: '',
    }));
  };

  const handleRemoveQualification = (index) => {
    const updatedQualifications = formData.qualifications.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, qualifications: updatedQualifications });
  };

    const addQualification = () => {
    setFormData({
      ...formData,
      qualifications: [
        ...formData.qualifications,
        { name: '', expirationDate: '' },
      ],
    });
  };

  const selectedQualifications = formData.qualifications.map(q => q.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/instructors/register',
        {
          ...formData,
          recaptchaToken,
        }
      );
      setMessage('Registration successful! Check your email for confirmation.');
    } catch (err) {
      setMessage('Error in registration. Please try again.');
    }
  };

  const handleRecaptcha = (value) => {
    setRecaptchaToken(value);
  };

  const handleCloseModal = () => {
    if (
      message === 'Registration successful! Check your email for confirmation.'
    ) {
      navigate('/login');
    } else {
      setMessage('');
    }
  };

  return (
    <div className='container mt-5'>
      <h2 className='mb-4'>Register Instructor</h2>
      {message && (
        <div className='modal modal-xl show d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Registration Status</h5>
                <button
                  type='button'
                  className='close'
                  onClick={handleCloseModal}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <p className='text-center'>{message}</p>
                <div className='d-flex justify-content-center gap-4'>
                  <button
                    onClick={handleCloseModal}
                    className='btn btn-primary btn-sm'
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className='row'>
          {/* Render all fields except qualifications */}
          {Object.entries(formData).map(([key, value]) => {
            if (
              key === 'qualifications' ||
              key === 'password' ||
              key === 'repeatPassword'
            )
              return null;

            return (
              <div key={key} className='col-md-6 mb-3'>
                <label htmlFor={key} className='form-label'>
                  {key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <input
                  type={key === 'email' ? 'email' : 'text'}
                  className='form-control'
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  placeholder={key}
                />
                {errors[key] && (
                  <div className='text-danger'>{errors[key]}</div>
                )}
              </div>
            );
          })}

          {/* Password fields */}
          {['password', 'repeatPassword'].map((field) => (
            <div key={field} className='col-md-6 mb-3'>
              <label htmlFor={field} className='form-label'>
                {field === 'password' ? 'Password' : 'Repeat Password'}
              </label>
              <input
                type='password'
                className='form-control'
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field}
              />
              {errors[field] && (
                <div className='text-danger'>{errors[field]}</div>
              )}
            </div>
          ))}

          {/* Qualifications */}
          <div className='col-12 mb-3'>
            <h5>Qualifications</h5>
                      {formData.qualifications.map((qualification, index) => {
            const availableOptions = qualificationOptions.filter(
              (option) =>
                !selectedQualifications.includes(option) ||
                option === qualification.name
            );
            return (
              <>
                <div key={index} className='col-md-12 mb-3'>
                  <div className='row'>
                    <div className='col-md-5'>
                      <label
                        htmlFor={`qualification-name-${index}`}
                        className='form-label'
                      >
                        Qualification
                      </label>
                      <select
                        class='form-select'
                        aria-label='Default select example'
                        id={`qualification-name-${index}`}
                        name='name'
                        value={qualification.name}
                        onChange={(e) => handleQualificationChange(index, e)}
                        placeholder='Qualification'
                      >
                        <option selected>Select Qualification</option>
                        {availableOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='col-md-5'>
                      <label
                        htmlFor={`expirationDate-${index}`}
                        className='form-label'
                      >
                        Expiration Date
                      </label>
                      <input
                        type='date'
                        className='form-control'
                        id={`expirationDate-${index}`}
                        name='expirationDate'
                        value={qualification.expirationDate}
                        onChange={(e) => handleQualificationChange(index, e)}
                        required
                      />
                    </div>
                    <div className='col-md-2 d-flex align-items-end'>
                      <button
                        type='button'
                        className='btn btn-danger'
                        onClick={() => handleRemoveQualification(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  {errors[`qualifications-${index}`] && (
                  <div className='text-danger'>
                    {errors[`qualifications-${index}`]}
                  </div>
                )}
                </div>
              </>
            );
          })}
            <button
              type='button'
              className='btn btn-secondary'
              onClick={addQualification}
            >
              Add Qualification
            </button>
          </div>
        </div>

        <ReCAPTCHA
          sitekey='6LfhQhcqAAAAAHPx5jGmeyWyQLJIwLZwmbIk9iHp'
          onChange={handleRecaptcha}
        />
        <button type='submit' className='btn btn-primary mt-4'>
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterInstructor;

// import React, { useState } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import ReCAPTCHA from 'react-google-recaptcha';
// import { useNavigate } from 'react-router-dom';

// const RegisterInstructor = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     fiscalCode: '',
//     brevetNumber: '',
//     qualifications: [{ name: '', expirationDate: '' }],
//     piva: '',
//     address: '',
//     city: '',
//     region: '',
//     email: '',
//     phone: '',
//     username: '',
//     password: '',
//     repeatPassword: '',
//   });
//   const [recaptchaToken, setRecaptchaToken] = useState(null);
//   const [message, setMessage] = useState('');

//   const handleChange = (e, index, field) => {
//     if (field === 'qualifications') {
//       const newQualifications = [...formData.qualifications];
//       newQualifications[index][e.target.name] = e.target.value;
//       setFormData({ ...formData, qualifications: newQualifications });
//     } else {
//       setFormData({
//         ...formData,
//         [e.target.name]: e.target.value,
//       });
//     }
//   };

//   const qualificationOptions = ['BLSK', 'BLS', 'BLSD'];

//   const handleQualificationChange = (index, e) => {
//     const newQualifications = [...formData.qualifications];
//     newQualifications[index][e.target.name] = e.target.value;
//     setFormData({ ...formData, qualifications: newQualifications });
//   };

//   const handleAddQualification = () => {
//     setFormData({
//       ...formData,
//       qualifications: [
//         ...formData.qualifications,
//         { name: '', expirationDate: '' },
//       ],
//     });
//   };

//   const handleRemoveQualification = (index) => {
//     const newQualifications = formData.qualifications.filter(
//       (_, i) => i !== index
//     );
//     setFormData({ ...formData, qualifications: newQualifications });
//   };

//   const selectedQualifications = formData.qualifications.map(q => q.name);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const fiscalCodePattern =
//       /^[A-Z]{6}[0-9]{2}[A-EHLMPRST][0-9]{2}[A-Z][0-9]{3}[A-Z]$/;

//     if (!fiscalCodePattern.test(formData.fiscalCode)) {
//       alert('Invalid Fiscal Code');
//       return;
//     }

//     if (!recaptchaToken) {
//       alert('Please complete the reCAPTCHA');
//       return;
//     }

//     try {
//       const res = await axios.post(
//         'http://localhost:5000/api/instructors/register',
//         {
//           ...formData,
//           recaptchaToken,
//         }
//       );
//       console.log(res.data);
//       setMessage(
//         'Registrazione avvenuta con successo! Controlla la tua email per conferma.'
//       );
//     } catch (err) {
//       console.error(err.response.data);
//       setMessage('Errore nella registrazione. Riprova.');
//     }
//   };

//   const handleRecaptcha = (value) => {
//     setRecaptchaToken(value);
//   };
//   const handleCloseModal = (message) => {
//     message ==
//     'Registrazione avvenuta con successo! Controlla la tua email per conferma.'
//       ? navigate('/login')
//       : setMessage('');
//   };

//   return (
//     <div className='container mt-5'>
//       <h2 className='mb-4'>Register Instructor</h2>
//       {message && (
//         <div className='modal modal-xl show d-block' tabIndex='-1'>
//           <div className='modal-dialog'>
//             <div className='modal-content'>
//               <div className='modal-header'>
//                 <h5 className='modal-title'>Center Registered</h5>
//                 <button
//                   type='button'
//                   className='close'
//                   onClick={() => handleCloseModal(message)}
//                 >
//                   <span>&times;</span>
//                 </button>
//               </div>
//               <div className='modal-body'>
//                 <div className='table-responsive'>
//                   <p className='text-center'>{message}</p>
//                   <div className='d-flex align-items-center justify-content-center gap-4'>
//                     <button
//                       onClick={() => handleCloseModal(message)}
//                       className='btn btn-primary btn-sm'
//                     >
//                       Okay
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div className='row'>
//           <div className='col-md-6 mb-3'>
//             <label htmlFor='firstName' className='form-label'>
//               First Name
//             </label>
//             <input
//               type='text'
//               className='form-control'
//               id='firstName'
//               name='firstName'
//               value={formData.firstName}
//               onChange={handleChange}
//               placeholder='First Name'
//               required
//             />
//           </div>
//           <div className='col-md-6 mb-3'>
//             <label htmlFor='lastName' className='form-label'>
//               Last Name
//             </label>
//             <input
//               type='text'
//               className='form-control'
//               id='lastName'
//               name='lastName'
//               value={formData.lastName}
//               onChange={handleChange}
//               placeholder='Last Name'
//               required
//             />
//           </div>
//           <div className='col-md-6 mb-3'>
//             <label htmlFor='fiscalCode' className='form-label'>
//               Fiscal Code
//             </label>
//             <input
//               type='text'
//               className='form-control'
//               id='fiscalCode'
//               name='fiscalCode'
//               value={formData.fiscalCode}
//               onChange={handleChange}
//               placeholder='Fiscal Code'
//               pattern='^[A-Z]{6}[0-9]{2}[A-EHLMPRST][0-9]{2}[A-Z][0-9]{3}[A-Z]$'
//               required
//             />
//           </div>
//           <div className='col-md-6 mb-3'>
//             <label htmlFor='brevetNumber' className='form-label'>
//               Brevet Number
//             </label>
//             <input
//               type='text'
//               className='form-control'
//               id='brevetNumber'
//               name='brevetNumber'
//               value={formData.brevetNumber}
//               onChange={handleChange}
//               placeholder='Brevet Number'
//               required
//             />
//           </div>

//           {/* Qualification Fields */}
//           {formData.qualifications.map((qualification, index) => {
//             const availableOptions = qualificationOptions.filter(
//               (option) =>
//                 !selectedQualifications.includes(option) ||
//                 option === qualification.name
//             );
//             return (
//               <>
//                 <div key={index} className='col-md-12 mb-3'>
//                   <div className='row'>
//                     <div className='col-md-5'>
//                       <label
//                         htmlFor={`qualification-name-${index}`}
//                         className='form-label'
//                       >
//                         Qualification
//                       </label>
//                       <select
//                         class='form-select'
//                         aria-label='Default select example'
//                         id={`qualification-name-${index}`}
//                         name='name'
//                         value={qualification.name}
//                         onChange={(e) => handleQualificationChange(index, e)}
//                         placeholder='Qualification'
//                       >
//                         <option selected>Select Qualification</option>
//                         {availableOptions.map((option) => (
//                           <option key={option} value={option}>
//                             {option}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className='col-md-5'>
//                       <label
//                         htmlFor={`expirationDate-${index}`}
//                         className='form-label'
//                       >
//                         Expiration Date
//                       </label>
//                       <input
//                         type='date'
//                         className='form-control'
//                         id={`expirationDate-${index}`}
//                         name='expirationDate'
//                         value={qualification.expirationDate}
//                         onChange={(e) => handleQualificationChange(index, e)}
//                         required
//                       />
//                     </div>
//                     <div className='col-md-2 d-flex align-items-end'>
//                       <button
//                         type='button'
//                         className='btn btn-danger'
//                         onClick={() => handleRemoveQualification(index)}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             );
//           })}

//           <div className='col-md-12 mb-3 text-end'>
//             <button
//               type='button'
//               className='btn btn-secondary'
//               onClick={handleAddQualification}
//             >
//               Add Qualification
//             </button>
//           </div>

//           <div className='col-md-6 mb-3'>
//             <label htmlFor='piva' className='form-label'>
//               PIVA
//             </label>
//             <input
//               type='text'
//               className='form-control'
//               id='piva'
//               name='piva'
//               value={formData.piva}
//               onChange={handleChange}
//               placeholder='PIVA'
//               required
//             />
//           </div>
//           <div className='col-md-6 mb-3'>
//             <label htmlFor='address' className='form-label'>
//               Address
//             </label>
//             <input
//               type='text'
//               className='form-control'
//               id='address'
//               name='address'
//               value={formData.address}
//               onChange={handleChange}
//               placeholder='Address'
//               required
//             />
//           </div>
//           <div className='col-md-6 mb-3'>
//             <label htmlFor='city' className='form-label'>
//               City
//             </label>
//             <input
//               type='text'
//               className='form-control'
//               id='city'
//               name='city'
//               value={formData.city}
//               onChange={handleChange}
//               placeholder='City'
//               required
//             />
//           </div>
//           <div className='col-md-6 mb-3'>
//             <label htmlFor='region' className='form-label'>
//               Region
//             </label>
//             <input
//               type='text'
//               className='form-control'
//               id='region'
//               name='region'
//               value={formData.region}
//               onChange={handleChange}
//               placeholder='Region'
//               required
//             />
//           </div>
//           <div className='col-md-6 mb-3'>
//             <label htmlFor='email' className='form-label'>
//               Email
//             </label>
//             <input
//               type='email'
//               className='form-control'
//               id='email'
//               name='email'
//               value={formData.email}
//               onChange={handleChange}
//               placeholder='Email'
//               required
//             />
//           </div>
//           <div className='col-md-6 mb-3'>
//             <label htmlFor='phone' className='form-label'>
//               Phone
//             </label>
//             <input
//               type='text'
//               className='form-control'
//               id='phone'
//               name='phone'
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder='Phone'
//               required
//             />
//           </div>
//           <div className='col-md-6 mb-3'>
//             <label htmlFor='username' className='form-label'>
//               Username
//             </label>
//             <input
//               type='text'
//               className='form-control'
//               id='username'
//               name='username'
//               value={formData.username}
//               onChange={handleChange}
//               placeholder='Username'
//               required
//             />
//           </div>
//           <div className='col-md-6 mb-3'>
//             <label htmlFor='password' className='form-label'>
//               Password
//             </label>
//             <input
//               type='password'
//               className='form-control'
//               id='password'
//               name='password'
//               value={formData.password}
//               onChange={handleChange}
//               placeholder='Password'
//               required
//             />
//           </div>
//           <div className='col-md-6 mb-3'>
//             <label htmlFor='repeatPassword' className='form-label'>
//               Repeat Password
//             </label>
//             <input
//               type='password'
//               className='form-control'
//               id='repeatPassword'
//               name='repeatPassword'
//               value={formData.repeatPassword}
//               onChange={handleChange}
//               placeholder='Repeat Password'
//               required
//             />
//           </div>
//         </div>
//         <ReCAPTCHA
//           sitekey='6LfhQhcqAAAAAHPx5jGmeyWyQLJIwLZwmbIk9iHp'
//           onChange={handleRecaptcha}
//         />
//         <button type='submit' className='btn btn-primary mt-4'>
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RegisterInstructor;

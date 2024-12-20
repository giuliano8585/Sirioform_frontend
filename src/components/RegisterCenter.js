import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

const RegisterCenter = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
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
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error for that field
    setMessage('');
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
      }
    });

    // Password validation
    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password =
        'Password must be at least 12 characters long, with a mix of uppercase, lowercase, numbers, and special characters';
    }

    // Repeat password validation
    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop form submission if there are errors
    }

    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA');
      return;
    }

    try {
      const res = await axios.post(
        'http://18.171.180.225/api/centers/register',
        {
          ...formData,
          recaptchaToken,
        }
      );
      console.log(res.data);
      setMessage(
        'Registrazione avvenuta con successo! Controlla la tua email per conferma.'
      );
    } catch (err) {
      console.error('Error response:', err.response.data);
      setMessage('Errore nella registrazione. Riprova.');
    }
  };

  const handleRecaptcha = (value) => {
    setRecaptchaToken(value);
  };

  const handleCloseModal = (message) => {
    message ===
    'Registrazione avvenuta con successo! Controlla la tua email per conferma.'
      ? navigate('/login')
      : setMessage('');
  };

  return (
    <div className='container mt-5'>
      <h2 className='mb-4'>Register Center</h2>
      {message && (
        <div className='modal modal-xl show d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Center Registered</h5>
                <button
                  type='button'
                  className='close'
                  onClick={() => handleCloseModal(message)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <div className='table-responsive'>
                  <p className='text-center'>{message}</p>
                  <div className='d-flex align-items-center justify-content-center gap-4'>
                    <button
                      onClick={() => handleCloseModal(message)}
                      className='btn btn-primary btn-sm'
                    >
                      Okay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'P. IVA', name: 'piva', type: 'text' },
          { label: 'Address', name: 'address', type: 'text' },
          { label: 'City', name: 'city', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Phone', name: 'phone', type: 'text' },
          { label: 'Username', name: 'username', type: 'text' },
        ].map(({ label, name, type }) => (
          <div className='mb-3' key={name}>
            <label htmlFor={name} className='form-label'>
              {label}
            </label>
            <input
              type={type}
              className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={label}
            />
            {errors[name] && (
              <div className='invalid-feedback'>{errors[name]}</div>
            )}
          </div>
        ))}

        <div className='mb-3'>
          <label htmlFor='region' className='form-label'>
            Region
          </label>
          <select
            className={`form-select ${errors.region ? 'is-invalid' : ''}`}
            id='region'
            name='region'
            value={formData.region}
            onChange={handleChange}
          >
            <option selected>Select</option>
            <option value='ABRUZZO'>ABRUZZO</option>
            <option value='BASILICATA'>BASILICATA</option>
            <option value='CALABRIA'>CALABRIA</option>
            <option value='CAMPANIA'>CAMPANIA</option>
            <option value='EMILIA-ROMAGNA'>EMILIA-ROMAGNA</option>
            <option value='FRIULI-VENEZIA GIULIA'>FRIULI-VENEZIA GIULIA</option>
            <option value='LAZIO'>LAZIO</option>
            <option value='LIGURIA'>LIGURIA</option>
            <option value='LOMBARDIA'>LOMBARDIA</option>
            <option value='MARCHE'>MARCHE</option>
            <option value='MOLISE'>MOLISE</option>
            <option value='PIEMONTE'>PIEMONTE</option>
            <option value='PUGLIA'>PUGLIA</option>
            <option value='SARDEGNA'>SARDEGNA</option>
            <option value='SICILIA'>SICILIA</option>
            <option value='TOSCANA'>TOSCANA</option>
            <option value='TRENTINO-ALTO ADIGE'>TRENTINO-ALTO ADIGE</option>
            <option value='UMBRIA'>UMBRIA</option>
            <option value="VALLE D'AOSTA">VALLE D'AOSTA</option>
            <option value='VENETO'>VENETO</option>
          </select>
          {errors.region && (
            <div className='invalid-feedback'>{errors.region}</div>
          )}
        </div>

        <div className='mb-3'>
          <label htmlFor='password' className='form-label'>
            Password
          </label>
          <input
            type='password'
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
          />
          {errors.password && (
            <div className='invalid-feedback'>{errors.password}</div>
          )}
        </div>

        <div className='mb-3'>
          <label htmlFor='repeatPassword' className='form-label'>
            Repeat Password
          </label>
          <input
            type='password'
            className={`form-control ${
              errors.repeatPassword ? 'is-invalid' : ''
            }`}
            id='repeatPassword'
            name='repeatPassword'
            value={formData.repeatPassword}
            onChange={handleChange}
            placeholder='Repeat Password'
          />
          {errors.repeatPassword && (
            <div className='invalid-feedback'>{errors.repeatPassword}</div>
          )}
        </div>

        <ReCAPTCHA
          sitekey='6LfhQhcqAAAAAHPx5jGmeyWyQLJIwLZwmbIk9iHp'
          onChange={handleRecaptcha}
        />

        <button type='submit' className='btn btn-primary mt-3'>
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterCenter;

// import React, { useState } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import ReCAPTCHA from 'react-google-recaptcha';
// import { useNavigate } from 'react-router-dom';

// const RegisterCenter = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
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

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setMessage('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!recaptchaToken) {
//       alert('Please complete the reCAPTCHA');
//       return;
//     }

//     try {
//       const res = await axios.post(
//         'http://18.171.180.225/api/centers/register',
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
//       console.error('Error response:', err.response.data);
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
//       <h2 className='mb-4'>Register Center</h2>
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
//         <div className='mb-3'>
//           <label htmlFor='name' className='form-label'>
//             Name
//           </label>
//           <input
//             type='text'
//             className='form-control'
//             id='name'
//             name='name'
//             value={formData.name}
//             onChange={handleChange}
//             placeholder='Name'
//             required
//           />
//         </div>
//         <div className='mb-3'>
//           <label htmlFor='piva' className='form-label'>
//             P. IVA
//           </label>
//           <input
//             type='text'
//             className='form-control'
//             id='piva'
//             name='piva'
//             value={formData.piva}
//             onChange={handleChange}
//             placeholder='P. IVA'
//             required
//           />
//         </div>
//         <div className='mb-3'>
//           <label htmlFor='address' className='form-label'>
//             Address
//           </label>
//           <input
//             type='text'
//             className='form-control'
//             id='address'
//             name='address'
//             value={formData.address}
//             onChange={handleChange}
//             placeholder='Address'
//             required
//           />
//         </div>
//         <div className='mb-3'>
//           <label htmlFor='city' className='form-label'>
//             City
//           </label>
//           <input
//             type='text'
//             className='form-control'
//             id='city'
//             name='city'
//             value={formData.city}
//             onChange={handleChange}
//             placeholder='City'
//             required
//           />
//         </div>
//         <div className='mb-3'>
//           <label htmlFor='region' className='form-label'>
//             Region
//           </label>
//           <select
//             type='text'
//             className='form-select'
//             id='region'
//             name='region'
//             value={formData.region}
//             onChange={handleChange}
//             placeholder='Region'
//             required
//           >
//             <option selected>select</option>
//             <option value="ABRUZZO">ABRUZZO</option>
//             <option value="BASILICATA">BASILICATA</option>
//             <option value="CALABRIA">CALABRIA</option>
//             <option value="CAMPANIA">CAMPANIA</option>
//             <option value="EMILIA-ROMAGNA">EMILIA-ROMAGNA</option>
//             <option value="FRIULI-VENEZIA GIULIA">FRIULI-VENEZIA GIULIA</option>
//             <option value="LAZIO">LAZIO</option>
//             <option value="LIGURIA">LIGURIA</option>
//             <option value="LOMBARDIA">LOMBARDIA</option>
//             <option value="MARCHE">MARCHE</option>
//             <option value="MOLISE">MOLISE</option>
//             <option value="PIEMONTE">PIEMONTE</option>
//             <option value="PUGLIA">PUGLIA</option>
//             <option value="SARDEGNA">SARDEGNA</option>
//             <option value="SICILIA">SICILIA</option>
//             <option value="TOSCANA">TOSCANA</option>
//             <option value="TRENTINO-ALTO ADIGE">TRENTINO-ALTO ADIGE</option>
//             <option value="UMBRIA">UMBRIA</option>
//             <option value="VALLE D'AOSTA">VALLE D'AOSTA</option>
//             <option value="VENETO">VENETO</option>
//           </select>
//         </div>
//         <div className='mb-3'>
//           <label htmlFor='email' className='form-label'>
//             Email
//           </label>
//           <input
//             type='email'
//             className='form-control'
//             id='email'
//             name='email'
//             value={formData.email}
//             onChange={handleChange}
//             placeholder='Email'
//             required
//           />
//         </div>
//         <div className='mb-3'>
//           <label htmlFor='phone' className='form-label'>
//             Phone
//           </label>
//           <input
//             type='text'
//             className='form-control'
//             id='phone'
//             name='phone'
//             value={formData.phone}
//             onChange={handleChange}
//             placeholder='Phone'
//             required
//           />
//         </div>
//         <div className='mb-3'>
//           <label htmlFor='username' className='form-label'>
//             Username
//           </label>
//           <input
//             type='text'
//             className='form-control'
//             id='username'
//             name='username'
//             value={formData.username}
//             onChange={handleChange}
//             placeholder='Username'
//             required
//           />
//         </div>
//         <div className='mb-3'>
//           <label htmlFor='password' className='form-label'>
//             Password
//           </label>
//           <input
//             type='password'
//             className='form-control'
//             id='password'
//             name='password'
//             value={formData.password}
//             onChange={handleChange}
//             placeholder='Password'
//             required
//           />
//         </div>
//         <div className='mb-3'>
//           <label htmlFor='repeatPassword' className='form-label'>
//             Repeat Password
//           </label>
//           <input
//             type='password'
//             className='form-control'
//             id='repeatPassword'
//             name='repeatPassword'
//             value={formData.repeatPassword}
//             onChange={handleChange}
//             placeholder='Repeat Password'
//             required
//           />
//         </div>
//         <ReCAPTCHA
//           sitekey='6LfhQhcqAAAAAHPx5jGmeyWyQLJIwLZwmbIk9iHp' // Sostituisci con la tua Site Key
//           onChange={handleRecaptcha}
//         />
//         <button type='submit' className='btn btn-primary mt-3'>
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RegisterCenter;

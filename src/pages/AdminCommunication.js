import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AdminCommunication = () => {
  const [id, setId] = useState(null);
  const [commincation, setCommincation] = useState(null);
  const [title, setTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [render, setRender] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const response = (await isUpdate)
        ? axios.patch(
            `http://172.232.209.245/api/communication/${id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'x-auth-token': `${localStorage.getItem('token')}`,
              },
            }
          )
        : axios?.post('http://172.232.209.245/api/communication', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'x-auth-token': `${localStorage.getItem('token')}`,
            },
          });
      alert('Data submitted successfully!');
      console.log(response.data);
      setTitle('');
      setDescription('');
      setImage(null);
      setRender(!render);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  useEffect(() => {
    const fetchCommunication = async (e) => {
      try {
        const response = await axios.get(
          'http://172.232.209.245/api/communication',
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'x-auth-token': `${localStorage.getItem('token')}`,
            },
          }
        );
        setCommincation(response?.data);
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    };
    fetchCommunication();
  }, [render]);

  const handleUpdate = (data) => {
    setId(data?._id);
    setTitle(data?.title);
    setDescription(data?.description);
    setImage(data?.imageUrl);
    setShowModal(true);
    setIsUpdate(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure want to Delete the Communication?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://172.232.209.245/api/communication/${id}`, {
            headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
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
            console.error('Error Deleting communiction', err);
            Swal.fire('Something went wrong', '', 'info');
          });
      }
    });
  };

  return (
    <div className='container mt-5'>
      <div className='d-flex justify-content-end'>
        <button
          type='button'
          className='btn btn-primary ms-auto '
          onClick={() => setShowModal(true)}
        >
          Create Communication
        </button>
      </div>
      <div className=''>
        <h2>Communications</h2>
        <div className='p-4'>
          {commincation?.map((data) => (
            <div className='p-3 border m-2'>
              <div className='d-flex justify-content-end gap-1'>
                <button
                  type='button'
                  className='btn btn-info '
                  onClick={() => handleUpdate(data)}
                >
                  Update Communication
                </button>
                <button
                  type='button'
                  className='btn btn-danger '
                  onClick={() => handleDelete(data?._id)}
                >
                  Delete Communication
                </button>
              </div>
              <img
                className='h-12 w-6'
                style={{
                  maxWidth: '600px',
                  height: '300px',
                  objectFit: 'cover',
                }}
                src={'http://172.232.209.245' + data?.imageUrl}
                alt=''
              />
              <h2>{data?.title}</h2>
              <p>{data?.description}</p>
              <small>{data?.createdAt?.split('T')[0]}</small>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className='modal modal-xl show d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Sanitari Associati</h5>
                <button
                  type='button'
                  className='close'
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <h2>Create Communication</h2>
                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                  <div className='mb-3'>
                    <label htmlFor='title' className='form-label'>
                      Title
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='title'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='description' className='form-label'>
                      Description
                    </label>
                    <textarea
                      className='form-control'
                      id='description'
                      rows='3'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='image' className='form-label'>
                      Image Upload
                    </label>
                    <input
                      type='file'
                      className='form-control'
                      id='image'
                      onChange={handleImageChange}
                    />
                  </div>
                  <button type='submit' className='btn btn-primary'>
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        type='button'
        className='btn btn-primary ms-auto '
        onClick={() => navigate('/admin-dashboard')}
      >
        back
      </button>
    </div>
  );
};

export default AdminCommunication;

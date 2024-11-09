import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminRefreshKit() {
  const [products, setProducts] = useState([]);
  const [showApproveConfirmModal , setShowApproveConfirmModal] = useState(false)
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(''); // 'edit' or 'delete'
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    code: '',
    type: '',
    description: '',
    cost1: '',
    cost2: '',
    cost3: '',
    profileImage: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/kits', {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        });
        setProducts(res.data);

        const initialQuantities = {};
        res.data.forEach((product) => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: value,
    });
  };

  const calculatePrice = (product, quantity) => {
    if (quantity <= 10) {
      return product.cost1;
    } else if (quantity <= 20) {
      return product.cost2;
    } else {
      return product.cost3;
    }
  };

  const handlePurchase = (productId, productName) => {
    const quantity = quantities[productId] || 1;
    navigate('/payment', {
      state: {
        productName: productName,
        productId: productId,
        quantity: quantity,
        totalPrice: calculatePrice(
          products.find((p) => p._id === productId),
          quantity
        ),
      },
    });
  };

  const handleShowModal = (product, type) => {
    setSelectedProduct(product);
    setModalType(type);
    if (type === 'edit') {
      setEditData({
        code: product.code,
        type: product.type,
        description: product.description,
        cost1: product.cost1,
        cost2: product.cost2,
        cost3: product.cost3,
        profileImage: null, // Reset file input
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setModalType('');
    setEditData({
      code: '',
      type: '',
      description: '',
      cost1: '',
      cost2: '',
      cost3: '',
      profileImage: null,
    });
  };

  // Handle Edit Form Changes
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditFileChange = (e) => {
    setEditData({ ...editData, profileImage: e.target.files[0] });
  };

  // Handle Update (Edit)
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('code', editData.code);
    formData.append('type', editData.type);
    formData.append('description', editData.description);
    formData.append('cost1', editData.cost1);
    formData.append('cost2', editData.cost2);
    formData.append('cost3', editData.cost3);

    if (editData.profileImage) {
      formData.append('profileImage', editData.profileImage);
    }

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/kits/${selectedProduct._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': `${localStorage.getItem('token')}`,
          },
        }
      );
      // Update products state
      setProducts(
        products.map((prod) =>
          prod._id === selectedProduct._id ? res.data : prod
        )
      );
      alert('Kit aggiornato con successo!');
      handleCloseModal();
      setShowApproveConfirmModal(false)
    } catch (err) {
      console.error(err);
      alert('Errore nell\'aggiornamento del kit.');
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/kits/${selectedProduct._id}`, {
        headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
      });
      // Remove from products state
      setProducts(products.filter((prod) => prod._id !== selectedProduct._id));
      alert('Kit eliminato con successo!');
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert('Errore nell\'eliminazione del kit.');
    }
  };

  return (
    <div className='container mt-4'>
      <h2>Acquista Refersh Kit</h2>
      <div className='row'>
        {Array.isArray(products) && products?.filter((items)=>items?.isRefreshKit==true)?.length > 0 ? (
          products?.filter((items)=>items?.isRefreshKit==true&&items?.isForInstructor!==true).map((product) => (
            <div key={product._id} className='col-md-4 mb-4'>
              <div className='card h-100'>
                <div className='card-body d-flex flex-column'>
                  <img
                    src={`http://localhost:5000/${product?.profileImage}`}
                    alt={product.type}
                    className='img-fluid mb-3'
                  />
                  <h5 className='card-title'>{product.code}</h5>
                  <h5 className='card-title'>{product.type}</h5>
                  <p className='card-text'>{product.description}</p>
                  <p className='card-text'>
                    <strong>
                      €{calculatePrice(product, quantities[product._id] || 1)}
                    </strong>
                  </p>
                  <input
                    type='number'
                    min='1'
                    value={quantities[product._id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(
                        product._id,
                        parseInt(e.target.value)
                      )
                    }
                    className='form-control mb-3'
                  />
                  <button
                    onClick={() => handlePurchase(product?._id, product?.type)}
                    className='btn btn-primary mt-auto mb-2'
                  >
                    Acquista
                  </button>
                  <div className='d-flex justify-content-between'>
                    <button
                      type='button'
                      className='btn btn-warning'
                      onClick={() => handleShowModal(product, 'edit')}
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      className='btn btn-danger'
                      onClick={() => handleShowModal(product, 'delete')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='text-muted'>Nessun prodotto disponibile.</p>
        )}
      </div>
      <button className='btn btn-secondary mt-4' onClick={() => navigate(-1)}>
        Torna alla Dashboard
      </button>

      {/* Modal */}
      {showModal && selectedProduct && (
        <div
          className='modal fade show d-block'
          tabIndex='-1'
          role='dialog'
          aria-labelledby='modalTitle'
          aria-hidden='true'
        >
          <div
            className='modal-dialog modal-dialog-centered modal-lg'
            role='document'
          >
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title' id='modalTitle'>
                  {modalType === 'edit' ? 'Modifica Kit' : 'Elimina Kit'}
                </h5>
                <button
                  type='button'
                  className='close'
                  onClick={handleCloseModal}
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                {modalType === 'edit' && (
                  <form  encType="multipart/form-data">
                    <div className='form-group mb-3'>
                      <label htmlFor='code'>Codice Kit</label>
                      <input
                        id='code'
                        name='code'
                        value={editData.code}
                        onChange={handleEditChange}
                        className='form-control'
                        placeholder='Codice Kit'
                        required
                      />
                    </div>
                    <div className='form-group mb-3'>
                      <label htmlFor='type'>Tipologia</label>
                      <input
                        id='type'
                        name='type'
                        value={editData.type}
                        onChange={handleEditChange}
                        className='form-control'
                        placeholder='Tipologia'
                        required
                      />
                    </div>
                    <div className='form-group mb-3'>
                      <label htmlFor='description'>Descrizione</label>
                      <input
                        id='description'
                        name='description'
                        value={editData.description}
                        onChange={handleEditChange}
                        className='form-control'
                        placeholder='Descrizione'
                        required
                      />
                    </div>
                    <div className='form-group mb-3'>
                      <label htmlFor='cost1'>Costo 1</label>
                      <input
                        id='cost1'
                        name='cost1'
                        type='number'
                        value={editData.cost1}
                        onChange={handleEditChange}
                        className='form-control'
                        placeholder='Costo 1'
                        required
                      />
                    </div>
                    <div className='form-group mb-3'>
                      <label htmlFor='cost2'>Costo 2</label>
                      <input
                        id='cost2'
                        name='cost2'
                        type='number'
                        value={editData.cost2}
                        onChange={handleEditChange}
                        className='form-control'
                        placeholder='Costo 2'
                        required
                      />
                    </div>
                    <div className='form-group mb-3'>
                      <label htmlFor='cost3'>Costo 3</label>
                      <input
                        id='cost3'
                        name='cost3'
                        type='number'
                        value={editData.cost3}
                        onChange={handleEditChange}
                        className='form-control'
                        placeholder='Costo 3'
                        required
                      />
                    </div>
                    <div className='form-group mb-3'>
                      <label className='form-label' htmlFor='editProfileImage'>
                        Upload New Profile Image
                      </label>
                      <input
                        type='file'
                        className='form-control'
                        id='editProfileImage'
                        onChange={handleEditFileChange}
                        accept="image/*"
                      />
                    </div>
                    <button onClick={()=>setShowApproveConfirmModal(true)} type='button' className='btn btn-primary me-2'>
                      Aggiorna
                    </button>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      onClick={handleCloseModal}
                    >
                      Annulla
                    </button>
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
                                        are you sure want to Edit Kit
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
                                          onClick={handleUpdate}
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
                  </form>
                )}
                {modalType === 'delete' && (
                  <div>
                    <p>Sei sicuro di voler eliminare il kit <strong>{selectedProduct.type}</strong>?</p>
                  </div>
                )}
              </div>
              <div className='modal-footer'>
                {modalType === 'delete' && (
                  <>
                    <button
                      type='button'
                      className='btn btn-danger'
                      onClick={handleDelete}
                    >
                      Elimina
                    </button>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      onClick={handleCloseModal}
                    >
                      Annulla
                    </button>
                  </>
                )}
                {/* For edit modal, buttons are inside the form */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRefreshKit;

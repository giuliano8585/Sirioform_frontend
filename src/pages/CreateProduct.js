import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function CreateProduct() {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price1: '',
    price2: '',
    price3: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://172.232.209.245/api/products',
        product,
        {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='container'>
      <h2 className='my-4'>Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='form-label'>Title</label>
          <input
            type='text'
            className='form-control'
            value={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Description</label>
          <textarea
            className='form-control'
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          ></textarea>
        </div>
        <div className='mb-3'>
          <label className='form-label'>Price 1</label>
          <input
            type='number'
            className='form-control'
            value={product.price1}
            onChange={(e) => setProduct({ ...product, price1: e.target.value })}
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Price 2</label>
          <input
            type='number'
            className='form-control'
            value={product.price2}
            onChange={(e) => setProduct({ ...product, price2: e.target.value })}
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Price 3</label>
          <input
            type='number'
            className='form-control'
            value={product.price3}
            onChange={(e) => setProduct({ ...product, price3: e.target.value })}
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Create Product
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;

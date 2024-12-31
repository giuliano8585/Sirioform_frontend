import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate()
  return (
    <div className="container">
      <div className="jumbotron mt-4">
        <h1 className="display-4">Welcome to the Product Order System!</h1>
        <p className="lead">This is a simple product ordering system built with React and Node.js.</p>
        <hr className="my-4" />
        <p>Login to start managing your orders and products.</p>
        <button onClick={()=>navigate('/login')} className="btn btn-primary btn-lg" href="" role="button">Login</button>
        <button onClick={()=>navigate('/register-center')} className="btn btn-success btn-lg ml-3" role="button">Register Center</button>
        <button onClick={()=>navigate('/register-instructor')} className="btn btn-success btn-lg ml-3" role="button">Register Instructor</button>
      </div>
    </div>
  );
}

export default Home;

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  return (
    <div className="container">
      <div className="jumbotron mt-4">
        <h1 className="display-4">Welcome to the Product Order System!</h1>
        <p className="lead">This is a simple product ordering system built with React and Node.js.</p>
        <hr className="my-4" />
        <p>Login to start managing your orders and products.</p>
        <a className="btn btn-primary btn-lg" href="/login" role="button">Login</a>
        <a className="btn btn-success btn-lg ml-3" href="/register" role="button">Register</a>
      </div>
    </div>
  );
}

export default Home;

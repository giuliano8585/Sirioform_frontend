import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterCenter from './components/RegisterCenter';
import RegisterInstructor from './components/RegisterInstructor';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ProtectedComponent from './components/ProtectedComponent';
import CentersList from './components/CenterList';
import InstructorsList from './components/InstructorList';
import InstructorDashboard from './pages/InstructorDashboard';
import CenterDashboard from './pages/CenterDashboard';
import CreateKit from './components/CreateKit';
import ViewKits from './components/ViewKits';
import UnapprovedCenters from './pages/UnapprovedCenters';
import UnapprovedInstructors from './pages/UnapprovedInstructors';
import CreateSanitario from './pages/CreateSanitario';
import ListaSanitari from './pages/ListaSanitari';
import CenterSanitarios from './pages/CenterSanitarios';
import ViewSanitarios from './components/ViewSanitarios';
import ViewInstructorSanitarios from './components/ViewInstructorSanitarios';
import ViewInstructors from './pages/ViewInstructors'; // Assicurati di importare la nuova pagina
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import ProductManagement from './pages/ProductManagement'
import OrderManagement from './pages/OrderManagement'
import CreateProduct from './pages/CreateProduct'
import AdminOrders from './pages/AdminOrders'
import CreateDiscente from './pages/CreateDiscente'
import ListaDiscentiPage from './pages/ListaDiscentiPage'
import ProductsPage from './pages/ProductsPage'
import OrdersPage from './pages/OrdersPage'
import Store from './pages/Store'
import StoreDetails from './pages/StoreDetails'
import CreateCorso from './pages/CreateCorso'


const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/register-center" element={<RegisterCenter />} />
        <Route path="/register-instructor" element={<RegisterInstructor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<ProtectedComponent />} />
        <Route path="/centers-list" element={<CentersList />} />
        <Route path="/instructors-list" element={<InstructorsList />} />
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route path="/center-dashboard" element={<CenterDashboard />} />
        <Route path="/create-kit" element={<CreateKit />} />
        <Route path="/view-kits" element={<ViewKits />} />
        <Route path="/unapproved-centers" element={<UnapprovedCenters />} />
        <Route path="/unapproved-instructors" element={<UnapprovedInstructors />} />
        <Route path="/create-sanitario" element={<CreateSanitario />} />
        <Route path="/sanitarios-list" element={<ListaSanitari />} />
        <Route path="/center-sanitarios" element={<CenterSanitarios />} />
        <Route path="/view-sanitarios" element={<ViewSanitarios />} />
        <Route path="/view-instructor-sanitarios" element={<ViewInstructorSanitarios />} />
        <Route path="/center/view-instructors" element={<ViewInstructors />} /> 
        <Route path="/instructor/view-sanitarios" element={<ViewSanitarios />} />

        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        <Route path="/payment" element={<Checkout />} />
        <Route path="/admin/products" element={<ProductManagement />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
        <Route path="/admin/create-product" element={<CreateProduct />} />
        <Route path="/admin/all-orders" element={<AdminOrders />} />
        <Route path="/create-discente" element={<CreateDiscente />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/lista-discenti" element={<ListaDiscentiPage />} />
        <Route path="/create-corso" element={<CreateCorso />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/:productId" element={<StoreDetails />} /> 
      </Routes>
    </Router>
  );
};

export default App;


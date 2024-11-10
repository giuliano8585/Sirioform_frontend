import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
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
import UnapprovedCenters from './pages/UnapprovedCenters';
import UnapprovedInstructors from './pages/UnapprovedInstructors';
import CreateSanitario from './pages/CreateSanitario';
import ListaSanitari from './pages/ListaSanitari';
import CenterSanitarios from './pages/CenterSanitarios';
import ViewSanitarios from './components/ViewSanitarios';
import ViewInstructorSanitarios from './components/ViewInstructorSanitarios';
import ViewInstructors from './pages/ViewInstructors'; // Assicurati di importare la nuova pagina
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import ProductManagement from './pages/ProductManagement';
import OrderManagement from './pages/OrderManagement';
import CreateProduct from './pages/CreateProduct';
import AdminOrders from './pages/AdminOrders';
import CreateDiscente from './pages/CreateDiscente';
import ListaDiscentiPage from './pages/ListaDiscentiPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import Store from './pages/Store';
import StoreDetails from './pages/StoreDetails';
import CreateCorso from './pages/CreateCorso';
import ViewProfile from './pages/ViewProfile';
import ListaCorso from './pages/ListaCorso';
import AdminListaCorso from './pages/AdminListaCorso';
import Navbar from './components/Navbar';
import { jwtDecode } from 'jwt-decode';
import UpdateCenter from './pages/UpdateCenter';
import UpdateInstructor from './pages/UpdateInstructor';
import AdminProductsPage from './pages/AdminProductPage';
import AdminUnActiveCourses from './pages/AdminUnActiveCourses';
import AdminAllDiscente from './pages/AdminAllDiscente';
import AdminUpdateCenter from './pages/AdminUpdateCenter';
import AdminUpdateInstructor from './pages/AdminUpdateInstructor';
import UpdateDiscente from './pages/UpdateDiscente';
import UnActiveCourse from './pages/UnActiveCourse';
import RrefreshKit from './pages/RefreshKit';
import AdminRefreshKit from './pages/AdminRefreshKit';
import CreateRefreshCourse from './pages/CreateRefreshCourse';
import ListaRefreshCourse from './pages/ListaRefreshCourse';
import UnActiveRefreshCourse from './pages/UnActiveRefreshCourse';
import AdminListaRefreshCourse from './pages/AdminListaRefreshCourse';
import AdminUnActiveRefreshCourse from './pages/AdminUnActiveRefreshCourse';
import UpdateCorso from './pages/UpdateCorso';
import AdminEndCourse from './pages/AdminEndCourse';
import AdminCompleteCourse from './pages/AdminCompleteCourse';
import FinishCourses from './pages/FinishCourses';
import CompleteCourses from './pages/CompleteCourses';
import SiriformDashboard from './pages/SiriformDashboard';
import AdminCreateInstructorKit from './pages/AdminCreateInstructorKit';
import AdminViewInstructorKit from './pages/AdminViewInstructorKit';
import AdminViewInstructorRefreshKit from './pages/AdminViewInstructorRefreshKit';
import CreateInstructorCourse from './pages/CreateInstructorCourse';
import CreateInstructorRefreshCourse from './pages/CreateInstructorRefreshCourse';
import ListaInstructorCourses from './pages/ListaInstructorCourses';
import ListaInstructorRefreshCourses from './pages/ListaInstructorRefreshCourses';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register-center' element={<RegisterCenter />} />
          <Route path='/register-instructor' element={<RegisterInstructor />} />
          <Route path='/login' element={<Login />} />
          <Route
            path='/admin-dashboard'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/center-dashboard'
            element={
              <ProtectedRoute allowedRoles={['center']}>
                <CenterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/siriform'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SiriformDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/instructor-dashboard'
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/centers-list'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CentersList />
              </ProtectedRoute>
            }
          />
          <Route
            path='/instructors-list'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <InstructorsList />
              </ProtectedRoute>
            }
          />
          <Route
            path='/create-kit'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateKit />
              </ProtectedRoute>
            }
          />
          <Route
            path='/create-instructor-kit'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCreateInstructorKit />
              </ProtectedRoute>
            }
          />
          <Route
            path='/view-kits'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <ProductsPage />{' '}
              </ProtectedRoute>
            }
          />
          <Route
            path='/view-refresh-kits'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <RrefreshKit />{' '}
              </ProtectedRoute>
            }
          />
          <Route
            path='/unapproved-centers'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UnapprovedCenters />
              </ProtectedRoute>
            }
          />
          <Route
            path='/unapproved-instructors'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UnapprovedInstructors />
              </ProtectedRoute>
            }
          />
          <Route
            path='/create-sanitario'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateSanitario />
              </ProtectedRoute>
            }
          />
          <Route
            path='/sanitarios-list'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <ListaSanitari />
              </ProtectedRoute>
            }
          />
          <Route
            path='/center-sanitarios'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center']}>
                <CenterSanitarios />
              </ProtectedRoute>
            }
          />
          <Route
            path='/view-sanitarios'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <ViewSanitarios />
              </ProtectedRoute>
            }
          />
          <Route
            path='/view-instructor-sanitarios'
            element={
              <ProtectedRoute allowedRoles={['admin', 'instructor']}>
                <ViewInstructorSanitarios />
              </ProtectedRoute>
            }
          />
          <Route
            path='/center/view-instructors'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center']}>
                <ViewInstructors />
              </ProtectedRoute>
            }
          />
          <Route
            path='/instructor/view-sanitarios'
            element={<ViewSanitarios />}
          />
          <Route path='/instructor/view-profile' element={<ViewProfile />} />
          <Route path='/center/view-profile' element={<ViewProfile />} />
          <Route
            path='/center/update-profile'
            element={
              <ProtectedRoute allowedRoles={['center']}>
                <UpdateCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path='/instructor/update-profile'
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <UpdateInstructor />
              </ProtectedRoute>
            }
          />

          <Route
            path='/payment'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/products'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/orders'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <OrderManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/update-center'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUpdateCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/update-instructor'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUpdateInstructor />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/create-product'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/all-orders'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/all-corso'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminListaCorso />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/unactive-corso'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUnActiveCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/end-corso'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEndCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/complete-corso'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCompleteCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/all-refresh-corso'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminListaRefreshCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/unactive-refresh-corso'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUnActiveRefreshCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/view-kits'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/view-refresh-kits'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRefreshKit />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/view-instructor-kits'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <AdminViewInstructorKit />{' '}
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/view-instructor-refresh-kits'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <AdminViewInstructorRefreshKit />{' '}
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/view-descente'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAllDiscente />
              </ProtectedRoute>
            }
          />
          <Route
            path='/create-discente'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <CreateDiscente />
              </ProtectedRoute>
            }
          />
          <Route
            path='/update-discente'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <UpdateDiscente />
              </ProtectedRoute>
            }
          />
          <Route
            path='/orders'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/lista-discenti'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <ListaDiscentiPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/create-corso'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <CreateCorso />
              </ProtectedRoute>
            }
          />
          <Route
            path='/create-instructor-corso'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <CreateInstructorCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path='/update-course'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <UpdateCorso />
              </ProtectedRoute>
            }
          />
          <Route
            path='/create-referesh-corso'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <CreateRefreshCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path='/create-instructor-referesh-corso'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <CreateInstructorRefreshCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path='/corso'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <ListaCorso />
              </ProtectedRoute>
            }
          />
          <Route
            path='/refresh-corso'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <ListaRefreshCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path='/instructor-corso'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <ListaInstructorCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path='/instructor-refresh-corso'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <ListaInstructorRefreshCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path='/unactive-corso'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <UnActiveCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path='/finish-corso'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <FinishCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path='/complete-corso'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <CompleteCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path='/unactive-refresh-corso'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <UnActiveRefreshCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path='/store'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <Store />
              </ProtectedRoute>
            }
          />
          <Route
            path='/store/:productId'
            element={
              <ProtectedRoute allowedRoles={['admin', 'center', 'instructor']}>
                <StoreDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;

const ProtectedRoute = ({ allowedRoles, children }) => {
  const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.user.role;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  };
  const role = getRoleFromToken();

  if (!allowedRoles.includes(role)) {
    return <Navigate to='/login' replace />;
  }

  return (
    <>
      {' '}
      <Navbar />
      {children}
    </>
  );
};

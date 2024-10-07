import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);

  const [isOpen, setIsOpen] = useState(false);
  const [centerAccount, setCenterAccount] = useState(false);
  const [instructorAccount, setInstructorAccount] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/notifications',
          {
            headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
          }
        );
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        }
      );
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  const handleRemove = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notifications/${id}`,
        {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        }
      );
      setNotifications(
        notifications?.filter((a)=>a?._id!==id).map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const generalCategory = notifications?.filter(
    (item) =>
      item?.category !== 'instructorAccount' &&
      item?.category !== 'centerAccount'
  );
  const centerCategory = notifications?.filter(
    (item) => item?.category === 'centerAccount'
  );
  const instructorCategory = notifications?.filter(
    (item) => item?.category === 'instructorAccount'
  );

  const generalUnreadCount = notifications?.filter(
    (n) =>
      !n.isRead &&
      n?.category !== 'instructorAccount' &&
      n?.category !== 'centerAccount'
  ).length;
  const centerUnreadCount = notifications?.filter(
    (n) => !n.isRead && n?.category === 'centerAccount'
  ).length;
  const instructorUnreadCount = notifications?.filter(
    (n) => !n.isRead && n?.category === 'instructorAccount'
  ).length;

  const dotColor = generalUnreadCount > 0 ? 'green' : 'red';
  const centerdotColor = centerUnreadCount > 0 ? 'green' : 'red';
  const instructordotColor = instructorUnreadCount > 0 ? 'green' : 'red';

  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-light bg-light col-12'>
        <div className='ms-auto me-5 d-flex gap-3'>
          {decodedToken.user.role == 'admin' && (
            <>
              <div className='position-relative'>
                <div
                  className='position-absolute'
                  style={{
                    width: '24px',
                    height: '24px',
                    top: -5,
                    right: -5,
                    backgroundColor: instructordotColor,
                    borderRadius: '50%',
                  }}
                />
                <button
                  className='btn btn-primary'
                  onClick={() => setInstructorAccount(!instructorAccount)}
                >
                  instructor Notifications
                </button>
                {instructorAccount && (
                  <div
                    className='dropdown-menu show'
                    style={{
                      width: '400px',
                      maxWidth: '90vw',
                      right: '0',
                      left: 'auto',
                      overflow: 'auto',
                    }}
                  >
                    {instructorCategory?.length === 0 ? (
                      <span className='dropdown-item'>No notifications</span>
                    ) : (
                      instructorCategory?.map((notification) => (
                        <a
                          key={notification._id}
                          className='dropdown-item'
                          onClick={() => handleMarkAsRead(notification._id)}
                          href='#'
                          style={
                            notification.isRead
                              ? { fontWeight: 'normal' }
                              : { fontWeight: 'bold' }
                          }
                        >
                          {notification?.userName} {notification.message}
                          {!notification.isRead && (
                            <span className='text-danger'> (New)</span>
                          )}
                        </a>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className='position-relative'>
                <div
                  className='position-absolute'
                  style={{
                    width: '24px',
                    height: '24px',
                    top: -5,
                    right: -5,
                    backgroundColor: centerdotColor,
                    borderRadius: '50%',
                  }}
                />
                <button
                  className='btn btn-primary'
                  onClick={() => setCenterAccount(!centerAccount)}
                >
                  Center Notifications
                </button>
                {centerAccount && (
                  <div
                    className='dropdown-menu show'
                    style={{
                      width: '400px',
                      maxWidth: '90vw',
                      right: '0',
                      left: 'auto',
                      overflow: 'auto',
                    }}
                  >
                    {centerCategory?.length === 0 ? (
                      <span className='dropdown-item'>No notifications</span>
                    ) : (
                      centerCategory?.map((notification) => (
                        <a
                          key={notification._id}
                          className='dropdown-item'
                          onClick={() => handleMarkAsRead(notification._id)}
                          href='#'
                          style={
                            notification.isRead
                              ? { fontWeight: 'normal' }
                              : { fontWeight: 'bold' }
                          }
                        >
                          {notification?.userName} {notification.message}
                          {!notification.isRead && (
                            <span className='text-danger'> (New)</span>
                          )}
                        </a>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          <div className='position-relative'>
            <div
              className='position-absolute'
              style={{
                width: '24px',
                height: '24px',
                top: -5,
                right: -5,
                backgroundColor: dotColor,
                borderRadius: '50%',
              }}
            />
            <button className='btn btn-primary' onClick={toggleDropdown}>
              Notifications
            </button>
            {isOpen && (
              <div
                className='dropdown-menu show'
                style={{
                  width: '400px',
                  maxWidth: '90vw',
                  right: '0',
                  left: 'auto',
                  overflow: 'auto',
                }}
              >
                {generalCategory?.length === 0 ? (
                  <span className='dropdown-item'>No notifications</span>
                ) : (
                  generalCategory?.map((notification) => (
                    <div className="d-flex">

                    <a
                      key={notification._id}
                      className='dropdown-item'
                      onClick={() => handleMarkAsRead(notification._id)}
                      href='#'
                      style={
                        notification.isRead
                          ? { fontWeight: 'normal' }
                          : { fontWeight: 'bold' }
                      }
                    >
                      {notification?.userName} {notification.message}
                      {!notification.isRead && (
                        <span className='text-danger'> (New)</span>
                      )}

                    </a>
                    <button onClick={()=>handleRemove(notification._id)} className="text-danger">X</button>
                      </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

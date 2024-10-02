import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const dotColor = unreadCount > 0 ? 'green' : 'red';

  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-light bg-light col-12'>
        <div className='ms-auto me-5 position-relative'>
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
              {notifications.length === 0 ? (
                <span className='dropdown-item'>No notifications</span>
              ) : (
                notifications.map((notification) => (
                  <a
                    key={notification._id}
                    className='dropdown-item'
                    onClick={() => handleMarkAsRead(notification._id)}
                    href='#'
                    style={notification.isRead ? { fontWeight: 'normal' } : { fontWeight: 'bold' }}
                  >
                    {notification?.senderId?.username} {notification.message}
                    {!notification.isRead && (
                      <span className='text-danger'> (New)</span>
                    )}
                  </a>
                ))
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

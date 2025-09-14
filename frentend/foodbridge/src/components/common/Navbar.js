import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSignOutAlt,
  FaUserAlt,
  FaHome,
  FaInfoCircle,
  FaPhoneAlt,
  FaHandshake,
  FaBell,
  FaUserCircle,
  FaChevronDown,
} from 'react-icons/fa';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Dropdown = ({ trigger, children, hover = false }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <div
      className="position-relative"
      onMouseEnter={hover ? () => setOpen(true) : undefined}
      onMouseLeave={hover ? () => setOpen(false) : undefined}
    >
      <div onClick={!hover ? toggleOpen : undefined} style={{ cursor: 'pointer' }}>
        {trigger(open)}
      </div>
      {open && (
        <div
          className="dropdown-menu show p-3 border rounded shadow"
          style={{ position: 'absolute', top: '100%', right: 0, minWidth: 220, zIndex: 1000 }}
        >
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, userRole, logout } = useAuth();
  const { unreadCount, notifications = [], markAllAsRead, fetchNotifications } = useNotification();
  const [showMenu, setShowMenu] = useState(false);
  const API_BASE = "http://localhost:5000/api";

  const handleNotificationClick = async (id) => {
    try {
      await axios.put(`${API_BASE}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error("❌ Failed to mark notification as read", err);
    }
  };

  const roleLinks = () => {
    switch (userRole) {
      case 'admin':
        return [{ label: 'Admin Dashboard', path: '/admin' }];
      case 'ngo':
        return [
          { label: 'NGO Dashboard', path: '/dashboard' },
          { label: 'Profile', path: '/profile' },
        ];
      case 'donor':
        return [
          { label: 'Donate Food', path: '/donate' },
          { label: 'Profile', path: '/profile' },
        ];
      default:
        return [];
    }
  };

  const profileTrigger = (open) => (
    <div className="d-flex align-items-center gap-2 nav-link text-light">
      {user?.profilePic ? (
        <img
          src={user.profilePic}
          alt="Profile"
          className="rounded-circle"
          width="40"
          height="40"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <FaUserCircle size={30} className="text-white" />
      )}
      <span>{user?.name || 'User'}</span>
      <FaChevronDown size={12} className={`ms-1 transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} />
    </div>
  );

  const notificationTrigger = (open) => (
    <div className="nav-link text-light position-relative">
      <FaBell />
      {unreadCount > 0 && (
        <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
          {unreadCount}
        </span>
      )}
    </div>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand text-success" to="/">
          <FaHome className="me-2" /> FoodBridge
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse justify-content-end d-none d-lg-flex">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>

            {!user && (
              <li className="nav-item">
                <Link className="nav-link" to="/register?type=ngo">
                  <FaHandshake className="me-1" /> Join NGO
                </Link>
              </li>
            )}

            {user && (
              <>
                <li className="nav-item me-2">
                  <Dropdown trigger={notificationTrigger} hover>
                    {() => (
                      <div style={{ minWidth: 280 }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong>Notifications</strong>
                          {unreadCount > 0 && (
                            <button
                              className="btn btn-sm btn-link text-decoration-none p-0"
                              onClick={markAllAsRead}
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        {notifications.length === 0 ? (
                          <p className="mb-0">No notifications</p>
                        ) : notifications.map((n) => (
                          <div key={n._id} className="d-flex justify-content-between align-items-start mb-1">
                            <small
                              style={{ cursor: 'pointer' }}
                              className={n.isRead ? 'text-muted' : 'fw-bold'}
                              onClick={() => handleNotificationClick(n._id)}
                            >
                              {n.message}<br />
                              <span className="text-secondary" style={{ fontSize: '0.7rem' }}>
                                {new Date(n.createdAt).toLocaleString()}
                              </span>
                            </small>
                            <span
                              style={{ cursor: 'pointer', color: 'red', marginLeft: '5px' }}
                              onClick={async () => { 
                                try {
                                  await axios.delete(`${API_BASE}/notifications/${n._id}`);
                                  fetchNotifications();
                                } catch(err) { console.error(err); }
                              }}
                            >
                              ❌
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Dropdown>
                </li>

                <li className="nav-item">
                  <Dropdown trigger={profileTrigger} hover>
                    {({ close }) => (
                      <ul className="list-unstyled mb-0">
                        {roleLinks().map((link, idx) => (
                          <li key={idx}>
                            <Link className="dropdown-item" to={link.path} onClick={close}>{link.label}</Link>
                          </li>
                        ))}
                        {userRole === 'donor' && (
                          <li>
                            <Link className="dropdown-item" to="/my-donations" onClick={close}>My Donations</Link>
                          </li>
                        )}
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button className="dropdown-item" onClick={() => { logout(); close(); }}>
                            <FaSignOutAlt className="me-1" /> Logout
                          </button>
                        </li>
                      </ul>
                    )}
                  </Dropdown>
                </li>
              </>
            )}

            {!user && (
              <li className="nav-item">
                <Link className="btn btn-success ms-2" to="/login">
                  <FaUserAlt className="me-1" /> Login
                </Link>
              </li>
            )}
          </ul>
        </div>

        {showMenu && (
          <div className="md:hidden fixed top-0 right-0 bottom-0 w-full z-20 bg-white p-5 overflow-auto">
            <div className='flex items-center justify-between mb-5'>
              <Link to="/"><FaHome size={28} /></Link>
              <button onClick={() => setShowMenu(false)}>✖</button>
            </div>
            <ul className='flex flex-col gap-3'>
              <Link onClick={() => setShowMenu(false)} to='/'>Home</Link>
              <Link onClick={() => setShowMenu(false)} to='/about'>About</Link>
              <Link onClick={() => setShowMenu(false)} to='/contact'>Contact</Link>

              {!user && (
                <Link onClick={() => setShowMenu(false)} to='/register?type=ngo'>Join NGO</Link>
              )}

              {user && (
                <>
                  <Dropdown trigger={(open) => (
                    <span className="d-block w-full">
                      Profile <FaChevronDown className={`ms-1 ${open ? 'rotate-180' : 'rotate-0'}`} />
                    </span>
                  )}>
                    {({ close }) => (
                      <div className="flex flex-col gap-2 mt-2">
                        {roleLinks().map((link, idx) => (
                          <Link key={idx} to={link.path} onClick={() => { close(); setShowMenu(false); }}>{link.label}</Link>
                        ))}
                        {userRole === 'donor' && (
                          <Link to='/my-donations' onClick={() => { close(); setShowMenu(false); }}>My Donations</Link>
                        )}
                        <button className="text-left" onClick={() => { logout(); close(); setShowMenu(false); }}>Logout</button>
                      </div>
                    )}
                  </Dropdown>

                  <Dropdown trigger={(open) => (
                    <span className="d-block w-full">
                      Notifications {unreadCount > 0 && `(${unreadCount})`} <FaChevronDown className={`ms-1 ${open ? 'rotate-180' : 'rotate-0'}`} />
                    </span>
                  )}>
                    {({ close }) => (
                      <div className="flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p>No notifications</p>
                        ) : notifications.map((n) => (
                          <div key={n._id} className='flex justify-between'>
                            <small
                              className={n.isRead ? 'text-gray-500' : 'font-bold'}
                              onClick={() => handleNotificationClick(n._id)}
                            >
                              {n.message}
                            </small>
                            <span
                              className='text-red-500 cursor-pointer'
                              onClick={async () => { 
                                try { 
                                  await axios.delete(`${API_BASE}/notifications/${n._id}`); 
                                  fetchNotifications(); 
                                } catch(err){console.error(err);} 
                              }}
                            >
                              ❌
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Dropdown>
                </>
              )}

              {!user && (
                <Link onClick={() => setShowMenu(false)} to='/login'>
                  <p className='px-4 py-2 rounded-full bg-green-500 text-white'>Login</p>
                </Link>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

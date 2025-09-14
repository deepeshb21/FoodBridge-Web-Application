
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children, user }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const API_BASE = "http://localhost:5000/api/notifications";

  const fetchNotifications = useCallback(async () => {
    if (!user?._id) {
      console.warn("⚠ No user found, skipping notification fetch");
      return;
    }

    try {
      console.log(`📡 Fetching notifications for user: ${user._id}`);

      const res = await fetch(`${API_BASE}/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        console.warn(`❌ Notification fetch failed. Status: ${res.status}`);
        return;
      }

      const data = await res.json();
      console.log("🔍 Notifications API response:", data);

      const notifArray = Array.isArray(data)
        ? data
        : Array.isArray(data.notifications)
        ? data.notifications
        : [];

      setNotifications(notifArray);
      setUnreadCount(notifArray.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error('🚨 Failed to fetch notifications:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  const markAllAsRead = async () => {
    if (!user?._id) {
      console.warn("⚠ No user found, cannot mark notifications as read");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/mark-read/${user._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        console.warn(`❌ Failed to mark all notifications as read. Status: ${res.status}`);
        return;
      }

      console.log("✅ All notifications marked as read");
      fetchNotifications();
    } catch (err) {
      console.error('🚨 Failed to mark all notifications as read:', err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

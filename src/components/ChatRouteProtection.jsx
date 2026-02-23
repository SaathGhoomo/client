import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ChatRouteProtection = ({ children }) => {
  const { user } = useAuth();
  const { bookingId } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [hasAccess, setHasAccess] = React.useState(false);

  React.useEffect(() => {
    const validateAccess = async () => {
      if (!user || !bookingId) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // Try to access chat history to validate access
        const response = await api.get(`/chat/${bookingId}`);
        
        if (response.data.success) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Chat access validation error:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    validateAccess();
  }, [user, bookingId]);

  if (loading) {
    return (
      <div className="page" style={{ paddingTop: 110 }}>
        <div className="section-wrap">
          <span className="s-tag">Chat</span>
          <h2 className="s-title">Validating Access...</h2>
          <p className="s-sub">Please wait while we verify your chat access.</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ChatRouteProtection;

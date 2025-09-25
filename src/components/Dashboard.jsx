import React, { useState, useEffect } from 'react';
import AxiosWithAuth from '../utils/AxiosWithAuth';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);

  useEffect(() => {
    // Get stored user info from login
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }

    // Get current session info from API
    AxiosWithAuth()
      .get("/auth/debug/my-session")
      .then(res => {
        console.log("Session info:", res.data);
        setSessionInfo(res.data);
      })
      .catch(err => {
        console.error("Error getting session info:", err);
      });
  }, []);

  const handleLogout = () => {
    AxiosWithAuth()
      .post("/auth/logout")
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        window.location.href = "/";
      })
      .catch(err => {
        console.error("Logout error:", err);
        // Force logout even if API call fails
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        window.location.href = "/";
      });
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <h1>Dashboard</h1>
      
      {/* User greeting with details */}
      <div style={{ 
        margin: "20px 0", 
        padding: "20px", 
        backgroundColor: "#e8f5e8", 
        borderRadius: "8px",
        border: "1px solid #4CAF50"
      }}>
        <h2>Hi {userInfo.username}! 👋</h2>
        
        <div style={{ fontSize: "14px", color: "#555", marginTop: "10px" }}>
          <div><strong>🌐 Your IP:</strong> {userInfo.ip}</div>
          <div style={{ marginTop: "5px" }}>
            <strong>💻 Your Browser:</strong> 
            <div style={{ 
              fontSize: "12px", 
              backgroundColor: "#f0f0f0", 
              padding: "5px", 
              borderRadius: "3px", 
              marginTop: "3px",
              wordBreak: "break-all"
            }}>
              {userInfo.userAgent}
            </div>
          </div>
          <div style={{ marginTop: "5px" }}>
            <strong>⏰ Login Time:</strong> {new Date(userInfo.loginTime).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Session info */}
      {sessionInfo && (
        <div style={{ 
          margin: "20px 0", 
          padding: "15px", 
          backgroundColor: "#f0f8ff", 
          borderRadius: "8px",
          border: "1px solid #2196F3"
        }}>
          <h3>Session Details</h3>
          <div style={{ fontSize: "13px", color: "#555" }}>
            <div><strong>Session ID:</strong> {sessionInfo.tokenJTI}</div>
            <div><strong>User ID:</strong> {sessionInfo.tokenUserId}</div>
            <div><strong>Active Sessions:</strong> {sessionInfo.allSessions?.length || 0}</div>
            {sessionInfo.currentSession && (
              <>
                <div><strong>Last Activity:</strong> {new Date(sessionInfo.currentSession.last_seen_at).toLocaleString()}</div>
                <div><strong>Session Created:</strong> {new Date(sessionInfo.currentSession.created_at).toLocaleString()}</div>
                <div><strong>Session Expires:</strong> {new Date(sessionInfo.currentSession.expires_at).toLocaleString()}</div>
                {sessionInfo.currentSession.user_agent && (
                  <div><strong>Session User Agent:</strong> 
                    <div style={{ 
                      fontSize: "11px", 
                      backgroundColor: "#f5f5f5", 
                      padding: "3px", 
                      borderRadius: "2px", 
                      marginTop: "2px",
                      wordBreak: "break-all"
                    }}>
                      {sessionInfo.currentSession.user_agent}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* All Sessions List */}
      {sessionInfo?.allSessions && sessionInfo.allSessions.length > 0 && (
        <div style={{ 
          margin: "20px 0", 
          padding: "15px", 
          backgroundColor: "#fff8e1", 
          borderRadius: "8px",
          border: "1px solid #FF9800"
        }}>
          <h3>All Your Sessions ({sessionInfo.allSessions.length})</h3>
          {sessionInfo.allSessions.map((session, index) => (
            <div key={session.id} style={{ 
              marginBottom: "10px", 
              padding: "8px", 
              backgroundColor: session.isOnline ? "#e8f5e8" : "#f5f5f5",
              borderRadius: "4px",
              border: `1px solid ${session.isOnline ? "#4CAF50" : "#ddd"}`
            }}>
              <div style={{ fontSize: "12px" }}>
                <strong>Session {index + 1}:</strong> {session.isOnline ? "🟢 Online" : "⚪ Offline"}
                <div><strong>Last Seen:</strong> {session.minutesSinceLastSeen} minutes ago</div>
                <div><strong>Created:</strong> {new Date(session.created_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={handleLogout}
        style={{
          backgroundColor: "#f44336",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// axios.defaults.baseURL = window.location.hostname === 'localhost' 
//   ? 'http://localhost:5000' 
//   : 'https://mini-app-backend-sms8.onrender.com';

// function urlBase64ToUint8Array(base64String) {
//   const padding = '='.repeat((4 - base64String.length % 4) % 4);
//   const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);
//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }

// function App() {
//   // --- AUTH & MODAL STATES ---
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
  
//   // --- FORM STATES ---
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [activities, setActivities] = useState([]);
//   const [title, setTitle] = useState('');
//   const [eventTime, setEventTime] = useState('');
//   const [editId, setEditId] = useState(null);

//   // --- RESET PASSWORD STATES ---
//   const [newPass, setNewPass] = useState('');
//   const [confirmPass, setConfirmPass] = useState('');
//   const [showPassReset, setShowPassReset] = useState(false);

//   // --- HASH ROUTE PATH MATCHING ---
//   const isResetPath = window.location.hash.includes('/reset-password/');
//   const resetToken = window.location.hash.split('/').pop();

//   // --- FUNCTIONS ---
//   const verifyUser = () => {
//     if (!token) {
//       setIsRegistering(false); 
//       setShowAuthModal(true);
//       return false;
//     }
//     return true;
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setIsRegistering(false); 
//     setShowAuthModal(false);
//   };

//   const handleResetSubmit = async (e) => {
//     e.preventDefault();
//     if (newPass !== confirmPass) {
//       alert("Passwords do not match!");
//       return;
//     }
//     try {
//       const res = await axios.post(`/api/password/reset-password/${resetToken}`, { password: newPass });
//       alert(res.data.message);
//       window.location.href = "/"; 
//     } catch (err) {
//       alert("This link has expired or is invalid.");
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('/api/auth/login', { email, password });
//       localStorage.setItem('token', res.data.token);
//       setToken(res.data.token);
//       setShowAuthModal(false);
//       setEmail(''); setPassword('');
//     } catch (err) { alert('Login Failed!'); }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/auth/register', { name, email, password });
//       alert('🎉 Account created! Please log in.');
//       setIsRegistering(false);
//     } catch (err) { alert('Registration failed.'); }
//   };

//   const handleForgotPassword = async () => {
//     const userEmail = prompt("Please enter your registered email address:");
//     if (!userEmail) return;
//     try {
//       const res = await axios.post('/api/password/forgot-password', { email: userEmail });
//       alert(res.data.message);
//     } catch (err) { alert("Email not found."); }
//   };

//   const fetchActivities = async () => {
//     if (!token) return; 
//     try {
//       const res = await axios.get('/api/activities', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setActivities(res.data);
//     } catch (err) { console.error("Fetch failed"); }
//   };

//   const handleSubmitActivity = async (e) => {
//     e.preventDefault();
//     if (!verifyUser()) return;
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const data = { title, eventTime };
//     try {
//       if (editId) {
//         await axios.put(`/api/activities/${editId}`, data, config);
//         setEditId(null);
//       } else {
//         await axios.post('/api/activities', data, config);
//       }
//       setTitle(''); setEventTime(''); fetchActivities();
//     } catch (err) { alert('Error saving activity.'); }
//   };

//   const handleDelete = async (id) => {
//     if (!verifyUser()) return;
//     if (window.confirm("Are you sure?")) {
//       await axios.delete(`/api/activities/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//       fetchActivities();
//     }
//   };

//   const subscribeToPush = async () => {
//     if (!verifyUser()) return;
//     try {
//       const permission = await Notification.requestPermission();
//       if (permission !== 'granted') {
//         alert('Notification permissions denied. Please allow notifications in your address bar.');
//         return;
//       }

//       const readyReg = await navigator.serviceWorker.ready;
      
//       const myPublicKey = 'BDqglXQQ37cepZP-7goLT0qRp0DFMKJhwBuAiB6oN5XfxtpRmy1n3Xfok_dtpsi0Ad_qBFX4NCj7jyFAIOYp6O8'; 
//       const convertedKey = urlBase64ToUint8Array(myPublicKey);
      
//       const subscription = await readyReg.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: convertedKey
//       });
      
//       await axios.post('/api/notifications/subscribe', subscription, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       alert('Success! Notifications active.');
//     } catch (err) { 
//       console.error("Push Error Details:", err);
//       alert('Failed to enable notifications. Look at your DevTools console log for the code reason!'); 
//     }
//   };

//   useEffect(() => { if (token) fetchActivities(); else setActivities([]); }, [token]);

//   // --- CONDITIONAL RENDERING ---

//   if (isResetPath) {
//     return (
//       <div className="dashboard-container" style={{textAlign: 'center', paddingTop: '100px'}}>
//         <h1>Secretary App</h1>
//         <div className="form-section" style={{maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
//           <h3>Create New Password</h3>
//           <form onSubmit={handleResetSubmit}>
//             <input 
//               type={showPassReset ? 'text' : 'password'} 
//               placeholder="New Password" 
//               value={newPass}
//               onChange={(e) => setNewPass(e.target.value)}
//               style={{width: '100%', padding: '10px', marginBottom: '10px'}} 
//               required 
//             />
//             <input 
//               type={showPassReset ? 'text' : 'password'} 
//               placeholder="Confirm New Password" 
//               value={confirmPass}
//               onChange={(e) => setConfirmPass(e.target.value)}
//               style={{width: '100%', padding: '10px', marginBottom: '10px'}} 
//               required 
//             />
//             <div style={{ textAlign: 'left', marginBottom: '15px' }}>
//                <label style={{ fontSize: '14px', cursor: 'pointer' }}>
//                  <input type="checkbox" onChange={() => setShowPassReset(!showPassReset)} /> Show Passwords
//                </label>
//             </div>
//             <button type="submit" style={{backgroundColor: '#3498db', color: 'white', width: '100%', padding: '10px', border: 'none', borderRadius: '4px'}}>
//               Update Password
//             </button>
//           </form>
//           <p onClick={() => window.location.href = "/"} style={{cursor: 'pointer', color: '#7f8c8d', marginTop: '15px', fontSize: '14px'}}>
//             Back to Dashboard
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       {token ? (
//         <button className="logout-btn" onClick={handleLogout}>Logout</button>
//       ) : (
//         <button className="logout-btn" style={{backgroundColor: '#3498db'}} onClick={() => { setIsRegistering(false); setShowAuthModal(true); }}>Sign Up / Login</button>
//       )}

//       <h1>Secretary Dashboard</h1>
      
//       <button onClick={subscribeToPush} style={{ backgroundColor: '#2ecc71', color: 'white', marginBottom: '20px' }}>
//         Enable Desktop Notifications 🔔
//       </button>

//       <div className="form-section">
//         <h3>{editId ? 'Edit Reminder' : 'Add New Reminder'}</h3>
//         <form onSubmit={handleSubmitActivity}>
//           <input type="text" placeholder="What's the task?" value={title} onChange={e => setTitle(e.target.value)} required />
          
//           {/* Explicit label added to clear up responsive mobile container differences */}
//           <label style={{ display: 'block', textAlign: 'left', fontSize: '14px', color: '#7f8c8d', margin: '10px 0 4px 5px', fontWeight: '600' }}>
//             Choose Reminder Date & Time:
//           </label>
//           <input type="datetime-local" value={eventTime} onChange={e => setEventTime(e.target.value)} required />
          
//           <button type="submit" style={{ backgroundColor: editId ? '#f39c12' : '#3498db' }}>
//             {editId ? 'Update' : 'Schedule It'}
//           </button>
//           {editId && <button onClick={() => {setEditId(null); setTitle(''); setEventTime('');}} style={{backgroundColor: '#95a5a6', marginTop: '5px'}}>Cancel</button>}
//         </form>
//       </div>

//       <hr style={{margin: '20px 0', border: '0', borderTop: '1px solid #eee'}} />
      
//       <h3>{token ? "Your Reminders" : "Sample Reminders (Sign up to create your own)"}</h3>
//       <ul>
//         {token ? (
//           activities.map(act => (
//             <li key={act._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <div><strong>{act.title}</strong><br /><small>{new Date(act.eventTime).toLocaleString()}</small></div>
//               <div>
//                 <button onClick={() => {setEditId(act._id); setTitle(act.title); setEventTime(new Date(act.eventTime).toISOString().slice(0,16))}} style={{ backgroundColor: '#f1c40f', width: 'auto', padding: '5px 10px', marginRight: '5px' }}>Edit</button>
//                 <button onClick={() => handleDelete(act._id)} style={{ backgroundColor: '#e74c3c', width: 'auto', padding: '5px 10px' }}>Delete</button>
//               </div>
//             </li>
//           ))
//         ) : (
//           <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6 }}>
//             <div><strong>Example Task: Teaching on Tuesday</strong><br /><small>{new Date().toLocaleString()}</small></div>
//             <div>
//               <button onClick={verifyUser} style={{ backgroundColor: '#f1c40f', width: 'auto', padding: '5px 10px', marginRight: '5px' }}>Edit</button>
//               <button onClick={verifyUser} style={{ backgroundColor: '#e74c3c', width: 'auto', padding: '5px 10px' }}>Delete</button>
//             </div>
//           </li>
//         )}
//       </ul>

//       {showAuthModal && (
//         <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
//           <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '400px', width: '100%', position: 'relative' }}>
//             <span onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', top: '10px', right: '15px', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}>&times;</span>
//             <h2>{isRegistering ? 'Create Account' : 'Secretary Login'}</h2>
//             <form onSubmit={isRegistering ? handleRegister : handleLogin}>
//               {isRegistering && <input type="text" placeholder="Full Name" onChange={e => setName(e.target.value)} style={{width: '100%', marginBottom: '10px', padding: '8px'}} required />}
//               <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{width: '100%', marginBottom: '10px', padding: '8px'}} required />
//               <div style={{ position: 'relative' }}>
//                 <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{width: '100%', marginBottom: '10px', padding: '8px'}} required />
//                 <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '8px', cursor: 'pointer', color: '#7f8c8d' }}>{showPassword ? 'Hide' : 'Show'}</span>
//               </div>
//               <button type="submit" style={{width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px'}}>{isRegistering ? 'Sign Up' : 'Login'}</button>
//             </form>
//             <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
//               <p onClick={handleForgotPassword} style={{ color: '#3498db', cursor: 'pointer', fontSize: '14px', marginBottom: '10px' }}>Forgot Password?</p>
//               <p onClick={() => setIsRegistering(!isRegistering)} style={{ color: '#e67e22', cursor: 'pointer', fontWeight: 'bold' }}>
//                 {isRegistering ? 'Already have an account? Login' : "Don't have an account? Create one here"}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

axios.defaults.baseURL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://mini-app-backend-sms8.onrender.com';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function App() {
  // --- AUTH & MODAL STATES ---
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // --- FORM STATES ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [editId, setEditId] = useState(null);

  // --- RESET PASSWORD STATES ---
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPassReset, setShowPassReset] = useState(false);

  // --- NEW: NOTIFICATION CHANNEL STATES ---
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  // --- HASH ROUTE PATH MATCHING ---
  const isResetPath = window.location.hash.includes('/reset-password/');
  const resetToken = window.location.hash.split('/').pop();

  // --- FUNCTIONS ---
  const verifyUser = () => {
    if (!token) {
      setIsRegistering(false); 
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsRegistering(false); 
    setShowAuthModal(false);
    // Reset notification settings visual states upon logging out
    setPhoneNumber('');
    setEmailEnabled(true);
    setSmsEnabled(false);
    setSettingsMessage('');
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await axios.post(`/api/password/reset-password/${resetToken}`, { password: newPass });
      alert(res.data.message);
      window.location.href = "/"; 
    } catch (err) {
      alert("This link has expired or is invalid.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setShowAuthModal(false);
      setEmail(''); setPassword('');
    } catch (err) { alert('Login Failed!'); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { name, email, password });
      alert('🎉 Account created! Please log in.');
      setIsRegistering(false);
    } catch (err) { alert('Registration failed.'); }
  };

  const handleForgotPassword = async () => {
    const userEmail = prompt("Please enter your registered email address:");
    if (!userEmail) return;
    try {
      const res = await axios.post('/api/password/forgot-password', { email: userEmail });
      alert(res.data.message);
    } catch (err) { alert("Email not found."); }
  };

  const fetchActivities = async () => {
    if (!token) return; 
    try {
      const res = await axios.get('/api/activities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(res.data);
    } catch (err) { console.error("Fetch failed"); }
  };

  // --- NEW: FETCH SAVED PROFILE NOTIFICATION CHANNELS ---
  const fetchProfilePreferences = async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setPhoneNumber(res.data.phoneNumber || '');
        if (res.data.preferences) {
          setEmailEnabled(res.data.preferences.emailEnabled);
          setSmsEnabled(res.data.preferences.smsEnabled);
        }
      }
    } catch (err) {
      console.error("Failed to load user preference records:", err);
    }
  };

  // --- NEW: PERSIST NOTIFICATION CHANNEL CHANGES ---
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSettingsMessage('');

    if (smsEnabled && !phoneNumber.trim()) {
      setSettingsMessage('⚠️ Please enter a phone number to enable SMS notifications.');
      return;
    }

    try {
      await axios.put('/api/auth/update-preferences', 
        { phoneNumber, emailEnabled, smsEnabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettingsMessage('✅ Channels updated successfully!');
    } catch (err) {
      setSettingsMessage(err.response?.data?.message || '❌ Failed to update channels.');
    }
  };

  const handleSubmitActivity = async (e) => {
    e.preventDefault();
    if (!verifyUser()) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const data = { title, eventTime };
    try {
      if (editId) {
        await axios.put(`/api/activities/${editId}`, data, config);
        setEditId(null);
      } else {
        await axios.post('/api/activities', data, config);
      }
      setTitle(''); setEventTime(''); fetchActivities();
    } catch (err) { alert('Error saving activity.'); }
  };

  const handleDelete = async (id) => {
    if (!verifyUser()) return;
    if (window.confirm("Are you sure?")) {
      await axios.delete(`/api/activities/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchActivities();
    }
  };

  const subscribeToPush = async () => {
    if (!verifyUser()) return;
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Notification permissions denied. Please allow notifications in your address bar.');
        return;
      }

      const readyReg = await navigator.serviceWorker.ready;
      
      const myPublicKey = 'BDqglXQQ37cepZP-7goLT0qRp0DFMKJhwBuAiB6oN5XfxtpRmy1n3Xfok_dtpsi0Ad_qBFX4NCj7jyFAIOYp6O8'; 
      const convertedKey = urlBase64ToUint8Array(myPublicKey);
      
      const subscription = await readyReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });
      
      await axios.post('/api/notifications/subscribe', subscription, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Success! Notifications active.');
    } catch (err) { 
      console.error("Push Error Details:", err);
      alert('Failed to enable notifications. Look at your DevTools console log for the code reason!'); 
    }
  };

  // Sync actions on application token mount state adjustments
  useEffect(() => { 
    if (token) {
      fetchActivities(); 
      fetchProfilePreferences();
    } else {
      setActivities([]); 
    }
  }, [token]);

  // --- CONDITIONAL RENDERING ---

  if (isResetPath) {
    return (
      <div className="dashboard-container" style={{textAlign: 'center', paddingTop: '100px'}}>
        <h1>Secretary App</h1>
        <div className="form-section" style={{maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
          <h3>Create New Password</h3>
          <form onSubmit={handleResetSubmit}>
            <input 
              type={showPassReset ? 'text' : 'password'} 
              placeholder="New Password" 
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              style={{width: '100%', padding: '10px', marginBottom: '10px'}} 
              required 
            />
            <input 
              type={showPassReset ? 'text' : 'password'} 
              placeholder="Confirm New Password" 
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              style={{width: '100%', padding: '10px', marginBottom: '10px'}} 
              required 
            />
            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
               <label style={{ fontSize: '14px', cursor: 'pointer' }}>
                 <input type="checkbox" onChange={() => setShowPassReset(!showPassReset)} /> Show Passwords
               </label>
            </div>
            <button type="submit" style={{backgroundColor: '#3498db', color: 'white', width: '100%', padding: '10px', border: 'none', borderRadius: '4px'}}>
              Update Password
            </button>
          </form>
          <p onClick={() => window.location.href = "/"} style={{cursor: 'pointer', color: '#7f8c8d', marginTop: '15px', fontSize: '14px'}}>
            Back to Dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {token ? (
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      ) : (
        <button className="logout-btn" style={{backgroundColor: '#3498db'}} onClick={() => { setIsRegistering(false); setShowAuthModal(true); }}>Sign Up / Login</button>
      )}

      <h1>Secretary Dashboard</h1>
      
      <button onClick={subscribeToPush} style={{ backgroundColor: '#2ecc71', color: 'white', marginBottom: '20px' }}>
        Enable Desktop Notifications 🔔
      </button>

      <div className="form-section">
        <h3>{editId ? 'Edit Reminder' : 'Add New Reminder'}</h3>
        <form onSubmit={handleSubmitActivity}>
          <input type="text" placeholder="What's the task?" value={title} onChange={e => setTitle(e.target.value)} required />
          
          <label style={{ display: 'block', textAlign: 'left', fontSize: '14px', color: '#7f8c8d', margin: '10px 0 4px 5px', fontWeight: '600' }}>
            Choose Reminder Date & Time:
          </label>
          <input type="datetime-local" value={eventTime} onChange={e => setEventTime(e.target.value)} required />
          
          <button type="submit" style={{ backgroundColor: editId ? '#f39c12' : '#3498db' }}>
            {editId ? 'Update' : 'Schedule It'}
          </button>
          {editId && <button onClick={() => {setEditId(null); setTitle(''); setEventTime('');}} style={{backgroundColor: '#95a5a6', marginTop: '5px'}}>Cancel</button>}
        </form>
      </div>

      {/* --- NEW: NOTIFICATION PREFERENCES SETTINGS BLOCK --- */}
      {token && (
        <div className="form-section" style={{ marginTop: '20px', backgroundColor: '#fcfcfc', border: '1px dashed #cbd5e1' }}>
          <h3 style={{ marginBottom: '4px' }}>Notification Channels</h3>
          <p style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '0', marginBottom: '15px' }}>
            Receive reminder alerts sequentially every 1 hour once a task is within 5 hours of occurring.
          </p>
          
          <form onSubmit={handleSavePreferences} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input 
                  type="checkbox" 
                  checked={emailEnabled} 
                  onChange={(e) => setEmailEnabled(e.target.checked)} 
                />
                Enable Email Alerts
              </label>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input 
                  type="checkbox" 
                  checked={smsEnabled} 
                  onChange={(e) => setSmsEnabled(e.target.checked)} 
                />
                Enable Phone SMS Alerts
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '15px', opacity: smsEnabled ? 1 : 0.5, transition: 'opacity 0.2s' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Phone Number (with country code):</label>
              <input 
                type="tel" 
                placeholder="e.g. +2348012345678" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={!smsEnabled}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>

            {settingsMessage && (
              <p style={{ 
                fontSize: '13px', 
                margin: '0 0 10px 0', 
                fontWeight: '500', 
                color: settingsMessage.includes('✅') ? '#16a34a' : '#dc2626' 
              }}>
                {settingsMessage}
              </p>
            )}

            <button type="submit" style={{ backgroundColor: '#2ecc71', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
              Save Settings
            </button>
          </form>
        </div>
      )}

      <hr style={{margin: '20px 0', border: '0', borderTop: '1px solid #eee'}} />
      
      <h3>{token ? "Your Reminders" : "Sample Reminders (Sign up to create your own)"}</h3>
      <ul>
        {token ? (
          activities.map(act => (
            <li key={act._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><strong>{act.title}</strong><br /><small>{new Date(act.eventTime).toLocaleString()}</small></div>
              <div>
                <button onClick={() => {setEditId(act._id); setTitle(act.title); setEventTime(new Date(act.eventTime).toISOString().slice(0,16))}} style={{ backgroundColor: '#f1c40f', width: 'auto', padding: '5px 10px', marginRight: '5px' }}>Edit</button>
                <button onClick={() => handleDelete(act._id)} style={{ backgroundColor: '#e74c3c', width: 'auto', padding: '5px 10px' }}>Delete</button>
              </div>
            </li>
          ))
        ) : (
          <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6 }}>
            <div><strong>Example Task: Teaching on Tuesday</strong><br /><small>{new Date().toLocaleString()}</small></div>
            <div>
              <button onClick={verifyUser} style={{ backgroundColor: '#f1c40f', width: 'auto', padding: '5px 10px', marginRight: '5px' }}>Edit</button>
              <button onClick={verifyUser} style={{ backgroundColor: '#e74c3c', width: 'auto', padding: '5px 10px' }}>Delete</button>
            </div>
          </li>
        )}
      </ul>

      {showAuthModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '400px', width: '100%', position: 'relative' }}>
            <span onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', top: '10px', right: '15px', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}>&times;</span>
            <h2>{isRegistering ? 'Create Account' : 'Secretary Login'}</h2>
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
              {isRegistering && <input type="text" placeholder="Full Name" onChange={e => setName(e.target.value)} style={{width: '100%', marginBottom: '10px', padding: '8px'}} required />}
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{width: '100%', marginBottom: '10px', padding: '8px'}} required />
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{width: '100%', marginBottom: '10px', padding: '8px'}} required />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '8px', cursor: 'pointer', color: '#7f8c8d' }}>{showPassword ? 'Hide' : 'Show'}</span>
              </div>
              <button type="submit" style={{width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px'}}>{isRegistering ? 'Sign Up' : 'Login'}</button>
            </form>
            <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
              <p onClick={handleForgotPassword} style={{ color: '#3498db', cursor: 'pointer', fontSize: '14px', marginBottom: '10px' }}>Forgot Password?</p>
              <p onClick={() => setIsRegistering(!isRegistering)} style={{ color: '#e67e22', cursor: 'pointer', fontWeight: 'bold' }}>
                {isRegistering ? 'Already have an account? Login' : "Don't have an account? Create one here"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

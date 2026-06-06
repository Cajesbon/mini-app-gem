import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }
    try {
      await axios.post(`/api/password/reset-password/${token}`, { password });
      alert("Password reset successful! You can now log in.");
      navigate('/'); // Go back to login
    } catch (err) {
      alert("Link expired or invalid.");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>New Password</h1>
      <form onSubmit={handleReset}>
        <input 
          type="password" 
          placeholder="Enter new password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Confirm new password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
import React, { useState } from 'react';
import './Kumpulan.css/register.css'; // Reuse CSS login
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [username,setUsername] = useState('')
    const [fullName,setFullname] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const navigate = useNavigate()
    function onRegis(e){
        
        e.preventDefault()
        if(confirmPassword!==password) return
        const dataAkun = {
            username: username,
            fullName: fullName,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }
        axios.post('http://localhost:5000/register',dataAkun)
        .then((ress)=>{
            alert(ress.data.message)
            navigate('/')
        })
        .catch((err)=>{
            if(err.response){
                alert(err.response.data.message)
            }else{
                alert('gagal register')
            }
        })
    }
  return (
    <div className="container">
      {/* Kiri - Logo (desktop only) */}
      <div className="left-side">
        <img
          src="/src/assetss/Gemini_Generated_Image_6n9v4j6n9v4j6n9v-removebg-preview.png"
          alt="Logo"
        />
      </div>

      {/* Kanan - Form Register */}
      <div className="right-side">
        <div className="form-box">
          {/* Logo mobile */}
          <img
            src="/src/assetss/Gemini_Generated_Image_6n9v4j6n9v4j6n9v-removebg-preview.png"
            alt="Logo Mobile"
            className="logo-mobile"
          />

          <h2>Register</h2>

          <input type="text" placeholder="Full Name" onChange={(e)=> setFullname(e.target.value)}/>
          <input type="text" placeholder="Username" onChange={(e)=> setUsername(e.target.value)} />
          <input type="email" placeholder="Email" onChange={(e)=> setEmail(e.target.value)}/>
          <input type="password" placeholder="Password" onChange={(e)=> setPassword(e.target.value)}/>
          <input type="password" placeholder="Confirm Password" onChange={(e)=> setConfirmPassword(e.target.value)}/>

          <div className="button-group">
            <button className="login-btn" onClick={onRegis}>Register</button>
            <button className="signup-btn" onClick={()=> navigate('/')}>Back to Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

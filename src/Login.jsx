import React, { useState } from 'react';
import './Kumpulan.css/Login.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "sonner"
function Login() {
  const navigate = useNavigate()

  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  function onLogin(e){
    e.preventDefault()
    const dataLogin = {
      identifier: username,password
    }
    axios.post('http://localhost:5000/login',dataLogin)
    .then((res)=>{
      toast.success('Berhasil Login')
      const userId = res.data.user.id;
      localStorage.setItem('userId', userId);
    console.log("Respon backend (res.data):", res.data);
    console.log("TOKEN dari res.data.token:", res.data.token);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userName', res.data.user.username);

    const role = res.data.user.role
    if(role==='admin'){
      navigate('/dashboard-admin')
    }else if(role==='user'){
      navigate('/dashboard-user')
    }
    })
.catch((err)=>{
  if (err.response) {
    toast.error(err.response.data.message)
    console.error("DETAIL:", err.response.data);
  } else {
    toast('Login Gagal')
    console.error("ERROR:", err);
  }
})

  }
  return (
    <div className="container">
      {/* Kiri - Logo & Nama (untuk layar lebar) */}
      <div className="left-side">
        <img
          src="/src/assetss/Gemini_Generated_Image_6n9v4j6n9v4j6n9v-removebg-preview.png"
          alt="Logo"
        />
      </div>

      {/* Kanan - Form Login */}
      <div className="right-side">
        <div className="form-box">
          <form onSubmit={onLogin}>

          {/* Logo untuk tampilan mobile */}
          <img
            src="/src/assetss/Gemini_Generated_Image_6n9v4j6n9v4j6n9v-removebg-preview.png"
            alt="Logo Mobile"
            className="logo-mobile"
            />

          <h2>Login</h2>
          <input type="text" placeholder="User Name" value={username} onChange={(e)=> setUsername(e.target.value)}/>


            <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)}/><br/>
            <button className="forgot">Forgot Password?</button>


          <div className="button-group">
            <button className="login-btn" >Login</button>
            
          </div>
            </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
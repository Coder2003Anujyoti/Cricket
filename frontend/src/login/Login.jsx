import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import {useAutho} from "../protector/useAuth.jsx";
export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [lock,setLock]=useState(false)
  const { login } = useAutho();
  const navigate = useNavigate();
   useEffect(()=>{
  sessionStorage.removeItem("token")
  sessionStorage.removeItem("username")
  sessionStorage.removeItem("user")
  sessionStorage.removeItem("role")
  },[])
  const handSubmit = async () => {
   

    let valid = true;

    if (username.trim()=="" || password.trim()=="") {
      toast.error("Invalid input");
      valid = false;
    }
  
    if (!valid) return;

      if (valid) {
      try{
      // Do your login/signup/reset logic here
      let response;
      if(mode=="signup"){
        response=await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/signup",{
          method:'POST',
          headers:{ 'Content-Type' : "application/json" },
          body: JSON.stringify({username.trim(),password.trim()}),
        })
      }
      else if(mode=="login"){
        response=await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/login",{
          method:'POST',
          headers:{ 'Content-Type' : "application/json" },
          body: JSON.stringify({username.trim(),password.trim()}),
        })
      }
      else{
        response=await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/forget",{
          method:'POST',
          headers:{ 'Content-Type' : "application/json" },
          body: JSON.stringify({username.trim(),password.trim()}),
        })
      }
      const data=await response.json();
      if(!response.ok){
        if(mode == "signup"){
           toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>User is already registered</strong>);
          
        }
        else if(mode == "login"){
          console.log(data)
           toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>User need to register first</strong>);
          
        }
        else{
          toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>User is not found</strong>);
          
        }
      }
        else if(response.ok){
      if(mode == "signup"){
           toast.success(<strong  style={{ whiteSpace: 'nowrap' }}>User register successfully</strong>);
           
        }
        else if(mode=="forgot"){
          toast.success(<strong  style={{ whiteSpace: 'nowrap' }}>Password changed successfully</strong>);
          
        }
      }
      //console.log('Form submitted:', { username, password });
    if (mode === "login" && response.ok) {
  login({ username: data.username });
    navigate("/",{ replace: true })
  sessionStorage.setItem("token",data.token)
  sessionStorage.setItem("username",JSON.stringify(data.username))
  sessionStorage.setItem("role",JSON.stringify(data.role))
}
      }
    catch(err){
    console.log(err)
   toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Something went wrong</strong>);
    }
    finally {
    setLock(false); // Re-enable submit button
  }
    }
   
  };
const handleSubmit = (e) => {
  e.preventDefault(); 
  if (!lock) {
    setLock(true);
    handSubmit();
  }
};
useEffect(()=>{
window.scrollTo({ top: 0, behavior: "smooth" });
  toast.dismiss();
},[])
  return (
    <div className="flex items-center justify-center">
      <Toaster position="top-center" toastOptions={{
          className: 'font-bold', 
          // Tailwind class applied to all toasts
        }}/>
      <div className="w-full my-28 md:my-28 max-w-md max-h-full overflow-y-auto bg-slate-800 rounded-2xl shadow-lg p-8 flex flex-col items-center m-4">
        <video
          src="Icons/movable.mp4"
          autoPlay
          loop
          muted
          className="w-24 h-24 mb-4 rounded-full shadow-md"
        ></video>

        <h1 className="text-2xl font-bold mb-6 text-white">
          {mode === 'login' ? 'Login Account' :
            mode === 'signup' ? 'Create Account' : 'Reset Password'}
        </h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full cursor-pointer px-4 py-2 mb-4 border rounded-md font-semibold focus:outline-none md:focus:ring-2 md:focus:ring-indigo-400"
          />

          <div className="relative w-full mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={mode === 'forgot' ? "New Password" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full cursor-pointer px-4 py-2 border rounded-md font-semibold focus:outline-none md:focus:ring-2  md:focus:ring-indigo-400  pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          <button type="submit" disabled={lock} className="w-full py-2 mb-2 md:bg-indigo-500 md:text-white font-bold text-white bg-gray-900 rounded-md md:hover:bg-indigo-600 transition">
            {mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Reset Password'}
          </button>
        </form>

        <div className="flex justify-between w-full text-sm mt-2">
          {mode !== 'signup' && (
            <button onClick={() => setMode('signup')} className="text-white font-bold md:text-indigo-500 md:hover:underline">Sign Up</button>
          )}
          {mode !== 'forgot' && (
            <button onClick={() => setMode('forgot')} className="text-white font-bold md:text-indigo-500 md:hover:underline">Forgot Password?</button>
          )}
          {(mode === 'signup' || mode === 'forgot') && (
            <button onClick={() => setMode('login')} className="text-white font-bold md:text-indigo-500 md:hover:underline">Back to Login</button>
          )}
        </div>
      </div>
    </div>
  );
}

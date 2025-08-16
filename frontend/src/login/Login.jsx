import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { isMobile } from "react-device-detect";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "react-responsive";
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import {useAutho} from "../protector/useAuth.jsx";
export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [closed,setClosed]=useState(false)
  const [deletelock,setDeletelock]=useState(false)
  const [lock,setLock]=useState(false)
  const { login } = useAutho();
  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.overflow = "hidden"; 
  }, []);
  const isMobileView = useMediaQuery({ query: "(max-width: 425px)" });
    const shouldShowMobile = isMobile || isMobileView;
   useEffect(()=>{
  sessionStorage.removeItem("token")
  sessionStorage.removeItem("username")
  sessionStorage.removeItem("userpassword")
  sessionStorage.removeItem("user")
  sessionStorage.removeItem("role")
  },[])
  const handSubmit = async () => {
    let valid = true;
if ( username.trim() === "" || password.trim() === "" || username.trim().length>=15 ) {
  toast.error("Invalid input");
  valid = false;
  setLock(false);
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
          body: JSON.stringify({username:username.trim().replace(/\s+/g, " "),password:password.trim()}),
        })
      }
      else if(mode=="login"){
        response=await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/login",{
          method:'POST',
          headers:{ 'Content-Type' : "application/json" },
          body: JSON.stringify({username:username.trim().replace(/\s+/g, " "),password:password.trim()}),
        })
      }
      else{
        response=await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/forget",{
          method:'POST',
          headers:{ 'Content-Type' : "application/json" },
          body: JSON.stringify({username:username.trim().replace(/\s+/g, " "),password:password.trim()}),
        })
      }
      const data=await response.json();
      if(!response.ok){
        if(mode == "signup"){
           toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>{data.error}</strong>);
          
        }
        else if(mode == "login"){
          console.log(data)
           toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>{data.error}</strong>);
          
        }
        else{
          toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>{data.error}</strong>);
          
        }
      }
        else if(response.ok){
      if(mode == "signup"){
           toast.success(<strong  style={{ whiteSpace: 'nowrap' }}>{data.message}</strong>);
           
        }
        else if(mode=="forgot"){
          toast.success(<strong  style={{ whiteSpace: 'nowrap' }}>{data.message}</strong>);
          
        }
      }
    if (mode === "login" && response.ok) {
  login({ username: data.username });
    navigate("/",{ replace: true })
  sessionStorage.setItem("token",data.token)
  sessionStorage.setItem("username",JSON.stringify(data.username))
  sessionStorage.setItem("role",JSON.stringify(data.role))
  sessionStorage.setItem("userpassword",JSON.stringify(data.password))
}
      }
    catch(err){
    console.log(err)
   toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Something went wrong</strong>);
    }
    finally {
    setLock(false);
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
  <>
  { closed==false && <>
<div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="relative bg-gray-900 text-white p-5 rounded-xl shadow-xl max-w-md w-full mx-4 animate-fadeIn">
  <button onClick={()=>setClosed(!closed)}
    className="absolute -top-0 -right-0  text-white px-3 py-2 text-center font-bold transition-all duration-200"
  >
    <FontAwesomeIcon icon={faTimes} className="text-xl text-white font-bold" />
  </button>

        <h3 className="text-lg font-bold mb-3">Signup Guidelines</h3>
        <ul className="list-disc font-semibold list-inside text-sm space-y-2">
          <li>⚠ If user exists, choose another username</li>
          <li>✏ Username must be less than 15 characters</li>
          <li>🔒 Password must be strong</li>
          <li>🌍 Respect community rules and avoid spam</li>
          <li>🛡 Do not share your credentials with anyone</li>
          <li>📜 All actions are subject to our platform policy</li>
        </ul>
      </div>
    </div>
  </>
  }

   <div className="min-h-screen overflow-y-hidden flex items-center justify-center">
         <Toaster
      position="top-center"
      toastOptions={{
        className: shouldShowMobile ? "font-bold" : "",
        duration:2000,
      }}
    />
  <div className="w-full my-28 lg:my-36 md:my-20 max-w-md max-h-full overflow-y-auto bg-slate-800 rounded-2xl shadow-lg p-8 flex flex-col items-center m-4">
        <video
          src="Icons/movable.webm"
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
            onChange={(e) => setUsername(e.target.value.replace(/\s/g,""))}
            className="w-full cursor-pointer px-4 py-2 mb-4 border rounded-md font-semibold focus:outline-none placeholder:text-base"
          />

          <div className="relative w-full mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={mode === 'forgot' ? "New Password" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full cursor-pointer px-4 py-2 border rounded-md font-semibold focus:outline-none  pr-10 placeholder:text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          <button type="submit" disabled={lock} className="w-full py-2 mb-2  font-bold text-white bg-gray-900 rounded-md transition">
            {mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Reset Password'}
          </button>
        </form>

        <div className="flex justify-between w-full text-sm mt-2">
          {mode !== 'signup' && (
            <button onClick={() => setMode('signup')} className="text-white font-bold">Sign Up</button>
          )}
          {mode !== 'forgot' && (
            <button onClick={() => setMode('forgot')} className="text-white font-bold">Forgot Password?</button>
          )}
          {(mode === 'signup' || mode === 'forgot') && (
            <button onClick={() => setMode('login')} className="text-white font-bold">Back to Login</button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

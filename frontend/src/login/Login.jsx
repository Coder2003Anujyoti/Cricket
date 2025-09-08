import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { isMobile } from "react-device-detect";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMediaQuery } from "react-responsive";
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useAutho } from "../protector/useAuth.jsx";

export default function Login() {
  const [mode, setMode] = useState('login'); // login | signup | forgot
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [closed, setClosed] = useState(false);
  const [lock, setLock] = useState(false);

  const { login } = useAutho();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    sessionStorage.clear();
  }, []);

  const isMobileView = useMediaQuery({ query: "(max-width: 425px)" });
  const shouldShowMobile = isMobile || isMobileView;

  const handSubmit = async () => {
    let valid = true;

    if (mode=="login" && (username.trim() === "" || password.trim() === "" || username.trim().length >= 15)) {
      toast.error("Invalid input");
      valid = false;
      setLock(false);
    }
    if (mode=="signup" && (username.trim() === "" || password.trim() === "" || username.trim().length >= 15 || email.trim() === "")) {
      toast.error("Invalid input");
      valid = false;
      setLock(false);
    }
     if (mode=="forgot" && otpSent==false && (username.trim() === "" || username.trim().length >= 15 || email.trim() === "")) {
      toast.error("Invalid input");
      valid = false;
      setLock(false);
    }
   if (mode=="forgot" && otpSent==true && (username.trim() === "" || username.trim().length >= 15 || email.trim() === "" || password.trim()=== "" || otp.trim() === "")) {
      toast.error("Invalid input");
      valid = false;
      setLock(false);
    }
    if (!valid) return;

    try {
      let response;
      if (mode === "signup") {
        response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/signup", {
          method: 'POST',
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            password: password.trim(),
            email: email.trim().replace(/\s/g, "")
          }),
        });
      } else if (mode === "login") {
        response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/login", {
          method: 'POST',
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            password: password.trim()
          }),
        });
      } else if (mode === "forgot" && !otpSent) {
        // Step 1: Request OTP
        response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/request-otp", {
          method: 'POST',
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({ email: email.trim().replace(/\s/g, "") , username: username.trim() }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success("OTP sent to your email");
          setOtpSent(true);
          setLock(false);
          return;
        } else {
          toast.error(data.error || "Error sending OTP");
        }
      } else if (mode === "forgot" && otpSent) {
        // Step 2: Verify OTP + reset password
        response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/forget", {
          method: 'POST',
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({
            username:username.trim(),
            email: email.trim().replace(/\s/g, ""),
            otp: otp.trim(),
            password: password.trim(),
          }),
        });
      }

      const data = await response.json();
      if (!response.ok) {
        toast.error(<p style={{ whiteSpace: 'nowrap' }}>{data.error}</p>);
      } else {
        if (mode === "signup") {
          toast.success(data.message);
        } else if (mode === "login") {
          login({ username: data.username });
          navigate("/", { replace: true });
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("username", JSON.stringify(data.username));
          sessionStorage.setItem("role", JSON.stringify(data.role));
          sessionStorage.setItem("userpassword", JSON.stringify(data.password));
        } else if (mode === "forgot" && otpSent) {
          toast.success("Password reset successful!");
          setMode("login");
          setOtpSent(false);
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLock(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lock) {
      setLock(true);
      handSubmit();
    }
  };

  return (
    <>
      {/* Signup Guidelines Modal */}
      {closed === false && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-gray-900 text-white p-5 rounded-xl shadow-xl max-w-md w-full mx-4 animate-fadeIn">
            <button onClick={() => setClosed(!closed)}
              className="absolute -top-0 -right-0 text-white px-3 py-2">
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>
            <h3 className="text-lg font-bold mb-3">Signup Guidelines</h3>
            <ul className="list-disc font-semibold list-inside text-sm space-y-2">
              <li>⚠ If user exists, choose another username</li>
              <li>✏ Username must be less than 15 characters</li>
              <li>📧 Email is required</li>
              <li>🔒 Password must be strong</li>
            <li>🌍 Respect community rules and avoid spam</li>    
      <li>🛡 Do not share your credentials with anyone</li>    
      <li>📜 All actions are subject to our platform policy</li>    
            </ul>
          </div>
        </div>
      )}

      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video src="Icons/Crickets.webm" autoPlay loop muted playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* Main Form */}
      <div className="min-h-screen relative z-10 flex items-center justify-center">
        <Toaster position="top-center" toastOptions={{ className: shouldShowMobile ? "font-bold" : "font-bold", duration: 2000 }} />

        <div className="w-full my-28 max-w-md max-h-full overflow-y-auto rounded-2xl p-8 flex flex-col items-center m-4">
          <video src="Icons/movable.webm" autoPlay loop muted className="w-24 h-24 mb-4 rounded-full shadow-md"></video>
          <h1 className="text-2xl font-bold mb-6 text-white">
            {mode === 'login' ? 'Login Account' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h1>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
              className="w-full px-4 py-2 mb-4 border rounded-md font-semibold focus:outline-none"
            />

            {(mode === "signup" || mode === "forgot") && (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.replace(/\s/g, ""))}
                className="w-full px-4 py-2 mb-4 border rounded-md font-semibold focus:outline-none"
              />
            )}

            {(mode !== "forgot" || (mode === "forgot" && otpSent)) && (
              <div className="relative w-full mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'forgot' ? "New Password" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md font-semibold focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            )}

            {mode === "forgot" && otpSent && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\s/g, ""))}
                className="w-full px-4 py-2 mb-4 border rounded-md font-semibold focus:outline-none"
              />
            )}

            <button type="submit" disabled={lock} className="w-full py-2 mb-2 font-bold text-white bg-sky-600 rounded-md transition">
              {mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : otpSent ? 'Reset Password' : 'Send OTP'}
            </button>
          </form>

          <div className="flex justify-between w-full text-sm mt-2">
            {mode !== 'signup' && (<button onClick={() => setMode('signup')} className="text-white font-bold">New User</button>)}
            {mode !== 'forgot' && (<button onClick={() => setMode('forgot')} className="text-white font-bold">Forgot Password?</button>)}
            {(mode === 'signup' || mode === 'forgot') && (<button onClick={() => { setMode('login'); setOtpSent(false); }} className="text-white font-bold">Back to Login</button>)}
          </div>
        </div>
      </div>
    </>
  );
}
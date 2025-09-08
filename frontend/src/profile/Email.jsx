// src/EmailSender.jsx
import React, { useState,useRef } from "react";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';
const API_URL = "https://intelligent-ailyn-handcricket-e8842259.koyeb.app"; // backend URL

export default function EmailSender() {
  const activeForm = "image" 
  const [imageEmail, setImageEmail] = useState({ from: "", to: "", name:"", subject: "", message: "" });
  const [imageFile, setImageFile] = useState(null);
const [lock,setLock]=useState(false)
  const fileInputRef = useRef();

  // Send Image Email
  const handleSendImage = async () => {
    const formData = new FormData();
    formData.append("from", imageEmail.from);
    formData.append("to", imageEmail.to);
    formData.append("name", imageEmail.name);
    formData.append("subject", imageEmail.subject);
    formData.append("message", imageEmail.message);
    formData.append("image", imageFile);
    try {
      const res = await axios.post(`${API_URL}/send-email`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    toast.success(<p style={{ whiteSpace: 'nowrap' }}>{res.data.message}</p>);
    fileInputRef.current.value = ""; // reset input element
      setImageEmail({ from: "", to: "", name:"", subject: "", message: "" })
      setImageFile(null)
    } catch (err) {
      toast.error("Error sending email");
    }
    finally{
    setLock(false)
    }
  };
const handleSend = (e) => {
  e.preventDefault(); 
  if (!lock) {
    setLock(true);
    handleSendImage();
  }
};
  return (
    <>
      <Toaster position="top-center" toastOptions={{className: 'font-bold', duration:2000, // Tailwind class applied to all toasts
            }}/>
     <div className="relative w-full bg-slate-800 md:flex items-center justify-between p-2 z-50 md:px-4 md:py-3">
      <img className="w-28 h-16" src={`Logos/Logo.webp`} />
      </div>
    <div className="w-full md:min-h-screen md:my-0 flex justify-center items-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Image Email Form */}
        {activeForm === "image" && (
          <div className=" p-6 rounded-xl">
            <h2 className="text-2xl font-extrabold mb-5 text-green-600 text-center">🖼️ Send Image Email</h2>
            <form onSubmit={handleSend} className="space-y-4 font-bold">
              <input type="text" placeholder="From" value={imageEmail.from} onChange={(e) => setImageEmail({ ...imageEmail, from: e.target.value.replace(/\s/g, "") })} className="w-full p-3 border rounded-lg focus:outline-none" required />
              <input type="text" placeholder="To" value={imageEmail.to} onChange={(e) => setImageEmail({ ...imageEmail, to: e.target.value.replace(/\s/g, "") })} className="w-full p-3 border rounded-lg focus:outline-none" required />
               <input type="text" placeholder="Name" value={imageEmail.name} onChange={(e) => setImageEmail({ ...imageEmail, name: e.target.value.replace(/\s/g, "") })} className="w-full p-3 border rounded-lg focus:outline-none" required />
              <input type="text" placeholder="Subject" value={imageEmail.subject} onChange={(e) => setImageEmail({ ...imageEmail, subject: e.target.value })} className="w-full p-3 border rounded-lg focus:outline-none" required />
              <textarea placeholder="Message" style={{ resize: "none"}} value={imageEmail.message} onChange={(e) => setImageEmail({ ...imageEmail, message: e.target.value })} className="w-full p-3 border rounded-lg focus:outline-none" required></textarea>
              <input type="file" ref={fileInputRef} accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full p-2 border rounded-lg bg-white text-black" required />
              <button className="w-full bg-green-600  text-white font-semibold py-3 rounded-lg transition">Send Image Email</button>
            </form>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
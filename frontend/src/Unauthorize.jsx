// Unauthorize.jsx  
import React from 'react';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';  
import { useNavigate } from 'react-router-dom';

const Unauthorize = () => {  
  const navigate = useNavigate();

  return (  
    <div className="my-40 flex flex-col items-center justify-center bg-gray-900 text-white text-center p-4">  
      <FontAwesomeIcon icon={faTriangleExclamation} className="text-yellow-400 text-6xl mb-4 animate-bounce" />  
      <h1 className="text-4xl font-bold mb-2">403 - Unauthorized</h1>  
      <p className="text-lg text-gray-300 mb-6">You don’t have permission to access this page.</p>  
    </div>  
  );  
};  

export default Unauthorize;
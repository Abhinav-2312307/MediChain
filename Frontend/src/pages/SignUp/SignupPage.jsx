import { useState, useEffect } from "react";
import axios from "axios";
import RoleSelector from "./RoleSelector";
import SignupForm from "./SignupForm";
import Typewriter from "typewriter-effect";

export default function SignupPage() {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});
  const API_URL = import.meta.env.VITE_Backend_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/signup`, { ...formData, role });
      alert("Signup successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-opacity-70 backdrop-blur-md z-50 px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center text-white font-bold text-xl">
          <img
            src="/medichain Icon.png"
            alt="Logo"
            className="h-8 mr-2"
          />
          MediChain
        </a>
      </header>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl backdrop-blur-xl bg-white/20 shadow-lg p-8 mt-20 border-5 border-gray-200 ">
        <h1 className="text-4xl font-black text-center mb-3">Create Account</h1>
        <div className="text-center text-gray-400 mb-6">
          <Typewriter
            options={{
              strings: [
                "Join the future of healthcare. Start by selecting your role.",
                "Secure your medical journey with MediChain.",
                "Developed with ❤️ by Adarsh Abhinav²",
              ],
              delay: 50,
              deleteSpeed: 15,
              autoStart: true,
              loop: true,
              pauseFor: 2000,
            }}
          />
        </div>

        <RoleSelector role={role} setRole={setRole} />

        {role && (
          <SignupForm
            role={role}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

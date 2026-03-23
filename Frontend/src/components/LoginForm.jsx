import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import GoogleLoginButton from "./auth/GoogleLoginButton";
import { loginWithCredentials, persistAuthSession } from "../api/authApi";
import usePatientStore from "../store/usePatientStore";

export default function LoginForm() {
  const setPatientData = usePatientStore((state) => state.setPatientData);

  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginWithCredentials(data);
      persistAuthSession(response);
      setPatientData(response.user);
      navigate(response.redirectTo || "/patient-portal/dashboard");
      toast.success("Login successful.");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Unable to complete login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        name="email"
        onChange={handle}
        placeholder="Enter your email"
        className={`w-full px-4 py-3 rounded-lg border transition ${
          isDark
            ? "bg-black/30 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            : "bg-white/60 border-blue-200/50 text-black placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        }`}
        required
      />

      <input
        type="password"
        name="password"
        onChange={handle}
        placeholder="Password"
        className={`w-full px-4 py-3 rounded-lg border transition ${
          isDark
            ? "bg-black/30 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            : "bg-white/60 border-blue-200/50 text-black placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        }`}
        required
      />

      <button
        disabled={loading}
        className={`w-full py-3 rounded-lg font-medium transition-colors cursor-pointer ${
          isDark
            ? "bg-white text-black hover:bg-neutral-200"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div
        className={`flex items-center gap-4 my-4 text-sm uppercase font-semibold ${
          isDark ? "text-neutral-400" : "text-gray-600"
        }`}
      >
        <div
          className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-blue-200/30"}`}
        />
        OR CONTINUE WITH
        <div
          className={`flex-1 h-px ${isDark ? "bg-white/10" : "bg-blue-200/30"}`}
        />
      </div>

      <GoogleLoginButton />
    </form>
  );
}

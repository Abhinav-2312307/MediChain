import { Chrome } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut } from "firebase/auth";
import toast from "react-hot-toast";

import { useTheme } from "../../context/ThemeContext";
import { auth, GoogleAuthProvider } from "../../firebase";
import { loginWithGoogle, persistAuthSession } from "../../api/authApi";
import usePatientStore from "../../store/usePatientStore";

export default function GoogleLoginButton({
  disabled = false,
  disabledText = "Google login is currently unavailable.",
}) {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const setPatientData = usePatientStore((state) => state.setPatientData);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (disabled) {
      toast.error(disabledText);
      return;
    }

    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const firebaseToken = await firebaseUser.getIdToken();

      const response = await loginWithGoogle({
        firebaseToken,
        uid: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
      });

      persistAuthSession(response);
      setPatientData(response.user);
      navigate(response.redirectTo || "/patient-portal/dashboard");
      toast.success("Google login successful.");
    } catch (error) {
      console.error("Google login error:", error);
      await signOut(auth).catch(() => {});
      toast.error(error?.response?.data?.message || error?.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading || disabled}
      className={`w-full py-3 rounded-lg border transition flex items-center justify-center gap-2 font-medium ${
        isDark
          ? "bg-black/40 border-white/10 text-white hover:bg-white/5 disabled:opacity-60"
          : "bg-white/50 border-blue-200/30 text-black hover:bg-blue-50 disabled:opacity-60"
      }`}
    >
      <Chrome size={18} />
      {loading
        ? "Connecting Google..."
        : disabled
        ? "Google for patients only"
        : "Continue with Google"}
    </button>
  );
}

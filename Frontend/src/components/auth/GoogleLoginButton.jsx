import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut } from "firebase/auth";
import { Chrome } from "lucide-react";
import toast from "react-hot-toast";

import { useTheme } from "../../context/ThemeContext";
import { auth, GoogleAuthProvider } from "../../firebase";
import { selectAuthLoading } from "../../features/auth/authSelectors";
import { loginWithGoogle } from "../../features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";

export default function GoogleLoginButton({
  disabled = false,
  disabledText = "Google login is currently unavailable.",
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const loading = useAppSelector(selectAuthLoading);

  const handleGoogleLogin = async () => {
    if (disabled) {
      toast.error(disabledText);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const firebaseToken = await firebaseUser.getIdToken();

      const response = await dispatch(
        loginWithGoogle({
          firebaseToken,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        })
      ).unwrap();

      navigate(response.redirectTo || "/patient");
      toast.success("Google login successful.");
    } catch (error) {
      console.error("Google login error:", error);
      await signOut(auth).catch(() => {});

      const message =
        typeof error === "string"
          ? error
          : error?.response?.data?.message ||
            error?.message ||
            "Google login failed.";

      toast.error(message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading || disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-lg border py-3 font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
        isDark
          ? "border-white/10 bg-black/40 text-white hover:bg-white/5"
          : "border-blue-200/30 bg-white/50 text-black hover:bg-blue-50"
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

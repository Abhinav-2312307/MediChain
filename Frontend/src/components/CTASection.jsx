import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="bg-linear-to-r from-blue-600 to-indigo-600 py-16 text-center text-white" data-scroll-section>
      <h3 className="text-3xl font-semibold mb-4">
        Join the Future of Healthcare Today
      </h3>
      <p className="text-lg mb-8 text-blue-100">
        Register now as a Patient, Doctor, or Hospital and experience a connected
        health ecosystem.
      </p>
      <button
        onClick={() => navigate("/signup")}
        className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition cursor-pointer"
      >
        Get Started <LogIn className="inline-block ml-2 w-5 h-5" />
      </button>
    </section>
  );
}

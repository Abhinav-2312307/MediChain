export default function SignupForm({
  role,
  formData,
  setFormData,
  handleSubmit,
}) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 p-6 bg-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        {role
          ? `Sign up as a ${role.charAt(0).toUpperCase() + role.slice(1)}`
          : "Create Account"}
      </h2>

      <div className="space-y-3">
        <input
          name="name"
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 placeholder-gray-500 transition"
          required
        />
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Email Address"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 placeholder-gray-500 transition"
          required
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 placeholder-gray-500 transition"
          required
        />
      </div>

      {/* Patient and Doctor Fields*/}
      {(role === "patient" || role === "doctor") && (
        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
          <input
            type="date"
            name="dob"
            onChange={handleChange}
            className="w-full sm:w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 text-gray-700 transition cursor-text"
            required
          />
          <select
            name="gender"
            onChange={handleChange}
            className="w-full sm:w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 text-gray-700 transition cursor-pointer"
            required
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      )}

      {/* Doctor Fields */}
      {role === "doctor" && (
        <div className="space-y-3">
          <input
            name="specialization"
            onChange={handleChange}
            placeholder="Specialization"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 placeholder-gray-500 transition"
            required
          />
          <input
            name="licenseNumber"
            onChange={handleChange}
            placeholder="License Number"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 placeholder-gray-500 transition"
            required
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 mt-2 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
      >
        Create Account
      </button>
    </form>
  );
}

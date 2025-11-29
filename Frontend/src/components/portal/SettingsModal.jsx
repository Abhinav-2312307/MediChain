import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, User, HeartPulse, Mail, Phone, MapPin } from "lucide-react";

const SettingField = ({ label, name, value, onChange, icon: Icon, disabled = false }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {label}
    </label>
    <div
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-colors ${
        disabled
          ? "bg-slate-100 dark:bg-slate-800/50 border-transparent text-slate-500 cursor-not-allowed"
          : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50"
      }`}
    >
      {Icon && (
        <Icon className={`w-4 h-4 ${disabled ? "text-slate-400" : "text-indigo-500"}`} />
      )}
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="bg-transparent w-full text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none disabled:cursor-not-allowed"
      />
      {disabled && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-500">
          LOCKED
        </span>
      )}
    </div>
  </div>
);

export default function SettingsModal({ isOpen, onClose, patient, onSave }) {
  const [formData, setFormData] = useState({});

  // Reset form data when modal opens
  useEffect(() => {
    if (isOpen && patient) {
      setFormData({
        phone: patient.phone,
        address: patient.address,
        ecName: patient.emergencyContact?.name || "",
        ecRelation: patient.emergencyContact?.relation || "",
        ecPhone: patient.emergencyContact?.phone || "",
      });
    }
  }, [isOpen, patient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 border border-white/20 dark:border-slate-700 rounded-2xl shadow-2xl z-[70] overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Profile Settings</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update your personal details</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              {/* Read-Only Identity */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                    Identity (Read Only)
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <SettingField label="Full Name" value={patient.name} disabled={true} icon={User} />
                  <SettingField label="Patient ID" value={patient.uid} disabled={true} icon={HeartPulse} />
                </div>
                <SettingField label="Email Address" value={patient.email} disabled={true} icon={Mail} />
              </div>

              {/* Editable Contact */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                  <span className="text-[10px] font-bold uppercase text-indigo-500 tracking-widest">
                    Contact Details
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                </div>
                <SettingField label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} icon={Phone} />
                <SettingField label="Home Address" name="address" value={formData.address} onChange={handleInputChange} icon={MapPin} />

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl space-y-4 border border-indigo-100 dark:border-indigo-500/20">
                  <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase flex items-center gap-2">
                    <HeartPulse className="w-3 h-3" /> Emergency Contact
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <SettingField label="Name" name="ecName" value={formData.ecName} onChange={handleInputChange} />
                    <SettingField label="Relation" name="ecRelation" value={formData.ecRelation} onChange={handleInputChange} />
                  </div>
                  <SettingField label="Emergency Phone" name="ecPhone" value={formData.ecPhone} onChange={handleInputChange} icon={Phone} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
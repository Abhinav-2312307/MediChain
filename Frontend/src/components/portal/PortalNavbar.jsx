import React, { useState, useRef, useEffect } from "react";
import { Classic } from "@theme-toggles/react";
import "@theme-toggles/react/css/Classic.css";
import { LogOut, User, ChevronDown, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_AVATAR } from "./utils";

export default function PortalNavbar({ 
  patient, 
  activeTab, 
  setActiveTab, 
  isDark, 
  toggleTheme, 
  onOpenSettings, 
  onLogout 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-none h-16 px-6 flex items-center justify-between border-b border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md z-40 relative">
      <div className="flex items-center gap-8">
        <div className="font-black text-xl text-indigo-600 dark:text-indigo-400 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-7 h-7" />
          MediChain
        </div>
        <div className="hidden md:flex gap-1 bg-white/40 dark:bg-black/20 p-1 rounded-xl border border-white/10">
          {["overview", "timeline", "allergies"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <Classic
          duration={750}
          toggled={isDark}
          className="text-orange-500 dark:text-yellow-400 text-4xl"
          onClick={toggleTheme}
        />

        <div className="h-8 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <div
            className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                {patient.name.split(" ")[0]}
              </div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                {patient.uid}
              </div>
            </div>
            <img
              src={patient.profilePic || DEFAULT_AVATAR}
              alt="avatar"
              className="w-9 h-9 rounded-lg object-cover border-2 border-white dark:border-slate-600 shadow-sm"
            />
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl p-2 z-50"
              >
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700/50 mb-1">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Signed in as
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {patient.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                >
                  <User className="w-4 h-4" /> Profile Settings
                </button>

                <div className="h-px bg-slate-200 dark:bg-slate-700/50 my-1" />

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
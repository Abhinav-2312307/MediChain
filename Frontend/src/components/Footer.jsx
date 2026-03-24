import React from "react";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      data-scroll-section
      className="border-t border-white/10 bg-gray-900 text-gray-300"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-6 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Developed By
            </p>
            <a
              href="https://www.linkedin.com/in/adarshsachan01/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 text-lg font-semibold text-white transition-colors hover:text-blue-300 md:justify-start"
            >
              <Linkedin className="h-5 w-5 text-blue-400 transition-colors group-hover:text-blue-300" />
              <span>Adarsh Sachan</span>
            </a>
            <p className="text-sm text-slate-400">
              Trying to do better
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row md:justify-end">
            <a
              href="https://github.com/theadarsh1m/MediChain"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              <Github className="h-4 w-4" />
              <span>Contribute on GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/adarshsachan01/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <Linkedin className="h-4 w-4" />
              <span>Connect on LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

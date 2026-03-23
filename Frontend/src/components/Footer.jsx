import React from "react";
import { Github, Linkedin } from "lucide-react";
import { LiquidButton } from "./ui/shadcn-io/liquid-button";

const developers = [
  {
    name: "Adarsh Sachan",
    linkedIn: "https://www.linkedin.com/in/adarshsachan01/",
  }
];

export default function Footer() {
  return (
    <footer
      data-scroll-section
      className="bg-gray-900 text-gray-300 pt-12 pb-8 "
    >
      <div className="container mx-auto px-4 text-center">
        {/* Developers Section */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold mb-4 text-white">
            Developed By
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {developers.map((dev) => (
              <a
                key={dev.name}
                href={dev.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center bg-slate-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300  px-5 py-2 rounded-full shadow-md  hover:shadow-lg dark:hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-300
                "
              >
                <Linkedin className="w-4 h-4 mr-2 text-blue-600 group-hover:text-blue-500" />
                {dev.name}
              </a>
            ))}
          </div>
        </div>

        <div className="mb-0 text-center">
          <LiquidButton>
            <a
              href="https://github.com/theadarsh1m/MediChain"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="inline-block w-5 h-5 mr-2" />
              Contribute on GitHub
            </a>
          </LiquidButton>
        </div>
      </div>
    </footer>
  );
}

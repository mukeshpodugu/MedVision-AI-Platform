import React from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  MapPin, 
  Phone,
  Code,
  Briefcase,
  Layers,
  GraduationCap
} from 'lucide-react';

export default function Profile({ user }) {
  if (!user) return null;

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Clinician Profile & Identity
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Registered identity details and platform developer credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Card */}
        <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-5 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-900/50 text-secondary-600 dark:text-secondary-400 flex items-center justify-center text-3xl font-bold border-2 border-secondary-200 dark:border-secondary-900 shadow-md">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
              {user.full_name}
            </h3>
            <span className="text-[10px] font-bold bg-secondary-50 dark:bg-secondary-900/40 text-secondary-600 dark:text-secondary-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-1 border border-secondary-100 dark:border-secondary-900/30">
              {user.role}
            </span>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/40 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Mail className="w-4 h-4" /> Email Address
              </span>
              <span className="font-semibold">{user.email}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-4 h-4" /> Role Clearance
              </span>
              <span className="font-semibold capitalize">{user.role} access</span>
            </div>
          </div>
        </div>

        {/* Developer Portfolio Card */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
          
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Lead Project Architect Resume Summary
            </h3>
            <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-bold uppercase border border-emerald-100 dark:border-emerald-900/30">
              Active Portfolio
            </span>
          </div>

          {/* Developer Details */}
          <div className="flex flex-col md:flex-row gap-5 items-start">
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  PODUGU MUKESH
                </h4>
                <p className="text-xs text-secondary-500 font-semibold mt-0.5">
                  Software Engineer & Deep Learning Researcher
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Developer of MedVision AI, a deep learning-based disease detection platform capable of identifying diseases from medical images using CNN architectures such as ResNet50 and EfficientNet. Implemented image classification, explainable AI visualizations, patient management, report generation, analytics dashboards, REST APIs, authentication, and cloud-ready deployment using Python, TensorFlow, FastAPI, PostgreSQL, React, and Docker.
              </p>

              {/* Contacts info grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                  <span>mukeshpodugu123@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                  <span>+91 8143999463</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                  <span>Srikakulam, AP, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Education & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/40">
            
            {/* Core Competencies */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-secondary-500" /> Core Competencies
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Python', 'FastAPI', 'Flask', 'SQLAlchemy',
                  'TensorFlow / Keras', 'CNN Models', 'Transfer Learning',
                  'React.js', 'Vite', 'Tailwind CSS', 'Chart.js',
                  'PostgreSQL', 'SQLite', 'Docker', 'RESTful APIs'
                ].map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] bg-slate-50 dark:bg-dark-800 border border-slate-200/50 dark:border-slate-800/50 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Platform Highlights */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-secondary-500" /> Platform Architecture Highlights
              </h5>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                  <span>Multi-modality (Brain, Lung, Skin, Retina) classification</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                  <span>Explainability via visual Grad-CAM heatmaps</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
                  <span>Auto-compiling PDF Medical Report summaries</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

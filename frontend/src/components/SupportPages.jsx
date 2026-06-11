import React, { useState } from 'react';
import { 
  Info, 
  LifeBuoy, 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle,
  HelpCircle,
  Clock,
  Send
} from 'lucide-react';

export function AboutUs() {
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          About MedVision AI
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Learn about our mission, model backbones, and the development architect.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Mission */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/40 pb-3">
            <Info className="w-4.5 h-4.5 text-secondary-500" /> Platform Mission & Vision
          </h3>
          <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
            MedVision AI is designed to demonstrate deep learning computer vision implementations within a production-grade healthcare application framework. By providing automated classifications alongside visual Grad-CAM activation heatmaps and compile-ready PDF reports, the platform bridges the gap between deep neural network processing and practical clinical utility.
          </p>
          
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-350 pt-2">
            Academic & Portfolio Purpose
          </h4>
          <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
            This platform acts as an engineering portfolio demonstration, showcasing the developer's capability in structuring relational PostgreSQL database patterns, building high-speed FastAPI endpoints, deploying modular React user interfaces, and training convolutional neural network backbones using TensorFlow/Keras.
          </p>
        </div>

        {/* Developer Contact Card */}
        <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Lead Developer Profile
          </h3>
          
          <div className="space-y-3 pt-2">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-white">PODUGU MUKESH</div>
              <div className="text-[10px] text-secondary-500 font-semibold uppercase tracking-wider">
                Full-Stack AI Developer
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/40">
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

      </div>
    </div>
  );
}

export function ContactSupport() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Contact MedVision Support
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Open a support ticket or contact the system administrator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Support Ticket Form */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <LifeBuoy className="w-4.5 h-4.5 text-secondary-500" /> Open Clinical Support Ticket
          </h3>

          {submitted && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 text-xs flex gap-2.5 items-start">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="font-semibold">
                Ticket submitted successfully! Dr. Mukesh Podugu or an administrator will follow up shortly.
              </div>
            </div>
          )}

          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Ticket Subject / Issue Modality
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Inference failure on Brain MRI"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:border-secondary-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Detailed Description of Request
              </label>
              <textarea
                rows="4"
                required
                placeholder="Include error codes, model name selected, and patient age if relevant..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:border-secondary-500 dark:text-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-secondary-600 hover:bg-secondary-500 text-xs font-bold text-white shadow-md shadow-secondary-500/10 transition-colors"
            >
              <span>Submit Support Ticket</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* FAQs/Info Card */}
        <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <HelpCircle className="w-4.5 h-4.5 text-secondary-500" /> Support Channels
          </h3>
          
          <div className="space-y-3.5 text-xs text-slate-605 dark:text-slate-400">
            <div>
              <div className="font-bold text-slate-850 dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-secondary-500" /> Response Times
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Support requests are audited continuously. General response window is 12-24 hours.
              </p>
            </div>
            
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/40">
              <div className="font-bold text-slate-850 dark:text-slate-300">Direct Contact Details</div>
              <div className="mt-2 space-y-2 text-[11px] text-slate-400">
                <div>Developer: <b>PODUGU MUKESH</b></div>
                <div>Email: mukeshpodugu123@gmail.com</div>
                <div>Location: Srikakulam, AP</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { 
  Activity, 
  BrainCircuit, 
  ShieldCheck, 
  FileText, 
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function LandingPage({ setView, isAuthenticated }) {
  const stats = [
    { value: '98.3%', label: 'Top Detection Accuracy' },
    { value: '150,000+', label: 'Clinical Scans Simulated' },
    { value: '4+', label: 'Modality Categories Supported' },
    { value: '< 2.5s', label: 'Inference Delivery Time' }
  ];

  const features = [
    {
      icon: BrainCircuit,
      title: 'Advanced Neural Architectures',
      description: 'Leverages state-of-the-art CNN backbones including ResNet50, EfficientNet, and MobileNetV2 configured with Transfer Learning parameters.'
    },
    {
      icon: Sparkles,
      title: 'Explainable AI (Grad-CAM)',
      description: 'Generates gradient-weighted activation mapping heatmaps to visually isolate infected pixels and support clinician decision trust.'
    },
    {
      icon: FileText,
      title: 'Automated Medical Reporting',
      description: 'Compiles diagnoses, patient histories, metrics, and localization maps instantly into print-ready PDF clinical summaries.'
    },
    {
      icon: TrendingUp,
      title: 'Diagnostic Analytics',
      description: 'Aggregates monthly scans, disease rates, and neural model comparisons directly into visual dashboard graphs.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 selection:bg-secondary-500 selection:text-white transition-colors duration-200">
      
      {/* Navigation Header */}
      <header className="fixed top-0 inset-x-0 z-30 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-secondary-600 to-secondary-500 text-white shadow-md shadow-secondary-500/20">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              MedVision <span className="text-secondary-500">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button onClick={() => setView('about')} className="hover:text-secondary-500 transition-colors">About Developer</button>
            <button onClick={() => setView('support')} className="hover:text-secondary-500 transition-colors">Contact Support</button>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-secondary-600 hover:bg-secondary-500 active:bg-secondary-700 rounded-xl transition-all shadow-md shadow-secondary-500/20"
              >
                Go to Workspace <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setView('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-dark-800 rounded-xl transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setView('register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-secondary-600 hover:bg-secondary-500 rounded-xl transition-colors shadow-md shadow-secondary-500/10"
                >
                  Register Account
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-secondary-400/10 dark:bg-secondary-500/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-emerald-400/10 dark:bg-emerald-500/5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 rounded-full bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 text-xs font-bold border border-secondary-100 dark:border-secondary-900/50">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Driven Medical Image Classification & Diagnostics
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Intelligent Disease Detection & <span className="bg-gradient-to-r from-secondary-600 to-secondary-500 bg-clip-text text-transparent">Health Analytics</span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Diagnose chest X-rays, skin diseases, brain tumors, and diabetic retinopathy using deep learning architectures. Complete with explainable Grad-CAM visual heatmaps and dynamic PDF reports.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => setView(isAuthenticated ? 'detection' : 'register')}
              className="px-6 py-3.5 text-base font-semibold text-white bg-secondary-600 hover:bg-secondary-500 rounded-xl shadow-lg shadow-secondary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              Start Diagnostic Scan <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setView('about')}
              className="px-6 py-3.5 text-base font-semibold text-slate-700 bg-white dark:bg-dark-900 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-800/80 transition-all"
            >
              Meet the Developer
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="mt-1 text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Comprehensive Healthcare Platform
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            MedVision AI blends deep convolutional neural network processing with clinical report workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="flex gap-5 p-6 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200/40 dark:border-slate-800/40 hover:border-secondary-500/30 dark:hover:border-secondary-500/20 hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-none transition-all duration-300"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modality Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary-950 via-slate-950 to-slate-950 opacity-90 z-0" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-400">Diagnostic Breadth</span>
              <h2 className="mt-2 text-3xl font-black text-white md:text-4xl leading-tight">
                Supports Multi-Modality Image Classification Models
              </h2>
              <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
                Engineered with diverse diagnosis modules allowing rapid identification and segment scanning parameters for clinical usage.
              </p>
              
              <ul className="mt-8 space-y-3.5">
                {[
                  'Chest X-Ray: Detects Pneumonia and Pulmonary Tuberculosis',
                  'Skin Disease: Identifies Melanoma, Eczema, Psoriasis, and Acne vulgaris',
                  'Brain MRI: Detects brain tumor masses and normal tissues',
                  'Diabetic Retinopathy: Stages retina fundus scans (Mild, Mod, Severe, Normal)'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-200">
                    <ShieldCheck className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-2xl backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-secondary-400" />
                Network Classification Backbones
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'EfficientNetB0', desc: 'Top parameters scaling. Ideal for retinopathy stage gradients.' },
                  { name: 'ResNet50', desc: 'Deep residual skips, outstanding for brain tumor localization.' },
                  { name: 'MobileNetV2', desc: 'Ultra-lightweight parameters. Great performance on chest scans.' }
                ].map((model, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="text-sm font-bold text-white">{model.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{model.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Profile Highlight */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="p-8 md:p-12 rounded-3xl bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-slate-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500/5 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl bg-secondary-100 dark:bg-secondary-950 border border-secondary-200 dark:border-secondary-900 text-secondary-600 dark:text-secondary-400 font-extrabold text-3xl shadow-lg shadow-secondary-500/10">
              PM
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-500">Lead Project Architect</span>
              <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">PODUGU MUKESH</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Full-stack developer and AI researcher focused on building clinical decision support technologies. Created MedVision AI as a showcase platform demonstrating deep learning models (ResNet/EfficientNet), FastAPI backend services, React dashboards, and containerized deployments.
              </p>
              
              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-secondary-500" />
                  mukeshpodugu123@gmail.com
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-secondary-500" />
                  +91 8143999463
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-secondary-500" />
                  Srikakulam, AP, India
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-dark-900/40 py-12 text-slate-500 dark:text-slate-400 text-sm transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-secondary-500" />
            <span className="font-bold text-slate-900 dark:text-white">MedVision AI</span>
            <span className="text-xs border-l border-slate-300 dark:border-slate-700 pl-2">© 2026</span>
          </div>

          <div className="text-center md:text-right text-xs">
            Designed & Developed by <strong className="text-slate-800 dark:text-slate-200">PODUGU MUKESH</strong>
            <br />
            Srikakulam | mukeshpodugu123@gmail.com
          </div>
        </div>
      </footer>
    </div>
  );
}

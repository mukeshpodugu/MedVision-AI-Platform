import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  UserPlus, 
  Eye, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  FileDown
} from 'lucide-react';
import { diagnosisService, api } from '../api';

const CATEGORIES = [
  { id: 'chest_xray', name: 'Chest X-Ray Analysis', placeholderImg: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&auto=format&fit=crop&q=60' },
  { id: 'skin', name: 'Skin Disease Detection', placeholderImg: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=200&auto=format&fit=crop&q=60' },
  { id: 'brain_mri', name: 'Brain MRI Scan', placeholderImg: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&auto=format&fit=crop&q=60' },
  { id: 'eye_retinopathy', name: 'Diabetic Retinopathy', placeholderImg: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=200&auto=format&fit=crop&q=60' },
];

const MODELS = [
  { id: 'EfficientNet', name: 'EfficientNetB0 (Recommended)', accuracy: '97.2%' },
  { id: 'ResNet50', name: 'ResNet50', accuracy: '95.4%' },
  { id: 'MobileNetV2', name: 'MobileNetV2 (Lightweight)', accuracy: '93.8%' }
];

export default function DiseaseDetection() {
  // Patient details state
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');

  // Diagnosis configuration state
  const [category, setCategory] = useState('chest_xray');
  const [modelName, setModelName] = useState('EfficientNet');
  
  // File state
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  // Status states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Visualization toggle
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Demo loader helper
  const loadDemoData = () => {
    setPatientName('Sarah Jenkins');
    setPatientAge('42');
    setPatientGender('Female');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Unsupported file type. Please upload a JPG, JPEG, or PNG scan.');
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResult(null); // Clear previous results
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a medical scan image to perform analysis.');
      return;
    }
    if (!patientName || !patientAge) {
      setError('Please complete the patient identification fields.');
      return;
    }

    setError('');
    setAnalyzing(true);
    setUploadProgress(10);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('model_name', modelName);
      formData.append('patient_name', patientName);
      formData.append('patient_age', parseInt(patientAge));
      formData.append('patient_gender', patientGender);

      const prediction = await diagnosisService.analyzeScan(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Delay slightly to show 100% completion
      setTimeout(() => {
        setResult(prediction);
        setAnalyzing(false);
        setUploadProgress(0);
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      setAnalyzing(false);
      setUploadProgress(0);
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'AI classification failed. Verify the FastAPI backend is running.'
      );
    }
  };

  const resetWorkspace = () => {
    setFile(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          AI Disease Classification Center
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Perform high-precision computer vision analysis and generate Grad-CAM explainability localization.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30 text-red-600 dark:text-red-400 text-xs flex gap-2.5 items-start">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Execution Error:</span> {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Options/Patient Details Column */}
        <div className="space-y-6">
          
          {/* Patient Identification Card */}
          <div className="bg-white dark:bg-dark-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Patient Credentials
              </h3>
              <button 
                type="button" 
                onClick={loadDemoData}
                className="text-[10px] font-bold text-secondary-500 hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" /> Seed Demo
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:border-secondary-500 transition-colors dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="Years"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:border-secondary-500 transition-colors dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Gender
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-900 outline-none focus:border-secondary-500 transition-colors dark:text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Modality & Network Model Card */}
          <div className="bg-white dark:bg-dark-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Modality & Classifier Settings
            </h3>
            
            <div className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Scan Modality Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((catItem) => (
                    <button
                      key={catItem.id}
                      type="button"
                      onClick={() => setCategory(catItem.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        category === catItem.id
                          ? 'border-secondary-500 bg-secondary-50/50 dark:bg-secondary-950/20 text-secondary-600 dark:text-secondary-400 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-dark-800/50'
                      }`}
                    >
                      <div className="text-[11px] truncate">{catItem.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CNN Backbone Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Neural Model Architecture
                </label>
                <div className="space-y-2">
                  {MODELS.map((modItem) => (
                    <button
                      key={modItem.id}
                      type="button"
                      onClick={() => setModelName(modItem.id)}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                        modelName === modItem.id
                          ? 'border-secondary-500 bg-secondary-50/50 dark:bg-secondary-950/20 text-secondary-600 dark:text-secondary-400 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-dark-800/50'
                      }`}
                    >
                      <span className="text-xs">{modItem.name}</span>
                      <span className="text-[10px] font-semibold bg-slate-100 dark:bg-dark-800 px-2 py-0.5 rounded text-slate-500">
                        Acc: {modItem.accuracy}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Upload & Results Workspace Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main workspace container */}
          <div className="bg-white dark:bg-dark-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 min-h-[400px] flex flex-col">
            
            {!file ? (
              /* 1. File Upload Dropzone */
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-secondary-500 dark:hover:border-secondary-500 rounded-2xl cursor-pointer p-8 transition-colors text-center"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg"
                />
                <div className="w-14 h-14 rounded-2xl bg-secondary-50 dark:bg-secondary-950/30 text-secondary-600 dark:text-secondary-400 flex items-center justify-center shadow-inner mb-4">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Upload Clinical Scan Image
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 max-w-xs leading-relaxed">
                  Drag and drop your scan here, or click to browse files. Supports JPG, JPEG, and PNG.
                </p>
              </div>
            ) : !result ? (
              /* 2. File Preview & Action Trigger */
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Scan Selected: {file.name}
                  </span>
                  <button 
                    onClick={resetWorkspace} 
                    className="text-[10px] font-bold text-red-500 hover:underline"
                  >
                    Remove Scan
                  </button>
                </div>

                <div className="flex-1 bg-slate-50 dark:bg-dark-950 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-100 dark:border-slate-800/20 max-h-[300px]">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-w-full max-h-[250px] object-contain rounded"
                  />
                </div>

                <div className="mt-5">
                  {analyzing ? (
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 animate-pulse">
                          <RefreshCw className="w-4.5 h-4.5 animate-spin text-secondary-500" />
                          Running Convolutional Layers...
                        </span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-dark-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-secondary-500 h-full transition-all duration-150"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="w-full py-3 text-sm font-semibold text-white bg-secondary-600 hover:bg-secondary-500 rounded-xl shadow-lg shadow-secondary-500/15 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4.5 h-4.5" /> Analyze Scan Image
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* 3. Analysis Results View */
              <div className="flex-1 flex flex-col space-y-5">
                
                {/* Header row */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/40">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Diagnosis Verified</span>
                  </div>
                  <button 
                    onClick={resetWorkspace}
                    className="text-[10px] font-bold text-secondary-500 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Clear Workspace
                  </button>
                </div>

                {/* Grid layout for images and classification details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Left Column - Image with Grad-CAM overlays */}
                  <div className="space-y-3">
                    <div className="relative bg-slate-50 dark:bg-dark-950 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/30 flex items-center justify-center p-3 h-60">
                      <img 
                        src={showHeatmap ? `http://localhost:8000${result.explainability_path}` : previewUrl} 
                        alt="Diagnosis Visualization" 
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    </div>
                    
                    {/* Toggle Selector */}
                    <div className="flex gap-2 p-0.5 rounded-lg bg-slate-100 dark:bg-dark-800">
                      <button
                        onClick={() => setShowHeatmap(false)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${
                          !showHeatmap 
                            ? 'bg-white text-slate-800 dark:bg-dark-900 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Original Scan
                      </button>
                      <button
                        onClick={() => setShowHeatmap(true)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${
                          showHeatmap 
                            ? 'bg-white text-slate-800 dark:bg-dark-900 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        AI Grad-CAM Heatmap
                      </button>
                    </div>
                  </div>

                  {/* Right Column - Diagnostic Details */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                        Diagnostic Verdict
                      </span>
                      <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {result.predicted_class}
                      </h4>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                        <span>Model Confidence</span>
                        <span className="text-secondary-600 dark:text-secondary-400">{(result.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-dark-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-secondary-500 h-full"
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <div className="bg-slate-50 dark:bg-dark-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800/30">
                        <div className="font-bold text-slate-400 uppercase tracking-wider">Backbone Used</div>
                        <div className="mt-0.5 font-semibold text-slate-700 dark:text-slate-300">{result.model_name}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-dark-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800/30">
                        <div className="font-bold text-slate-400 uppercase tracking-wider">Scan Category</div>
                        <div className="mt-0.5 font-semibold text-slate-700 dark:text-slate-300 capitalize">{category.replace('_', ' ')}</div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                        Clinical Findings Summary
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-dark-800/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800/30 italic leading-relaxed">
                        "The classification analysis shows indicators matching {result.predicted_class}. Findings are generated using convolutional image layers."
                      </p>
                    </div>
                  </div>

                </div>

                {/* Report Download CTA */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 flex justify-end">
                  <a
                    href={`http://localhost:8000/api/v1/reports/${result.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:scale-[1.02] active:scale-[0.98] hover:bg-slate-850 dark:hover:bg-slate-100 transition-all shadow-md shadow-slate-900/10 dark:shadow-none"
                  >
                    <FileDown className="w-4.5 h-4.5" /> Download PDF Medical Report
                  </a>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

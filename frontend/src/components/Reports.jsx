import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FileDown, 
  FileText,
  Calendar,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import { diagnosisService, MEDIA_URL } from '../api';

export default function Reports() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minConfidence, setMinConfidence] = useState('');
  const [error, setError] = useState('');

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await diagnosisService.getHistory(search, category, minConfidence);
      setPredictions(data);
    } catch (err) {
      console.error(err);
      setError('Could not pull patient history. Confirm the FastAPI backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [category, minConfidence]); // Auto refresh on filter changes

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadReports();
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Clinical Scan Archives & Reports
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Directory of all historical patient scan classifications and generated PDF summaries.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30 text-red-600 dark:text-red-400 text-xs flex gap-2.5 items-start">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Filter and Search Bar Card */}
      <div className="bg-white dark:bg-dark-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Patient Name or Predicted Diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:border-secondary-500 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-900 text-slate-600 dark:text-slate-400 outline-none focus:border-secondary-500"
          >
            <option value="">All Modalities</option>
            <option value="chest_xray">Chest X-Ray</option>
            <option value="skin">Skin Disease</option>
            <option value="brain_mri">Brain MRI</option>
            <option value="eye_retinopathy">Diabetic Retinopathy</option>
          </select>

          {/* Confidence Filter */}
          <select
            value={minConfidence}
            onChange={(e) => setMinConfidence(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-900 text-slate-600 dark:text-slate-400 outline-none focus:border-secondary-500"
          >
            <option value="">Any Confidence</option>
            <option value="0.95">Over 95% Confidence</option>
            <option value="0.90">Over 90% Confidence</option>
            <option value="0.80">Over 80% Confidence</option>
          </select>

        </form>
      </div>

      {/* Reports Listing Table */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-dark-850 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-3">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-350">
              No Archive Records Found
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              No diagnostic predictions match your current search queries or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-dark-950/40 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/40">
                  <th className="p-4">Patient Information</th>
                  <th className="p-4">Modality</th>
                  <th className="p-4">Diagnosis Verdict</th>
                  <th className="p-4">Confidence</th>
                  <th className="p-4">CNN Architecture</th>
                  <th className="p-4">Record Timestamp</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
                {predictions.map((pred) => (
                  <tr 
                    key={pred.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-dark-800/10 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {pred.patient.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                        Age: {pred.patient.age} yrs &middot; Gender: {pred.patient.gender}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 capitalize">
                      {pred.image.category.replace('_', ' ')}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {pred.predicted_class}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-secondary-600 dark:text-secondary-400">
                        {(pred.confidence * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-500">
                      {pred.model_name}
                    </td>
                    <td className="p-4 text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(pred.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={`${MEDIA_URL}/api/v1/reports/${pred.id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 dark:bg-dark-800 dark:text-slate-200 hover:bg-secondary-500 hover:text-white dark:hover:bg-secondary-600 dark:hover:text-white rounded-lg font-semibold transition-all"
                      >
                        <FileDown className="w-3.5 h-3.5" /> PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

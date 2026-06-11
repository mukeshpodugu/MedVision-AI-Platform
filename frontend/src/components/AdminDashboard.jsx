import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Terminal, 
  Sliders, 
  AlertCircle, 
  CheckCircle,
  Database,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users'); // users, logs, metrics
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Custom metrics state for slider updates
  const [selectedCategory, setSelectedCategory] = useState('chest_xray');
  const [selectedModel, setSelectedModel] = useState('EfficientNet');
  const [accuracy, setAccuracy] = useState(97.2);
  const [precision, setPrecision] = useState(96.9);
  const [recall, setRecall] = useState(97.0);
  const [f1, setF1] = useState(96.9);
  const [submittingMetrics, setSubmittingMetrics] = useState(false);
  const [metricsSuccess, setMetricsSuccess] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'users') {
        const userData = await adminService.getUsers();
        setUsers(userData);
      } else if (activeTab === 'logs') {
        const logData = await adminService.getActivityLogs();
        setLogs(logData);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to pull admin records. Double check admin privilege status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const handleMetricsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMetricsSuccess('');
    setSubmittingMetrics(true);

    try {
      await adminService.updateMetrics({
        model_name: selectedModel,
        category_name: selectedCategory,
        accuracy: accuracy / 100,
        precision: precision / 100,
        recall: recall / 100,
        f1_score: f1 / 100
      });
      setMetricsSuccess(`Successfully updated metrics for ${selectedModel} in ${selectedCategory.replace('_', ' ')}!`);
      // Reset success message
      setTimeout(() => setMetricsSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to update CNN metrics in database.');
    } finally {
      setSubmittingMetrics(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5.5 h-5.5 text-secondary-500" /> Admin Diagnostic Control
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audit system access, activity logs, and edit convolutional neural network calibration weights.
          </p>
        </div>
        <button 
          onClick={loadAdminData}
          className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30 text-red-600 dark:text-red-400 text-xs flex gap-2.5 items-start">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'users', name: 'User Management', icon: Users },
          { id: 'logs', name: 'System Activity Logs', icon: Terminal },
          { id: 'metrics', name: 'CNN Metrics Config', icon: Sliders }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                isActive
                  ? 'border-secondary-500 text-secondary-600 dark:text-secondary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Content panes */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
        
        {loading && activeTab !== 'metrics' ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === 'users' ? (
          /* User Management Tab */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-dark-950/40 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/40">
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Role Clearance</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs">
                {users.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/10">
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{userItem.full_name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{userItem.email}</td>
                    <td className="p-4 uppercase font-semibold text-secondary-650 tracking-wider text-[10px]">
                      {userItem.role}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                        Active
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(userItem.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'logs' ? (
          /* System Logs Tab */
          <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto font-mono text-[11px] text-slate-650 bg-slate-950 text-emerald-400 dark:border-none p-5 rounded-2xl">
            <div className="pb-2 text-[10px] font-bold text-emerald-500 border-b border-emerald-900/30 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4.5 h-4.5" /> MEDVISION-AI AUDIT SHELL v1.0.0
            </div>
            {logs.length === 0 ? (
              <div className="text-center py-6 text-slate-500">
                No activity logs in database registry.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex flex-col md:flex-row md:items-center justify-between border-b border-emerald-950/20 py-2.5 gap-1 select-text">
                  <div className="flex gap-2">
                    <span className="text-emerald-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-slate-300 font-medium">{log.action}</span>
                  </div>
                  <div className="text-emerald-600 text-[10px] uppercase font-semibold">
                    USR-ID: {log.user_id || 'ANONYMOUS'}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* CNN Metrics Configurations Tab */
          <div className="p-6">
            
            {metricsSuccess && (
              <div className="p-4 mb-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 text-xs flex gap-2.5 items-start">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="font-semibold">{metricsSuccess}</div>
              </div>
            )}

            <form onSubmit={handleMetricsSubmit} className="space-y-6 max-w-xl">
              <div className="grid grid-cols-2 gap-4">
                
                {/* Modality Category */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    Modality Target
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-900 text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="chest_xray">Chest X-Ray</option>
                    <option value="skin">Skin Disease</option>
                    <option value="brain_mri">Brain MRI</option>
                    <option value="eye_retinopathy">Diabetic Retinopathy</option>
                  </select>
                </div>

                {/* Model Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    Classifier Model Target
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-900 text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="EfficientNet">EfficientNetB0</option>
                    <option value="ResNet50">ResNet50</option>
                    <option value="MobileNetV2">MobileNetV2</option>
                  </select>
                </div>

              </div>

              {/* Sliders for evaluations metrics */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Calibrate CNN Evaluation Coefficients
                </span>
                
                {[
                  { label: 'Accuracy Score', value: accuracy, setter: setAccuracy },
                  { label: 'Precision Score', value: precision, setter: setPrecision },
                  { label: 'Recall Score', value: recall, setter: setRecall },
                  { label: 'F1-Score Coefficient', value: f1, setter: setF1 }
                ].map((slider, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                      <span>{slider.label}</span>
                      <span className="text-secondary-500">{slider.value.toFixed(1)}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      step="0.1"
                      value={slider.value}
                      onChange={(e) => slider.setter(parseFloat(e.target.value))}
                      className="w-full accent-secondary-500"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={submittingMetrics}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-secondary-600 hover:bg-secondary-500 active:bg-secondary-700 disabled:opacity-50 text-xs font-bold text-white shadow-md shadow-secondary-500/10 transition-all"
              >
                {submittingMetrics ? 'Submitting configurations...' : 'Save Configuration Parameters'}
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}

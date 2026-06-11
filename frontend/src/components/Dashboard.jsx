import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Users, 
  Percent, 
  FolderHeart,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { analyticsService, diagnosisService } from '../api';

// Chart.js imports & registrations
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard({ setView }) {
  const [data, setData] = useState(null);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashboardData = await analyticsService.getDashboardData();
        setData(dashboardData);
        
        const historyData = await diagnosisService.getHistory();
        // Take first 5 for dashboard
        setRecentPredictions(historyData.slice(0, 5));
      } catch (err) {
        console.error(err);
        setError('Failed to pull system statistics. Make sure FastAPI backend is active.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-10 h-10 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm flex gap-3 items-center">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <div>{error}</div>
      </div>
    );
  }

  // 1. Pie Chart - Disease Distribution
  const pieLabels = Object.keys(data.disease_distribution);
  const pieValues = Object.values(data.disease_distribution);
  const pieData = {
    labels: pieLabels,
    datasets: [{
      data: pieValues,
      backgroundColor: [
        '#0284c7', '#38bdf8', '#0ea5e9', '#22c55e', '#34d399', 
        '#f59e0b', '#ef4444', '#a855f7', '#6366f1'
      ],
      borderWidth: 0
    }]
  };

  // 2. Line Chart - Monthly Prediction Trends
  const lineLabels = Object.keys(data.monthly_predictions);
  const lineValues = Object.values(data.monthly_predictions);
  const lineData = {
    labels: lineLabels,
    datasets: [{
      label: 'Monthly Scans',
      data: lineValues,
      fill: true,
      borderColor: '#0284c7',
      backgroundColor: 'rgba(2, 132, 199, 0.1)',
      tension: 0.4
    }]
  };

  // 3. Bar Chart - Model Performance (Accuracy)
  // Filter for Chest X-ray models for comparison
  const chestModels = data.model_performance.filter(m => m.category === 'Chest X-Ray');
  const barData = {
    labels: chestModels.map(m => m.model_name),
    datasets: [
      {
        label: 'Accuracy',
        data: chestModels.map(m => m.accuracy),
        backgroundColor: 'rgba(34, 197, 94, 0.75)',
        borderColor: '#22c55e',
        borderWidth: 1
      },
      {
        label: 'F1-Score',
        data: chestModels.map(m => m.f1_score),
        backgroundColor: 'rgba(2, 132, 199, 0.75)',
        borderColor: '#0284c7',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          font: { size: 10 },
          color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#475569'
        }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#64748b', font: { size: 9 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 9 } }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          font: { size: 9 },
          color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#475569'
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Clinical Analytics Dashboard
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Realtime diagnostic workloads and neural network evaluation telemetry.
        </p>
      </div>

      {/* Grid Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Cumulative Scans', value: data.total_scans, icon: Activity, color: 'text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20' },
          { label: 'Registered Patients', value: data.total_patients, icon: Users, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Avg Scan Confidence', value: `${(data.average_confidence * 100).toFixed(1)}%`, icon: Percent, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
          { label: 'CNN Modality Support', value: '4 Modules', icon: FolderHeart, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-dark-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {stat.label}
                </span>
                <span className="text-lg md:text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                  {stat.value}
                </span>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-5.5 h-5.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Visualization Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-secondary-500" />
            Monthly Diagnostics Workload Trend
          </h3>
          <div className="h-64">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-dark-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
            Pathology / Disease Prevalence
          </h3>
          <div className="h-64 relative">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Bar Chart (Model Performance) */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
            Classifier Performance Comparison (Chest X-Ray)
          </h3>
          <div className="h-64">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white dark:bg-dark-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Recent Clinical Scans
            </h3>
            <button 
              onClick={() => setView('reports')}
              className="text-[10px] font-bold text-secondary-500 hover:underline"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {recentPredictions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No recent predictions logged yet.
              </div>
            ) : (
              recentPredictions.map((pred) => (
                <div key={pred.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-dark-800/30 border border-slate-100 dark:border-slate-800/30">
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {pred.patient.name}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">
                      {pred.predicted_class} ({pred.model_name})
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-secondary-600 dark:text-secondary-400 block">
                      {(pred.confidence * 100).toFixed(1)}%
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      {new Date(pred.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

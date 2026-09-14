"use client";

import { useState, useMemo } from 'react';
import { useScreenLogs } from '@/hooks/useScreenLogs';
import LogCard from '@/components/LogCard';
import { Search, Activity, RefreshCw } from 'lucide-react';

const APPS = [
  { id: 'all', name: 'All Apps' },
  { id: 'whatsapp', name: 'WhatsApp' },
  { id: 'chrome', name: 'Chrome' },
  { id: 'instagram', name: 'Instagram' },
];

export default function Dashboard() {
  const { logs, loading, error, isConnected, refetch } = useScreenLogs();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Filter by App
      if (activeTab !== 'all') {
        const pkg = (log.package_name || '').toLowerCase();
        if (!pkg.includes(activeTab)) return false;
      }
      
      // Filter by Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const content = (log.content || '').toLowerCase();
        if (!content.includes(query)) return false;
      }
      
      return true;
    });
  }, [logs, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-100 font-sans selection:bg-indigo-500/30">
      {/* Top Navbar */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-500 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Activity size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Screen Logs Admin
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800">
              <div className="relative flex h-2.5 w-2.5">
                {isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              </div>
              <span className="text-xs font-medium text-gray-300">
                {isConnected ? 'Live' : 'Disconnected'}
              </span>
            </div>
            <button 
              onClick={refetch}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Refresh Logs"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Controls */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Search</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search keywords..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">App Filters</h2>
            <div className="flex flex-col space-y-1">
              {APPS.map(app => (
                <button
                  key={app.id}
                  onClick={() => setActiveTab(app.id)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeTab === app.id 
                      ? 'bg-indigo-500/10 text-indigo-400 font-medium' 
                      : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                  }`}
                >
                  {app.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Logs Feed */}
        <div className="flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <p className="font-semibold">Error connecting to database</p>
              <p className="mt-1 opacity-80">{error.message}</p>
              <p className="mt-2 text-xs">Please check your SUPABASE_URL and SUPABASE_ANON_KEY in .env.local</p>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">
              Recent Activity {filteredLogs.length > 0 && <span className="text-gray-500 text-sm font-normal ml-2">({filteredLogs.length} logs)</span>}
            </h2>
          </div>

          {loading && logs.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-gray-900 border border-gray-800 rounded-xl p-5 h-32"></div>
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-20 bg-gray-900/50 border border-gray-800/50 rounded-xl border-dashed">
              <p className="text-gray-400 text-sm">No logs found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map(log => (
                <LogCard key={log.id || log.captured_at} log={log} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

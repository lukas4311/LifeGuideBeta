import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { modules } from '@/data/modules';
import { 
  Users, 
  BarChart3, 
  MessageSquare, 
  Download, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BookOpen,
  Calendar,
  Mail,
  X,
  Send,
  ArrowLeft,
  RefreshCw,
  FileText,
  UserPlus,
  Activity,
  CheckCircle2,
  PenLine
} from 'lucide-react';

interface Client {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_sign_in: string;
  progress: any[];
  avgProgress: number;
  totalExercises: number;
  journalEntries: number;
  lastActivity: string;
}

interface Analytics {
  totalClients: number;
  activeClients: number;
  totalJournalEntries: number;
  modulePopularity: { moduleId: number; usersStarted: number; avgProgress: number }[];
  stuckPoints: { moduleId: number; usersStarted: number; avgProgress: number }[];
  engagementByDay: Record<string, number>;
}

interface WeeklyReport {
  reportPeriod: { start: string; end: string };
  newClients: { id: string; email: string; name: string; created_at: string }[];
  newClientsCount: number;
  previousWeekNewClients: number;
  mostActiveClients: { 
    id: string; 
    name: string; 
    email: string;
    journalCount: number; 
    progressUpdates: number;
    totalActivity: number;
  }[];
  totalExercisesThisWeek: number;
  newJournalEntries: number;
  previousWeekJournalEntries: number;
  journalsByDay: Record<string, number>;
  totalActiveUsers: number;
}

interface AdminDashboardProps {
  user: User;
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'messages' | 'reports'>('overview');
  const [clients, setClients] = useState<Client[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientDetail, setClientDetail] = useState<any>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'reports' && !weeklyReport) {
      loadWeeklyReport();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get clients
      const { data: clientsData, error: clientsError } = await supabase.functions.invoke('admin-dashboard', {
        body: { action: 'getClients' }
      });

      if (clientsError) throw clientsError;
      setClients(clientsData.clients || []);

      // Get analytics
      const { data: analyticsData, error: analyticsError } = await supabase.functions.invoke('admin-dashboard', {
        body: { action: 'getAnalytics' }
      });

      if (analyticsError) throw analyticsError;
      setAnalytics(analyticsData);

    } catch (err: any) {
      console.error('Error loading dashboard:', err);
      setError(err.message || 'Chyba při načítání dat');
    } finally {
      setLoading(false);
    }
  };

  const loadWeeklyReport = async () => {
    setReportLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-dashboard', {
        body: { action: 'getWeeklyReport' }
      });

      if (error) throw error;
      setWeeklyReport(data);
    } catch (err: any) {
      console.error('Error loading weekly report:', err);
    } finally {
      setReportLoading(false);
    }
  };

  const loadClientDetail = async (client: Client) => {
    setSelectedClient(client);
    try {
      const { data, error } = await supabase.functions.invoke('admin-dashboard', {
        body: { action: 'getClientDetail', clientId: client.id }
      });

      if (error) throw error;
      setClientDetail(data);
    } catch (err: any) {
      console.error('Error loading client detail:', err);
    }
  };

  const sendMessage = async () => {
    if (!selectedClient || !messageSubject.trim() || !messageBody.trim()) return;
    
    setSendingMessage(true);
    try {
      const { error } = await supabase.functions.invoke('admin-dashboard', {
        body: { 
          action: 'sendMessage',
          clientId: selectedClient.id,
          subject: messageSubject,
          message: messageBody
        }
      });

      if (error) throw error;
      
      setShowMessageModal(false);
      setMessageSubject('');
      setMessageBody('');
      
      // Reload client detail to show new message
      loadClientDetail(selectedClient);
    } catch (err: any) {
      console.error('Error sending message:', err);
      alert('Chyba při odesílání zprávy');
    } finally {
      setSendingMessage(false);
    }
  };

  const exportToCSV = () => {
    if (!clients.length) return;

    const headers = ['Jméno', 'Email', 'Registrace', 'Poslední aktivita', 'Průměrný pokrok (%)', 'Dokončená cvičení', 'Zápisů v deníku'];
    
    const rows = clients.map(c => [
      c.name,
      c.email,
      new Date(c.created_at).toLocaleDateString('cs-CZ'),
      c.lastActivity ? new Date(c.lastActivity).toLocaleDateString('cs-CZ') : '-',
      c.avgProgress.toString(),
      c.totalExercises.toString(),
      c.journalEntries.toString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `klienti_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportReportToPDF = async () => {
    if (!reportRef.current || !weeklyReport) return;

    // Create a printable version
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Týdenní report - ${formatDateRange(weeklyReport.reportPeriod.start, weeklyReport.reportPeriod.end)}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1f2937; }
          .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #8b5cf6; }
          .header h1 { font-size: 28px; color: #8b5cf6; margin-bottom: 8px; }
          .header p { color: #6b7280; font-size: 14px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
          .stat-card { background: #f9fafb; border-radius: 12px; padding: 20px; text-align: center; }
          .stat-card .value { font-size: 32px; font-weight: bold; color: #1f2937; }
          .stat-card .label { font-size: 12px; color: #6b7280; margin-top: 4px; }
          .stat-card .trend { font-size: 12px; margin-top: 8px; }
          .trend.up { color: #10b981; }
          .trend.down { color: #ef4444; }
          .section { margin-bottom: 32px; }
          .section h2 { font-size: 18px; color: #1f2937; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
          .client-list { list-style: none; }
          .client-list li { padding: 12px; background: #f9fafb; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; }
          .client-list .name { font-weight: 600; }
          .client-list .email { color: #6b7280; font-size: 14px; }
          .client-list .activity { color: #8b5cf6; font-weight: 600; }
          .chart-placeholder { background: #f3f4f6; border-radius: 8px; padding: 20px; }
          .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; }
          .bar { background: #8b5cf6; border-radius: 4px 4px 0 0; flex: 1; min-width: 30px; position: relative; }
          .bar-label { position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #6b7280; white-space: nowrap; }
          .bar-value { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 600; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
          @media print { body { padding: 20px; } .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Týdenní report</h1>
          <p>${formatDateRange(weeklyReport.reportPeriod.start, weeklyReport.reportPeriod.end)}</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="value">${weeklyReport.newClientsCount}</div>
            <div class="label">Noví klienti</div>
            <div class="trend ${weeklyReport.newClientsCount >= weeklyReport.previousWeekNewClients ? 'up' : 'down'}">
              ${weeklyReport.newClientsCount >= weeklyReport.previousWeekNewClients ? '↑' : '↓'} 
              ${Math.abs(weeklyReport.newClientsCount - weeklyReport.previousWeekNewClients)} oproti minulému týdnu
            </div>
          </div>
          <div class="stat-card">
            <div class="value">${weeklyReport.totalActiveUsers}</div>
            <div class="label">Aktivních klientů</div>
          </div>
          <div class="stat-card">
            <div class="value">${weeklyReport.totalExercisesThisWeek}</div>
            <div class="label">Dokončených cvičení</div>
          </div>
          <div class="stat-card">
            <div class="value">${weeklyReport.newJournalEntries}</div>
            <div class="label">Nových zápisů v deníku</div>
            <div class="trend ${weeklyReport.newJournalEntries >= weeklyReport.previousWeekJournalEntries ? 'up' : 'down'}">
              ${weeklyReport.newJournalEntries >= weeklyReport.previousWeekJournalEntries ? '↑' : '↓'} 
              ${Math.abs(weeklyReport.newJournalEntries - weeklyReport.previousWeekJournalEntries)} oproti minulému týdnu
            </div>
          </div>
        </div>

        ${weeklyReport.newClients.length > 0 ? `
        <div class="section">
          <h2>Noví klienti tento týden</h2>
          <ul class="client-list">
            ${weeklyReport.newClients.map(c => `
              <li>
                <div>
                  <div class="name">${c.name}</div>
                  <div class="email">${c.email}</div>
                </div>
                <div class="activity">${formatDate(c.created_at)}</div>
              </li>
            `).join('')}
          </ul>
        </div>
        ` : ''}

        ${weeklyReport.mostActiveClients.length > 0 ? `
        <div class="section">
          <h2>Nejaktivnější klienti</h2>
          <ul class="client-list">
            ${weeklyReport.mostActiveClients.map(c => `
              <li>
                <div>
                  <div class="name">${c.name}</div>
                  <div class="email">${c.email}</div>
                </div>
                <div class="activity">${c.totalActivity} aktivit (${c.journalCount} zápisů, ${c.progressUpdates} cvičení)</div>
              </li>
            `).join('')}
          </ul>
        </div>
        ` : ''}

        <div class="section">
          <h2>Aktivita v deníku za posledních 7 dní</h2>
          <div class="chart-placeholder">
            <div class="bar-chart">
              ${Object.entries(weeklyReport.journalsByDay)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, count]) => {
                  const maxCount = Math.max(...Object.values(weeklyReport.journalsByDay), 1);
                  const height = Math.max((count / maxCount) * 100, 5);
                  const dayName = new Date(date).toLocaleDateString('cs-CZ', { weekday: 'short' });
                  return `
                    <div class="bar" style="height: ${height}%">
                      <span class="bar-value">${count}</span>
                      <span class="bar-label">${dayName}</span>
                    </div>
                  `;
                }).join('')}
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Vygenerováno: ${new Date().toLocaleString('cs-CZ')}</p>
        </div>
      </body>
      </html>
    `;

    // Open print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })} - ${endDate.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Načítání dat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Chyba přístupu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Zpět na hlavní stránku
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Správa klientů a analytika</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadDashboardData}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Obnovit data"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {[
              { id: 'overview', label: 'Přehled', icon: BarChart3 },
              { id: 'clients', label: 'Klienti', icon: Users },
              { id: 'reports', label: 'Týdenní reporty', icon: FileText },
              { id: 'messages', label: 'Zprávy', icon: MessageSquare }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedClient(null);
                }}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Celkem klientů</p>
                    <p className="text-2xl font-bold text-gray-800">{analytics.totalClients}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Aktivních klientů</p>
                    <p className="text-2xl font-bold text-gray-800">{analytics.activeClients}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Zápisů v deníku</p>
                    <p className="text-2xl font-bold text-gray-800">{analytics.totalJournalEntries}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Aktivita (30 dní)</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {Object.values(analytics.engagementByDay).reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Module Popularity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Popularita modulů</h3>
              <div className="space-y-4">
                {analytics.modulePopularity.map(mp => {
                  const module = modules.find(m => m.id === mp.moduleId);
                  return (
                    <div key={mp.moduleId} className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: module?.color }}
                      >
                        {mp.moduleId}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-700">{module?.title}</span>
                          <span className="text-sm text-gray-500">
                            {mp.usersStarted} klientů • {mp.avgProgress}% průměr
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${mp.avgProgress}%`,
                              backgroundColor: module?.color 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stuck Points */}
            {analytics.stuckPoints.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-bold text-gray-800">Kde se klienti zasekávají</h3>
                </div>
                <div className="space-y-3">
                  {analytics.stuckPoints.map(sp => {
                    const module = modules.find(m => m.id === sp.moduleId);
                    return (
                      <div key={sp.moduleId} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: module?.color }}
                          >
                            {sp.moduleId}
                          </div>
                          <span className="font-medium text-gray-700">{module?.title}</span>
                        </div>
                        <span className="text-orange-600 font-medium">
                          Průměrný pokrok: {sp.avgProgress}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-bold text-gray-800">Seznam klientů ({clients.length})</h3>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {clients.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    Zatím žádní klienti
                  </div>
                ) : (
                  clients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => loadClientDetail(client)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                        selectedClient?.id === client.id ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-800">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-600 rounded-full"
                              style={{ width: `${client.avgProgress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{client.avgProgress}%</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Client Detail */}
            <div className="lg:col-span-2">
              {selectedClient && clientDetail ? (
                <div className="space-y-6">
                  {/* Client Header */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{selectedClient.name}</h2>
                        <p className="text-gray-500">{selectedClient.email}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Registrace: {formatDate(selectedClient.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowMessageModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Poslat zprávu
                      </button>
                    </div>
                  </div>

                  {/* Progress by Module */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h3 className="font-bold text-gray-800 mb-4">Pokrok v modulech</h3>
                    <div className="space-y-3">
                      {modules.map(module => {
                        const progress = clientDetail.progress?.find((p: any) => p.module_id === module.id);
                        const progressValue = progress?.progress || 0;
                        const exercises = progress?.completed_exercises?.length || 0;
                        
                        return (
                          <div key={module.id} className="flex items-center gap-4">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: module.color }}
                            >
                              {module.id}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-700">{module.title}</span>
                                <span className="text-sm text-gray-500">
                                  {progressValue}% • {exercises} cvičení
                                </span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all"
                                  style={{ 
                                    width: `${progressValue}%`,
                                    backgroundColor: module.color 
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Journal Entries */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h3 className="font-bold text-gray-800 mb-4">
                      Deník vděčnosti ({clientDetail.journalEntries?.length || 0} zápisů)
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {clientDetail.journalEntries?.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Zatím žádné zápisy</p>
                      ) : (
                        clientDetail.journalEntries?.slice(0, 10).map((entry: any) => (
                          <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-purple-600 uppercase">
                                {entry.category}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDate(entry.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-700">{entry.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Sent Messages */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h3 className="font-bold text-gray-800 mb-4">
                      Odeslané zprávy ({clientDetail.messages?.length || 0})
                    </h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {clientDetail.messages?.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Zatím žádné zprávy</p>
                      ) : (
                        clientDetail.messages?.map((msg: any) => (
                          <div key={msg.id} className="p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-800">{msg.subject}</span>
                              <span className="text-xs text-gray-400">
                                {formatDate(msg.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm">{msg.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 border text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Vyberte klienta pro zobrazení detailů</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Weekly Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Týdenní report</h2>
                {weeklyReport && (
                  <p className="text-gray-500">
                    {formatDateRange(weeklyReport.reportPeriod.start, weeklyReport.reportPeriod.end)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={loadWeeklyReport}
                  disabled={reportLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${reportLoading ? 'animate-spin' : ''}`} />
                  Obnovit
                </button>
                <button
                  onClick={exportReportToPDF}
                  disabled={!weeklyReport || reportLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>

            {reportLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
              </div>
            ) : weeklyReport ? (
              <div ref={reportRef} className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-500">Noví klienti</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-bold text-gray-800">{weeklyReport.newClientsCount}</span>
                      <div className={`flex items-center gap-1 text-sm ${getTrendColor(weeklyReport.newClientsCount, weeklyReport.previousWeekNewClients)}`}>
                        {getTrendIcon(weeklyReport.newClientsCount, weeklyReport.previousWeekNewClients)}
                        <span>{Math.abs(weeklyReport.newClientsCount - weeklyReport.previousWeekNewClients)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">oproti minulému týdnu</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-500">Aktivních klientů</span>
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{weeklyReport.totalActiveUsers}</span>
                    <p className="text-xs text-gray-400 mt-2">tento týden</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-500">Dokončená cvičení</span>
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{weeklyReport.totalExercisesThisWeek}</span>
                    <p className="text-xs text-gray-400 mt-2">tento týden</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <PenLine className="w-5 h-5 text-yellow-600" />
                      </div>
                      <span className="text-sm text-gray-500">Nové zápisy v deníku</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-bold text-gray-800">{weeklyReport.newJournalEntries}</span>
                      <div className={`flex items-center gap-1 text-sm ${getTrendColor(weeklyReport.newJournalEntries, weeklyReport.previousWeekJournalEntries)}`}>
                        {getTrendIcon(weeklyReport.newJournalEntries, weeklyReport.previousWeekJournalEntries)}
                        <span>{Math.abs(weeklyReport.newJournalEntries - weeklyReport.previousWeekJournalEntries)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">oproti minulému týdnu</p>
                  </div>
                </div>

                {/* New Clients List */}
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                    Noví klienti tento týden ({weeklyReport.newClients.length})
                  </h3>
                  {weeklyReport.newClients.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">Žádní noví klienti tento týden</p>
                  ) : (
                    <div className="divide-y">
                      {weeklyReport.newClients.map(client => (
                        <div key={client.id} className="py-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{client.name}</p>
                            <p className="text-sm text-gray-500">{client.email}</p>
                          </div>
                          <span className="text-sm text-gray-400">{formatDate(client.created_at)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Most Active Clients */}
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    Nejaktivnější klienti
                  </h3>
                  {weeklyReport.mostActiveClients.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">Žádná aktivita tento týden</p>
                  ) : (
                    <div className="space-y-3">
                      {weeklyReport.mostActiveClients.map((client, index) => (
                        <div key={client.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{client.name}</p>
                            <p className="text-sm text-gray-500">{client.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-purple-600">{client.totalActivity} aktivit</p>
                            <p className="text-xs text-gray-400">
                              {client.journalCount} zápisů • {client.progressUpdates} cvičení
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Journal Activity Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <PenLine className="w-5 h-5 text-yellow-600" />
                    Aktivita v deníku za posledních 7 dní
                  </h3>
                  <div className="h-48">
                    <div className="flex items-end justify-between h-full gap-2">
                      {Object.entries(weeklyReport.journalsByDay)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([date, count]) => {
                          const maxCount = Math.max(...Object.values(weeklyReport.journalsByDay), 1);
                          const height = Math.max((count / maxCount) * 100, 5);
                          const dayName = new Date(date).toLocaleDateString('cs-CZ', { weekday: 'short' });
                          const dayNum = new Date(date).getDate();
                          
                          return (
                            <div key={date} className="flex-1 flex flex-col items-center">
                              <span className="text-sm font-bold text-gray-800 mb-2">{count}</span>
                              <div 
                                className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-500"
                                style={{ height: `${height}%`, minHeight: '8px' }}
                              />
                              <div className="mt-2 text-center">
                                <p className="text-xs font-medium text-gray-600">{dayName}</p>
                                <p className="text-xs text-gray-400">{dayNum}.</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 border text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Načítání reportu...</p>
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <h3 className="font-bold text-gray-800 mb-6">Hromadné zprávy</h3>
            <p className="text-gray-500 mb-4">
              Pro odeslání zprávy konkrétnímu klientovi přejděte na záložku "Klienti" a vyberte klienta.
            </p>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Funkce hromadných zpráv bude brzy k dispozici</p>
            </div>
          </div>
        )}
      </main>

      {/* Message Modal */}
      {showMessageModal && selectedClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">
                Zpráva pro {selectedClient.name}
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Předmět
                </label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Předmět zprávy..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zpráva
                </label>
                <textarea
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Napište svou zprávu..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowMessageModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={sendMessage}
                disabled={sendingMessage || !messageSubject.trim() || !messageBody.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingMessage ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Odeslat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

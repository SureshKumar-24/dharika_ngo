'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, X, Lock } from 'lucide-react';

type Volunteer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  interest: 'food' | 'teaching' | 'both';
  availability: string;
  source: string;
  created_at: string;
};

type Suggestion = {
  id: number;
  name: string | null;
  email: string | null;
  message: string;
  source: string;
  created_at: string;
};

type StudentQuery = {
  id: number;
  name: string;
  age: string;
  city: string;
  locality: string;
  student_class: string;
  subject: string;
  topic: string;
  phone: string;
  email: string;
  attending_offline_classes: string;
  status: string;
  created_at: string;
};

type FoodAlert = {
  id: number;
  donor_type: string;
  establishment_name: string;
  contact_person_name: string;
  phone: string;
  address: string;
  city: string;
  quantity: string;
  prepared_at: string;
  expiry_estimate: string;
  photo_url: string | null;
  status: string;
  created_at: string;
};

type Tab = 'volunteers' | 'suggestions' | 'student-queries' | 'food-alerts';

const ITEMS_PER_PAGE = 10;

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('volunteers');
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [studentQueries, setStudentQueries] = useState<StudentQuery[]>([]);
  const [foodAlerts, setFoodAlerts] = useState<FoodAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [volunteersRes, suggestionsRes, studentQueriesRes, foodAlertsRes] = await Promise.all([
        fetch('/api/admin/volunteers'),
        fetch('/api/admin/suggestions'),
        fetch('/api/admin/student-queries'),
        fetch('/api/admin/food-alerts'),
      ]);

      if (!volunteersRes.ok || !suggestionsRes.ok || !studentQueriesRes.ok || !foodAlertsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const volunteersData = await volunteersRes.json();
      const suggestionsData = await suggestionsRes.json();
      const studentQueriesData = await studentQueriesRes.json();
      const foodAlertsData = await foodAlertsRes.json();

      setVolunteers(volunteersData.volunteers || []);
      setSuggestions(suggestionsData.suggestions || []);
      setStudentQueries(studentQueriesData.queries || []);
      setFoodAlerts(foodAlertsData.alerts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Update student query status
  const updateStudentQueryStatus = async (id: number, newStatus: string, videoUrl?: string) => {
    try {
      const response = await fetch(`/api/admin/student-queries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, videoUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setStudentQueries(prev =>
        prev.map(q => q.id === id ? { ...q, status: newStatus } : q)
      );
    } catch (error) {
      console.error('Error updating student query status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  // Update food alert status
  const updateFoodAlertStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/food-alerts/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setFoodAlerts(prev =>
        prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
      );
    } catch (error) {
      console.error('Error updating food alert status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  // Filter data based on search query
  const filteredVolunteers = useMemo(() => {
    if (!searchQuery) return volunteers;
    const query = searchQuery.toLowerCase();
    return volunteers.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.email.toLowerCase().includes(query) ||
        v.phone.includes(query) ||
        v.city.toLowerCase().includes(query)
    );
  }, [volunteers, searchQuery]);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return suggestions;
    const query = searchQuery.toLowerCase();
    return suggestions.filter(
      (s) =>
        s.name?.toLowerCase().includes(query) ||
        s.email?.toLowerCase().includes(query) ||
        s.message.toLowerCase().includes(query)
    );
  }, [suggestions, searchQuery]);

  const filteredStudentQueries = useMemo(() => {
    if (!searchQuery) return studentQueries;
    const query = searchQuery.toLowerCase();
    return studentQueries.filter(
      (q) =>
        q.name.toLowerCase().includes(query) ||
        q.email.toLowerCase().includes(query) ||
        q.phone.includes(query) ||
        q.city.toLowerCase().includes(query) ||
        q.topic.toLowerCase().includes(query)
    );
  }, [studentQueries, searchQuery]);

  const filteredFoodAlerts = useMemo(() => {
    if (!searchQuery) return foodAlerts;
    const query = searchQuery.toLowerCase();
    return foodAlerts.filter(
      (a) =>
        a.establishment_name.toLowerCase().includes(query) ||
        a.contact_person_name.toLowerCase().includes(query) ||
        a.phone.includes(query) ||
        a.city.toLowerCase().includes(query)
    );
  }, [foodAlerts, searchQuery]);

  // Pagination logic
  const currentData =
    activeTab === 'volunteers' ? filteredVolunteers :
      activeTab === 'suggestions' ? filteredSuggestions :
        activeTab === 'student-queries' ? filteredStudentQueries :
          filteredFoodAlerts;
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = currentData.slice(startIndex, endIndex);

  const handleManageImagesClick = () => {
    setShowOtpModal(true);
    setOtp('');
    setOtpError('');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '2108') {
      setShowOtpModal(false);
      router.push('/admin/images');
    } else {
      setOtpError('Invalid OTP. Please try again.');
      setOtp('');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
      });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInterestBadgeColor = (interest: string) => {
    switch (interest) {
      case 'food':
        return 'bg-pastel-yellow text-maroon';
      case 'teaching':
        return 'bg-pastel-blue text-maroon';
      case 'both':
        return 'bg-gold/20 text-maroon';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-maroon">Admin Dashboard</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Manage volunteers and suggestions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleManageImagesClick}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-maroon text-white rounded-lg hover:bg-maroon/90 transition-all font-medium shadow-sm hover:shadow-md text-sm sm:text-base"
            >
              Manage Images
            </button>
            <button
              onClick={() => router.push('/admin/resources')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-maroon border-2 border-maroon rounded-lg hover:bg-maroon hover:text-white transition-all font-medium text-sm sm:text-base"
            >
              Admin Resources
            </button>
            <button
              onClick={handleLogout}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-maroon border-2 border-maroon rounded-lg hover:bg-maroon hover:text-white transition-all font-medium text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg border border-gold/20 mb-4 sm:mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex -mb-px min-w-max">
              <button
                onClick={() => setActiveTab('volunteers')}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'volunteers'
                  ? 'border-gold text-maroon'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gold/50'
                  }`}
              >
                Volunteers ({volunteers.length})
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'suggestions'
                  ? 'border-gold text-maroon'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gold/50'
                  }`}
              >
                Suggestions ({suggestions.length})
              </button>
              <button
                onClick={() => setActiveTab('student-queries')}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'student-queries'
                  ? 'border-gold text-maroon'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gold/50'
                  }`}
              >
                Student Queries ({studentQueries.length})
              </button>
              <button
                onClick={() => setActiveTab('food-alerts')}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'food-alerts'
                  ? 'border-gold text-maroon'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gold/50'
                  }`}
              >
                Food Alerts ({foodAlerts.length})
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={
                  activeTab === 'volunteers' ? 'Search by name, email, phone, or city...' :
                    activeTab === 'suggestions' ? 'Search by name, email, or message...' :
                      activeTab === 'student-queries' ? 'Search by name, phone, city, or topic...' :
                        'Search food alerts...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all hover:border-gray-400"
              />
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600">
                Found {currentData.length} result{currentData.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 lg:p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-maroon"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchData}
                  className="mt-4 px-4 py-2 bg-maroon text-white rounded-lg hover:bg-maroon/90 focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  Retry
                </button>
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchQuery ? 'No results found' : `No ${activeTab} yet`}
              </div>
            ) : (
              <>
                {activeTab === 'volunteers' ? (
                  <VolunteersGrid
                    volunteers={paginatedData as Volunteer[]}
                    formatDate={formatDate}
                    getInterestBadgeColor={getInterestBadgeColor}
                  />
                ) : activeTab === 'suggestions' ? (
                  <SuggestionsGrid suggestions={paginatedData as Suggestion[]} formatDate={formatDate} />
                ) : activeTab === 'student-queries' ? (
                  <StudentQueriesGrid
                    queries={paginatedData as StudentQuery[]}
                    formatDate={formatDate}
                    onStatusUpdate={updateStudentQueryStatus}
                  />
                ) : (
                  <FoodAlertsGrid
                    alerts={paginatedData as FoodAlert[]}
                    formatDate={formatDate}
                    onStatusUpdate={updateFoodAlertStatus}
                  />
                )}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={currentData.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-maroon/10 rounded-full">
                  <Lock className="w-5 h-5 text-maroon" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-maroon">Enter OTP</h2>
                  <p className="text-sm text-gray-600 mt-1">Verification required</p>
                </div>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="p-2 hover:bg-red-50 rounded-full transition-all group"
                title="Close"
              >
                <X className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleOtpSubmit} className="p-6">
              <div className="mb-6">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 4-digit OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setOtp(value);
                    setOtpError('');
                  }}
                  className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-maroon outline-none transition-all"
                  placeholder="••••"
                  autoFocus
                />
                {otpError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {otpError}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 px-5 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 hover:border-gray-400 rounded-lg transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otp.length !== 4}
                  className="flex-1 px-5 py-2.5 bg-maroon text-white rounded-lg hover:bg-maroon/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function VolunteersGrid({
  volunteers,
  formatDate,
  getInterestBadgeColor,
}: {
  volunteers: Volunteer[];
  formatDate: (date: string) => string;
  getInterestBadgeColor: (interest: string) => string;
}) {
  const getInterestBadge = (interest: string) => {
    switch (interest.toLowerCase()) {
      case 'food':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-pastel-yellow text-maroon">
            Food
          </span>
        );
      case 'teaching':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-pastel-blue text-maroon">
            Teaching
          </span>
        );
      case 'both':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gold/20 text-maroon">
            Both
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            {interest}
          </span>
        );
    }
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {volunteers.map((volunteer) => (
          <div
            key={volunteer.id}
            className="bg-gradient-to-br from-white to-pastel-blue/20 border-2 border-gold/20 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:border-gold/40"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-maroon text-lg mb-2">{volunteer.name}</h3>
                {getInterestBadge(volunteer.interest)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">📞 Phone</div>
                  <a href={`tel:${volunteer.phone}`} className="text-sm text-maroon hover:text-maroon/80 font-semibold hover:underline transition-colors">
                    {volunteer.phone}
                  </a>
                </div>
                <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">📍 City</div>
                  <div className="text-sm text-gray-900 font-medium">{volunteer.city}</div>
                </div>
              </div>

              <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">✉️ Email</div>
                <a href={`mailto:${volunteer.email}`} className="text-sm text-gray-600 hover:text-maroon transition-colors break-all">
                  {volunteer.email}
                </a>
              </div>

              <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">🕐 Availability</div>
                <div className="text-sm text-gray-900 font-medium">{volunteer.availability}</div>
              </div>

              <div className="pt-3 border-t border-gold/20 flex items-center justify-between">
                <span className="text-xs text-gray-400">{formatDate(volunteer.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gold/20">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-maroon to-maroon/90">
            <tr>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Volunteer</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Contact</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">City</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Interest</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Availability</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gold/10">
            {volunteers.map((volunteer, index) => (
              <tr
                key={volunteer.id}
                className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-pastel-blue/30 hover:to-cream/50 hover:shadow-md ${index % 2 === 0 ? 'bg-white' : 'bg-cream/20'
                  }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pastel-blue to-maroon/70 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {volunteer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{volunteer.name}</div>
                      <div className="text-xs text-gray-500 font-medium">Volunteer</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <a
                      href={`tel:${volunteer.phone}`}
                      className="flex items-center gap-1.5 text-sm text-maroon hover:text-maroon/80 font-bold hover:underline transition-colors group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">📞</span>
                      {volunteer.phone}
                    </a>
                    <a
                      href={`mailto:${volunteer.email}`}
                      className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-maroon transition-colors group"
                    >
                      <span className="group-hover:scale-110 transition-transform">✉️</span>
                      <span className="truncate max-w-[180px]">{volunteer.email}</span>
                    </a>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5">
                    <span>📍</span>
                    <span className="text-sm text-gray-900 font-semibold">{volunteer.city}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {getInterestBadge(volunteer.interest)}
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-700 font-medium max-w-xs flex items-start gap-1.5">
                    <span className="text-base">🕐</span>
                    <span>{volunteer.availability}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-500 whitespace-nowrap font-medium">{formatDate(volunteer.created_at)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SuggestionsGrid({
  suggestions,
  formatDate,
}: {
  suggestions: Suggestion[];
  formatDate: (date: string) => string;
}) {
  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="bg-gradient-to-br from-white to-cream/30 border-2 border-gold/20 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:border-gold/40"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-pastel-yellow flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                {suggestion.name ? suggestion.name.charAt(0).toUpperCase() : '💡'}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-maroon text-lg mb-1">
                  {suggestion.name || 'Anonymous User'}
                </h3>
                {suggestion.email && (
                  <a href={`mailto:${suggestion.email}`} className="text-sm text-gray-600 hover:text-maroon transition-colors break-all">
                    ✉️ {suggestion.email}
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white/60 rounded-lg p-4 border border-gold/10">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">💬 Suggestion</div>
                <p className="text-sm text-gray-900 leading-relaxed">{suggestion.message}</p>
              </div>

              <div className="pt-3 border-t border-gold/20 flex items-center justify-between">
                <span className="text-xs text-gray-400">{formatDate(suggestion.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gold/20">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-maroon to-maroon/90">
            <tr>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">User</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Email</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Suggestion</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gold/10">
            {suggestions.map((suggestion, index) => (
              <tr
                key={suggestion.id}
                className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-cream/50 hover:to-pastel-yellow/20 hover:shadow-md ${index % 2 === 0 ? 'bg-white' : 'bg-cream/20'
                  }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-pastel-yellow flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {suggestion.name ? suggestion.name.charAt(0).toUpperCase() : '💡'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {suggestion.name || 'Anonymous'}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Feedback</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {suggestion.email ? (
                    <a
                      href={`mailto:${suggestion.email}`}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-maroon transition-colors group"
                    >
                      <span className="group-hover:scale-110 transition-transform">✉️</span>
                      <span className="truncate max-w-[200px]">{suggestion.email}</span>
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400 italic">No email provided</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">💬</span>
                    <p className="text-sm text-gray-700 font-medium max-w-md leading-relaxed">{suggestion.message}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-500 whitespace-nowrap font-medium">{formatDate(suggestion.created_at)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StudentQueriesGrid({
  queries,
  formatDate,
  onStatusUpdate,
}: {
  queries: StudentQuery[];
  formatDate: (date: string) => string;
  onStatusUpdate: (id: number, status: string) => void;
}) {
  const getStatusBadge = (status: string, queryId: number) => {
    return (
      <select
        value={status}
        onChange={(e) => onStatusUpdate(queryId, e.target.value)}
        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border-2 cursor-pointer transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold"
        style={{
          backgroundColor: status === 'pending' ? '#fef3c7' : status === 'in_progress' ? '#dbeafe' : '#d1fae5',
          borderColor: status === 'pending' ? '#f59e0b' : status === 'in_progress' ? '#3b82f6' : '#10b981',
          color: status === 'pending' ? '#92400e' : status === 'in_progress' ? '#1e40af' : '#065f46',
        }}
      >
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
      </select>
    );
  };

  const getStatusBadgeOld = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-sm">
            <span className="w-1.5 h-1.5 bg-yellow-900 rounded-full mr-2 animate-pulse"></span>
            Pending
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-400 to-green-500 text-green-900 shadow-sm">
            <span className="w-1.5 h-1.5 bg-green-900 rounded-full mr-2"></span>
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 shadow-sm">
            <span className="w-1.5 h-1.5 bg-gray-800 rounded-full mr-2"></span>
            {status}
          </span>
        );
    }
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {queries.map((query) => (
          <div
            key={query.id}
            className="bg-gradient-to-br from-white to-cream/30 border-2 border-gold/20 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:border-gold/40"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-maroon text-lg mb-1">{query.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2.5 py-1 bg-maroon/10 text-maroon rounded-md font-medium">
                    Class {query.student_class}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 font-medium">{query.subject}</span>
                </div>
              </div>
              <div className="ml-3">
                {getStatusBadge(query.status, query.id)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Topic</div>
                <div className="text-sm text-gray-900 font-medium">{query.topic}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</div>
                  <a href={`tel:${query.phone}`} className="text-sm text-maroon hover:text-maroon/80 font-semibold hover:underline transition-colors">
                    {query.phone}
                  </a>
                </div>
                <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Age</div>
                  <div className="text-sm text-gray-900 font-medium">{query.age ? `${query.age} years` : 'Not specified'}</div>
                </div>
              </div>

              <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</div>
                <div className="text-sm text-gray-900 font-medium">{query.locality}, {query.city}</div>
              </div>

              <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</div>
                <div className="text-sm text-gray-600 break-all">{query.email}</div>
              </div>

              <div className="pt-3 border-t border-gold/20 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  {query.attending_offline_classes === 'yes' ? '📚 Attending offline classes' : '💻 Not attending offline'}
                </span>
                <span className="text-xs text-gray-400">{formatDate(query.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gold/20">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-maroon to-maroon/90">
            <tr>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Student</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Class/Subject</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Topic</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Contact</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Location</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gold/10">
            {queries.map((query, index) => (
              <tr
                key={query.id}
                className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-cream/50 hover:to-pastel-yellow/20 hover:shadow-md ${index % 2 === 0 ? 'bg-white' : 'bg-cream/20'
                  }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maroon to-maroon/80 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {query.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{query.name}</div>
                      {query.age && <div className="text-xs text-gray-500 font-medium">{query.age} years old</div>}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center px-2.5 py-1 bg-maroon/10 text-maroon rounded-md text-sm font-bold">
                      Class {query.student_class}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{query.subject}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-900 font-medium max-w-xs line-clamp-2">{query.topic}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <a
                      href={`tel:${query.phone}`}
                      className="flex items-center gap-1.5 text-sm text-maroon hover:text-maroon/80 font-bold hover:underline transition-colors group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">📞</span>
                      {query.phone}
                    </a>
                    <a
                      href={`mailto:${query.email}`}
                      className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-maroon transition-colors group"
                    >
                      <span className="group-hover:scale-110 transition-transform">✉️</span>
                      <span className="truncate max-w-[150px]">{query.email}</span>
                    </a>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900 font-semibold">{query.locality}</div>
                    <div className="text-xs text-gray-500 font-medium">{query.city}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(query.status, query.id)}
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-500 whitespace-nowrap font-medium">{formatDate(query.created_at)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function FoodAlertsGrid({
  alerts,
  formatDate,
  onStatusUpdate,
}: {
  alerts: FoodAlert[];
  formatDate: (date: string) => string;
  onStatusUpdate: (id: number, status: string) => void;
}) {
  const getStatusBadge = (status: string, alertId: number) => {
    const getStatusColor = () => {
      switch (status) {
        case 'pending': return { bg: '#fee2e2', border: '#dc2626', text: '#991b1b' };
        case 'assigned': return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
        case 'picked_up': return { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' };
        case 'delivered': return { bg: '#d1fae5', border: '#10b981', text: '#065f46' };
        default: return { bg: '#f3f4f6', border: '#6b7280', text: '#374151' };
      }
    };

    const colors = getStatusColor();

    return (
      <select
        value={status}
        onChange={(e) => onStatusUpdate(alertId, e.target.value)}
        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border-2 cursor-pointer transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold"
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
          color: colors.text,
        }}
      >
        <option value="pending">Pending</option>
        <option value="assigned">Assigned</option>
        <option value="picked_up">Picked Up</option>
        <option value="delivered">Delivered</option>
      </select>
    );
  };

  const getStatusBadgeOld = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2 animate-pulse"></span>
            Pending
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-pastel-yellow text-maroon">
            <span className="w-1.5 h-1.5 bg-maroon rounded-full mr-2"></span>
            Assigned
          </span>
        );
      case 'picked_up':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-pastel-blue text-maroon">
            <span className="w-1.5 h-1.5 bg-maroon rounded-full mr-2"></span>
            Picked Up
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
            Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></span>
            {status}
          </span>
        );
    }
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-gradient-to-br from-white to-pastel-yellow/20 border-2 border-gold/20 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:border-gold/40"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-maroon text-lg mb-1">{alert.establishment_name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2.5 py-1 bg-pastel-yellow text-maroon rounded-md font-medium">
                    {alert.donor_type}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                {getStatusBadge(alert.status, alert.id)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Contact</div>
                  <div className="text-sm text-gray-900 font-medium">{alert.contact_person_name}</div>
                </div>
                <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</div>
                  <a href={`tel:${alert.phone}`} className="text-sm text-maroon hover:text-maroon/80 font-semibold hover:underline transition-colors">
                    {alert.phone}
                  </a>
                </div>
              </div>

              <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">📍 Location</div>
                <div className="text-sm text-gray-900 font-medium">{alert.address}</div>
                <div className="text-xs text-gray-600 mt-1">{alert.city}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">🍽️ Quantity</div>
                  <div className="text-sm text-gray-900 font-bold">{alert.quantity}</div>
                </div>
                <div className="bg-white/60 rounded-lg p-3 border border-gold/10">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">⏰ Prepared</div>
                  <div className="text-sm text-gray-900 font-medium">{alert.prepared_at}</div>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">⚠️ Expiry</div>
                <div className="text-sm text-red-700 font-bold">{alert.expiry_estimate}</div>
              </div>

              <div className="pt-3 border-t border-gold/20 flex items-center justify-between">
                <span className="text-xs text-gray-400">{formatDate(alert.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gold/20">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-maroon to-maroon/90">
            <tr>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Establishment</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Contact</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Location</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Quantity</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Prepared/Expiry</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-white uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gold/10">
            {alerts.map((alert, index) => (
              <tr
                key={alert.id}
                className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-pastel-yellow/30 hover:to-cream/50 hover:shadow-md ${index % 2 === 0 ? 'bg-white' : 'bg-cream/20'
                  }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pastel-yellow to-gold flex items-center justify-center text-maroon font-bold text-sm shadow-md">
                      {alert.establishment_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{alert.establishment_name}</div>
                      <div className="text-xs text-gray-500 font-medium">{alert.donor_type}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900 font-semibold">{alert.contact_person_name}</div>
                    <a
                      href={`tel:${alert.phone}`}
                      className="flex items-center gap-1.5 text-sm text-maroon hover:text-maroon/80 font-bold hover:underline transition-colors group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">📞</span>
                      {alert.phone}
                    </a>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900 font-medium flex items-center gap-1">
                      <span>📍</span>
                      <span className="max-w-[200px] truncate">{alert.address}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">{alert.city}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pastel-yellow/30 text-maroon rounded-md">
                    <span className="text-base">🍽️</span>
                    <span className="text-sm font-bold">{alert.quantity}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-700 font-medium flex items-center gap-1">
                      <span>⏰</span>
                      {alert.prepared_at}
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs text-red-700 font-bold bg-red-50 px-2 py-1 rounded">
                      <span>⚠️</span>
                      {alert.expiry_estimate}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(alert.status, alert.id)}
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-500 whitespace-nowrap font-medium">{formatDate(alert.created_at)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
      <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 sm:p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Show first page, last page, current page, and pages around current
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${currentPage === page
                    ? 'bg-maroon text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="px-1 sm:px-2 text-gray-400 text-xs sm:text-sm hidden sm:inline">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 sm:p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}

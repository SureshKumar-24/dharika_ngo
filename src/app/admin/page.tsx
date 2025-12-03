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

type Tab = 'volunteers' | 'suggestions';

const ITEMS_PER_PAGE = 10;

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('volunteers');
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
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
      const [volunteersRes, suggestionsRes] = await Promise.all([
        fetch('/api/admin/volunteers'),
        fetch('/api/admin/suggestions'),
      ]);

      if (!volunteersRes.ok || !suggestionsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const volunteersData = await volunteersRes.json();
      const suggestionsData = await suggestionsRes.json();

      setVolunteers(volunteersData.volunteers || []);
      setSuggestions(suggestionsData.suggestions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
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

  // Pagination logic
  const currentData = activeTab === 'volunteers' ? filteredVolunteers : filteredSuggestions;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-maroon">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage volunteers and suggestions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleManageImagesClick}
              className="px-5 py-2.5 bg-maroon text-white rounded-lg hover:bg-maroon/90 transition-all font-medium shadow-sm hover:shadow-md"
            >
              Manage Images
            </button>
            <button
              onClick={() => router.push('/admin/resources')}
              className="px-5 py-2.5 bg-white text-maroon border-2 border-maroon rounded-lg hover:bg-maroon hover:text-white transition-all font-medium"
            >
              Admin Resources
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-white text-maroon border-2 border-maroon rounded-lg hover:bg-maroon hover:text-white transition-all font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg border border-gold/20 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('volunteers')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'volunteers'
                    ? 'border-gold text-maroon'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gold/50'
                }`}
              >
                Volunteers ({volunteers.length})
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'suggestions'
                    ? 'border-gold text-maroon'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gold/50'
                }`}
              >
                Suggestions ({suggestions.length})
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all"
              />
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600">
                Found {currentData.length} result{currentData.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
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
                ) : (
                  <SuggestionsGrid suggestions={paginatedData as Suggestion[]} formatDate={formatDate} />
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
  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {volunteers.map((volunteer) => (
          <div
            key={volunteer.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">{volunteer.name}</h3>
                <span
                  className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full mt-1 ${getInterestBadgeColor(volunteer.interest)}`}
                >
                  {volunteer.interest}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500 font-medium">Phone:</span>{' '}
                <span className="text-gray-900">{volunteer.phone}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Email:</span>{' '}
                <span className="text-gray-900 break-all">{volunteer.email}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">City:</span>{' '}
                <span className="text-gray-900">{volunteer.city}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Availability:</span>{' '}
                <span className="text-gray-700">{volunteer.availability}</span>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">{formatDate(volunteer.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interest
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Availability
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {volunteers.map((volunteer) => (
              <tr key={volunteer.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">{volunteer.name}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-900">{volunteer.phone}</div>
                  <div className="text-sm text-gray-500">{volunteer.email}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-900">{volunteer.city}</div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${getInterestBadgeColor(volunteer.interest)}`}
                  >
                    {volunteer.interest}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-700 max-w-xs">{volunteer.availability}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(volunteer.created_at)}
                  </div>
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
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 text-base">
                {suggestion.name || 'Anonymous'}
              </h3>
              {suggestion.email && (
                <p className="text-sm text-gray-500 mt-1">{suggestion.email}</p>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500 font-medium">Message:</span>
                <p className="text-gray-700 mt-1">{suggestion.message}</p>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">{formatDate(suggestion.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {suggestions.map((suggestion) => (
              <tr key={suggestion.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">
                    {suggestion.name || 'Anonymous'}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-500">{suggestion.email || '-'}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-700 max-w-md">{suggestion.message}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(suggestion.created_at)}
                  </div>
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-maroon text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="px-2 text-gray-400 hidden sm:inline">
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
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

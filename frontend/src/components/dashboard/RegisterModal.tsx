import React, { useState } from 'react';
import axios from 'axios';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded?: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onMemberAdded,
}) => {
  const [formData, setFormData] = useState({
    fullNames: '',
    surname: '',
    mobileNumber: '',
    email: '',
    address: '',
    dateOfBirth: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('churchPulseToken');

      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      // Build payload matching standard C# DTO / EF Core models
      const payload = {
        fullNames: formData.fullNames.trim(),
        surname: formData.surname.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email.trim() || null,
        address: formData.address.trim() || null,
        dateOfBirth: formData.dateOfBirth,
        password: formData.password,
        // PascalCase redundancy fallback for .NET model binders
        FullNames: formData.fullNames.trim(),
        Surname: formData.surname.trim(),
        MobileNumber: formData.mobileNumber.trim(),
        Email: formData.email.trim() || null,
        Address: formData.address.trim() || null,
        DateOfBirth: formData.dateOfBirth,
        Password: formData.password,
      };

      await axios.post(
        'http://localhost:5204/api/Members/register',
        payload,
        {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        }
      );

      // Reset form state on success
      setFormData({
        fullNames: '',
        surname: '',
        mobileNumber: '',
        email: '',
        address: '',
        dateOfBirth: '',
        password: '',
      });

      // Call parent refresh callback
      if (onMemberAdded) {
        onMemberAdded();
      }

      onClose();
    } catch (err: unknown) {
      console.error('Failed to register member:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Session expired or unauthorized (401). Please log out and log back in.');
        } else if (err.response?.data) {
          setError(
            err.response.data?.message ||
              err.response.data?.title ||
              `Server returned error code ${err.response.status}`
          );
        } else {
          setError('Cannot connect to server at http://localhost:5204. Ensure dotnet run is active.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>👤</span> Register New Member
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-bold leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Full Names *
              </label>
              <input
                type="text"
                name="fullNames"
                required
                value={formData.fullNames}
                onChange={handleChange}
                placeholder="e.g. Pumla"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Surname *
              </label>
              <input
                type="text"
                name="surname"
                required
                value={formData.surname}
                onChange={handleChange}
                placeholder="e.g. Matokazi"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Mobile Number *
              </label>
              <input
                type="text"
                name="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="e.g. 0821234567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Email <span className="text-gray-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. name@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Residential Address <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="Street name, suburb, city..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              required
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
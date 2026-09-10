import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChurchEvent } from '../types/event';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventSaved: () => void;
  eventToEdit?: ChurchEvent | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onEventSaved,
  eventToEdit,
}) => {
  const [formData, setFormData] = useState<ChurchEvent>({
    title: '',
    description: '',
    eventDate: '',
    location: 'Main Church Auditorium',
    category: 'General',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        ...eventToEdit,
        eventDate: eventToEdit.eventDate
          ? new Date(eventToEdit.eventDate).toISOString().slice(0, 16)
          : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        eventDate: '',
        location: 'Main Church Auditorium',
        category: 'General',
      });
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      const payload = {
        ...formData,
        eventDate: new Date(formData.eventDate).toISOString(),
      };

      if (eventToEdit?.id) {
        await axios.put(
          `http://localhost:5204/api/Events/${eventToEdit.id}`,
          payload,
          { headers: { Authorization: authHeader } }
        );
      } else {
        await axios.post('http://localhost:5204/api/Events', payload, {
          headers: { Authorization: authHeader },
        });
      }

      onEventSaved();
      onClose();
    } catch (err: unknown) {
      console.error('Failed to save event:', err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || 'Failed to process event request.'
        );
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-4 bg-indigo-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📅</span> {eventToEdit ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-bold leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Sunday Celebration Service"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="General">General</option>
                <option value="Sunday Service">Sunday Service</option>
                <option value="Prayer Meeting">Prayer Meeting</option>
                <option value="Youth">Youth Ministry</option>
                <option value="Conference">Conference</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                name="eventDate"
                required
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Main Church Auditorium"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Description <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Provide context or instructions for attendees..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
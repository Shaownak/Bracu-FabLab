'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { bookingAPI, equipmentAPI } from '@/lib/api';
import { format } from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId?: string;
  equipmentName?: string;
}

export default function BookingModal({ isOpen, onClose, equipmentId, equipmentName }: BookingModalProps) {
  const [equipments, setEquipments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    equipment: equipmentId || '',
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    purpose: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && !equipmentId) {
      equipmentAPI.list().then(res => {
        setEquipments(res.data.results || res.data || []);
      });
    }
  }, [isOpen, equipmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await bookingAPI.create(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      const data = err.response?.data;
      if (typeof data === 'object' && data !== null) {
        setError(Object.values(data).flat().join(' ') || 'Booking failed.');
      } else {
        setError('Failed to create booking.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-[#1e293b] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-[#e2e8f0] dark:border-[#334155]"
        >
          <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0] dark:border-[#334155]">
            <h2 className="text-xl font-bold text-[#0f172a] dark:text-white">Book Equipment</h2>
            <button onClick={onClose} className="text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mb-2">Booking Requested!</h3>
                <p className="text-[#475569] dark:text-[#94a3b8]">Your request has been submitted for admin approval.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-3">
                    <AlertCircle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={18} />
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#475569] dark:text-[#94a3b8] mb-1.5">Equipment</label>
                  {equipmentId ? (
                    <input type="text" disabled value={equipmentName} className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] dark:border-[#334155] bg-gray-100 dark:bg-[#0a0f1e]/50 text-[#0f172a] dark:text-white" />
                  ) : (
                    <select 
                      required 
                      value={formData.equipment} 
                      onChange={(e) => setFormData({...formData, equipment: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] dark:border-[#334155] bg-[#f8fafc] dark:bg-[#0a0f1e] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#003DA5] outline-none transition-all"
                    >
                      <option value="" disabled>Select equipment</option>
                      {equipments.map(eq => (
                        <option key={eq.id} value={eq.id}>{eq.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] dark:text-[#94a3b8] mb-1.5">Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                    <input 
                      type="date" 
                      required
                      min={format(new Date(), 'yyyy-MM-dd')}
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e2e8f0] dark:border-[#334155] bg-[#f8fafc] dark:bg-[#0a0f1e] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#003DA5] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#475569] dark:text-[#94a3b8] mb-1.5">Start Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                      <input 
                        type="time" 
                        required
                        value={formData.start_time}
                        onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e2e8f0] dark:border-[#334155] bg-[#f8fafc] dark:bg-[#0a0f1e] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#003DA5] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#475569] dark:text-[#94a3b8] mb-1.5">End Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                      <input 
                        type="time" 
                        required
                        value={formData.end_time}
                        onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e2e8f0] dark:border-[#334155] bg-[#f8fafc] dark:bg-[#0a0f1e] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#003DA5] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] dark:text-[#94a3b8] mb-1.5">Purpose / Project</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.purpose}
                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                    placeholder="Briefly describe what you will be working on"
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] dark:border-[#334155] bg-[#f8fafc] dark:bg-[#0a0f1e] text-[#0f172a] dark:text-white focus:ring-2 focus:ring-[#003DA5] outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#e2e8f0] dark:border-[#334155]">
                  <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-medium text-[#475569] dark:text-[#94a3b8] bg-[#f1f5f9] dark:bg-[#334155] hover:bg-[#e2e8f0] dark:hover:bg-[#475569] transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-1 py-3 rounded-xl font-semibold text-white gradient-brac hover:shadow-lg disabled:opacity-70 transition-all">
                    {isLoading ? 'Submitting...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

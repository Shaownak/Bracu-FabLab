'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Briefcase, GraduationCap, Building2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student', // student | faculty | visitor
    student_id: '',
    department: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authAPI.register(formData);
      router.push('/login?registered=true');
    } catch (err: any) {
      const data = err.response?.data;
      if (typeof data === 'object' && data !== null) {
        const errors = Object.values(data).flat().join(' ');
        setError(errors || 'Registration failed. Please check your inputs.');
      } else {
        setError('Registration failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12 relative overflow-hidden selection:bg-primary/20">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background/50 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-space font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
        </motion.div>

        <motion.div 
          className="bg-card border border-border overflow-hidden relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

          {/* Header */}
          <div className="p-8 text-center border-b border-border bg-muted/30">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
              className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto mb-6"
            >
              <span className="font-space font-bold text-xl">F</span>
            </motion.div>
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl font-space font-bold text-foreground"
            >
              Create an Account
            </motion.h1>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-sm text-muted-foreground mt-2 font-light"
            >
              Join BRACU FabLab to book equipment and access resources.
            </motion.p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-space font-bold text-red-500">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
                <label className="block text-xs font-space font-bold tracking-widest text-muted-foreground uppercase mb-3">I am a...</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'student', label: 'Student', icon: GraduationCap },
                    { id: 'faculty', label: 'Faculty', icon: Briefcase },
                    { id: 'visitor', label: 'Visitor', icon: User },
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.id })}
                      className={`flex flex-col items-center gap-2 p-4 border transition-all duration-300 ${
                        formData.role === role.id 
                          ? 'border-primary bg-primary/5 text-primary scale-105 shadow-lg shadow-primary/10' 
                          : 'border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                      }`}
                    >
                      <role.icon size={24} />
                      <span className="text-sm font-space font-bold tracking-wide">{role.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-space font-bold tracking-widest text-muted-foreground uppercase mb-2">First Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
                    <input type="text" required value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors" placeholder="John" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-space font-bold tracking-widest text-muted-foreground uppercase mb-2">Last Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
                    <input type="text" required value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors" placeholder="Doe" />
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-space font-bold tracking-widest text-muted-foreground uppercase mb-2">Username</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
                    <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors" placeholder="johndoe123" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-space font-bold tracking-widest text-muted-foreground uppercase mb-2">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors" placeholder="user@bracu.ac.bd" />
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.9 }}>
                <label className="block text-xs font-space font-bold tracking-widest text-muted-foreground uppercase mb-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
                  <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors" placeholder="Min. 8 characters" minLength={8} />
                </div>
              </motion.div>

              {(formData.role === 'student' || formData.role === 'faculty') && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden">
                  {formData.role === 'student' && (
                    <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                      <label className="block text-xs font-space font-bold tracking-widest text-muted-foreground uppercase mb-2">Student ID</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
                        <input type="text" required value={formData.student_id} onChange={(e) => setFormData({...formData, student_id: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors" placeholder="20101001" />
                      </div>
                    </motion.div>
                  )}
                  <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={formData.role === 'faculty' ? 'col-span-2' : ''}>
                    <label className="block text-xs font-space font-bold tracking-widest text-muted-foreground uppercase mb-2">Department</label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
                      <input type="text" required value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors" placeholder="CSE, EEE, MNS, etc." />
                    </div>
                  </motion.div>
                </motion.div>
              )}

              <motion.button 
                type="submit" 
                disabled={isLoading}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-center w-full px-6 py-4 bg-primary text-primary-foreground font-space font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8 relative overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-white/20 group-hover:animate-shimmer" />
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="mt-8 text-center text-sm text-muted-foreground"
            >
              Already have an account?{' '}
              <Link href="/login" className="font-space font-bold text-primary hover:underline uppercase tracking-wider text-xs ml-1 transition-colors hover:text-foreground">
                Sign in
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

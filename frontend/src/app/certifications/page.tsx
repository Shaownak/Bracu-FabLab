'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Download, CheckCircle2, ShieldCheck, Search, AlertCircle, ArrowRight } from 'lucide-react';

const certificates = [
  { id: 'CERT-2026-001', course: '3D Printing Fundamentals', date: '2026-03-15', instructor: 'Nusrat Jahan', validity: 'Lifetime' },
  { id: 'CERT-2026-042', course: 'Basic Electronics & Soldering', date: '2026-04-22', instructor: 'Tanvir Hasan', validity: 'Lifetime' },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

export default function CertificationsPage() {
  const [verifyId, setVerifyId] = useState('');
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyId) return;
    
    setIsVerifying(true);
    setVerifyStatus('idle');

    // Simulate verification delay
    setTimeout(() => {
      if (verifyId.includes('CERT-2026')) {
        setVerifyStatus('success');
      } else {
        setVerifyStatus('error');
      }
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background selection:bg-primary/20">
      {/* Verify Banner */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 py-16 border border-border bg-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background/50 z-0 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="max-w-xl"
          >
            <h2 className="text-3xl font-space font-bold text-foreground flex items-center gap-3 mb-4">
              <ShieldCheck className="text-primary" size={32} /> 
              Certificate Verification
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed font-light">
              Employers and faculty can verify the authenticity of a BRACU FabLab certificate by entering the unique Certificate ID below.
            </p>
          </motion.div>
          
          <motion.form 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            onSubmit={handleVerify} 
            className="w-full md:w-auto flex-1 max-w-md relative"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
                <input 
                  type="text" 
                  value={verifyId}
                  onChange={(e) => setVerifyId(e.target.value)}
                  placeholder="e.g. CERT-2026-001" 
                  className="w-full pl-11 pr-4 py-4 bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors font-space tracking-wide uppercase"
                />
              </div>
              <button 
                type="submit" 
                disabled={isVerifying || !verifyId}
                className="group relative overflow-hidden px-8 py-4 bg-primary text-primary-foreground font-space font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center"
              >
                <div className="absolute inset-0 -translate-x-full bg-white/20 group-hover:animate-shimmer" />
                {isVerifying ? (
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
                ) : (
                  'Verify'
                )}
              </button>
            </div>
            
            {verifyStatus === 'success' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 right-0 mt-4 p-4 bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-sm font-space font-bold text-green-500">Valid Certificate Found</h4>
                  <p className="text-xs text-green-500/80 mt-1">This certificate ID corresponds to an official BRACU FabLab training.</p>
                </div>
              </motion.div>
            )}
            {verifyStatus === 'error' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 right-0 mt-4 p-4 bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-sm font-space font-bold text-red-500">Invalid Certificate ID</h4>
                  <p className="text-xs text-red-500/80 mt-1">We could not find a certificate matching this ID.</p>
                </div>
              </motion.div>
            )}
          </motion.form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-space font-bold text-foreground mb-4 tracking-tight">My Certifications.</h1>
          <p className="text-lg text-muted-foreground font-light max-w-2xl">View and download your earned equipment certifications.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {certificates.map((cert, i) => (
            <motion.div 
              key={cert.id}
              variants={fadeUp}
              className="bg-card border border-border p-8 hover:border-foreground/30 transition-colors group relative overflow-hidden flex flex-col h-full"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <div className="absolute -right-6 -top-6 text-muted-foreground/5 opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <Award size={140} strokeWidth={1} />
              </div>

              <div className="relative z-10 flex flex-col flex-1">
                <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-6">
                  <Award size={24} />
                </div>
                
                <h3 className="text-xl font-space font-bold text-foreground mb-2 leading-tight">{cert.course}</h3>
                <p className="text-xs font-space font-bold text-primary uppercase tracking-widest mb-8">ID: {cert.id}</p>
                
                <div className="space-y-3 text-sm text-muted-foreground mb-10 flex-1">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-light">Issued:</span>
                    <span className="font-medium text-foreground">{cert.date}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-light">Instructor:</span>
                    <span className="font-medium text-foreground">{cert.instructor}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="font-light">Validity:</span>
                    <span className="font-medium text-foreground">{cert.validity}</span>
                  </div>
                </div>

                <button className="group/btn relative overflow-hidden w-full flex items-center justify-center px-6 py-4 border border-border bg-transparent text-foreground font-space font-bold uppercase tracking-widest hover:border-foreground transition-colors mt-auto">
                  <div className="absolute inset-0 -translate-x-full bg-foreground/5 group-hover/btn:translate-x-0 transition-transform duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    <Download size={16} /> Download PDF
                  </span>
                </button>
              </div>
            </motion.div>
          ))}

          {/* Empty State / Add New */}
          <motion.div variants={fadeUp}>
            <Link href="/trainings" className="bg-transparent border border-dashed border-border p-8 flex flex-col items-center justify-center text-center h-full min-h-[350px] group hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 bg-muted border border-border flex items-center justify-center text-muted-foreground mb-6 group-hover:text-primary transition-colors">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-space font-bold text-foreground mb-3">Unlock More</h3>
              <p className="text-sm text-muted-foreground font-light mb-8 max-w-[200px] leading-relaxed">Complete training courses to earn certifications and access advanced machinery.</p>
              <span className="inline-flex items-center gap-2 text-xs font-space font-bold uppercase tracking-widest text-primary group-hover:text-foreground transition-colors">
                Browse Courses <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}



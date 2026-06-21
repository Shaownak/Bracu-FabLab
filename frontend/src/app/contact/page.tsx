'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, MessageSquare, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { analyticsAPI } from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      await analyticsAPI.submitContact(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 py-20 border border-border bg-card overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background/50 z-0" />
        <div className="relative z-10 max-w-2xl">
          <span className="text-sm font-space font-medium text-primary tracking-widest uppercase mb-4 block">Get in Touch</span>
          <h1 className="text-5xl md:text-7xl font-space font-bold tracking-tighter text-foreground mb-6">
            Contact <br />
            <span className="text-primary">Us.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            Have a question about our equipment, looking to collaborate on a project, or need support? We're here to help.
          </p>
        </div>
      </section>

      {/* Main Content Split Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
          
          {/* Left: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-card border border-border p-8 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-space font-bold text-foreground mb-8">Contact Information</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted text-foreground border border-border">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-space font-bold text-foreground">Location</h3>
                      <p className="text-muted-foreground mt-2 leading-relaxed text-sm">
                        Kha 224 Pragati Sarani, Merul Badda<br />
                        Dhaka 1212<br />
                        Bangladesh
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted text-foreground border border-border">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-space font-bold text-foreground">Email</h3>
                      <p className="text-muted-foreground mt-2 text-sm">fablab@bracu.ac.bd</p>
                      <p className="text-muted-foreground text-sm">support.fablab@bracu.ac.bd</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted text-foreground border border-border">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-space font-bold text-foreground">Phone</h3>
                      <p className="text-muted-foreground mt-2 text-sm">+880 2-222264051-4 (Ext. 4050)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted text-foreground border border-border">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-space font-bold text-foreground">Opening Hours</h3>
                      <p className="text-muted-foreground mt-2 text-sm">Sunday - Thursday: 9:00 AM - 5:00 PM</p>
                      <p className="text-muted-foreground text-sm">Friday - Saturday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="w-full h-64 border border-border mt-12 overflow-hidden relative bg-muted">
                <iframe
                  title="FabLab Location Map"
                  src="https://www.google.com/maps?q=Kha+224+Pragati+Sarani,+Merul+Badda,+Dhaka+1212,+Bangladesh&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 filter grayscale contrast-125 opacity-90 dark:invert dark:opacity-80 transition-all duration-500 hover:filter-none hover:opacity-100 dark:hover:invert-0"
                ></iframe>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.3 }
              }
            }}
          >
            <div className="bg-card p-8 border border-border h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex items-center gap-3 mb-8 relative">
                <div className="p-2 bg-primary/10 text-primary border border-primary/20">
                  <MessageSquare size={20} />
                </div>
                <h2 className="text-2xl font-space font-bold text-foreground">Send a Message</h2>
              </motion.div>

              {submitStatus === 'success' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-green-500/10 border border-green-500/20 flex items-start gap-3 relative">
                  <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-sm font-space font-bold text-green-500">Message Sent Successfully!</h4>
                    <p className="text-sm text-green-500/80 mt-1">Thank you for reaching out. We will get back to you within 1-2 business days.</p>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-500/10 border border-red-500/20 flex items-start gap-3 relative">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-sm font-space font-bold text-red-500">Something went wrong</h4>
                    <p className="text-sm text-red-500/80 mt-1">Failed to send message. Please try again or email us directly.</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
                  <label htmlFor="name" className="block text-xs font-space font-bold tracking-widest text-muted-foreground uppercase mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors"
                    placeholder="John Doe"
                  />
                </motion.div>
                
                <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
                  <label htmlFor="email" className="block text-xs font-space font-bold tracking-widest text-muted-foreground uppercase mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors"
                    placeholder="john@example.com"
                  />
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
                  <label htmlFor="subject" className="block text-xs font-space font-bold tracking-widest text-muted-foreground uppercase mb-2">Subject</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none"
                  >
                    <option value="" disabled>Select a topic</option>
                    <option value="equipment">Equipment Inquiry</option>
                    <option value="training">Training/Certification</option>
                    <option value="collaboration">Project Collaboration</option>
                    <option value="support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
                  <label htmlFor="message" className="block text-xs font-space font-bold tracking-widest text-muted-foreground uppercase mb-2">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </motion.div>

                <motion.button 
                  type="submit" 
                  disabled={isSubmitting}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center justify-center w-full px-8 py-4 bg-primary text-primary-foreground font-space font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full bg-white/20 group-hover:animate-shimmer" />
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}

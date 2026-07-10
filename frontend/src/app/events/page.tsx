'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ArrowRight, Loader2, X, Info, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { eventAPI } from '@/lib/api';

interface EventData {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  type?: string;
  date: string;
  time?: string;
  venue?: string;
  location?: string;
  spots: number;
  registered: number;
  status: 'upcoming' | 'completed';
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};

export default function EventsPage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detailEvent, setDetailEvent] = useState<any | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventAPI.list();
        const data = response.data?.results || response.data;
        if (Array.isArray(data)) {
          setEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (event: any) => {
    try {
      await eventAPI.register(event.id || event.slug);
      alert(`Successfully registered for ${event.title}!`);
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Registration failed or you are already registered.');
    }
  };

  const filtered = events.filter((e) => tab === 'upcoming' ? e.status === 'upcoming' : e.status === 'completed');

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 selection:bg-primary/20">
      
      {/* HEADER SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 py-20 border border-border bg-card overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <Image src="/images/project_drone.png" alt="Events" fill className="object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
        </motion.div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-5xl md:text-7xl font-space font-bold tracking-tighter text-foreground mb-6"
          >
            Workshops & <br />
            <span className="text-primary">Events.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-lg md:text-xl text-muted-foreground font-light"
          >
            Join practical workshops led by BRACU FabLab engineering staff and visiting industry experts.
          </motion.p>
        </div>
      </section>

      {/* FILTER TABS */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
      >
        <div className="flex border-b border-border">
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-8 py-4 text-sm font-medium capitalize transition-colors border-b-2 -mb-[1px] ${
                tab === t
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'past' ? 'Past Events' : 'Upcoming Events'}
            </button>
          ))}
        </div>
      </motion.section>

      {/* EVENTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 border border-dashed border-border mt-6">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-space font-semibold text-foreground mb-2">Loading Events</h3>
            <p className="text-muted-foreground">Connecting to the FabLab database...</p>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filtered.map((event, i) => (
            <motion.div
              key={event.id}
              variants={fadeUp}
              onClick={() => setDetailEvent(event)}
              className="group flex flex-col md:flex-row bg-card border border-border hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              {/* Date Box */}
              <div className="flex flex-row md:flex-col items-center justify-center p-6 md:w-40 border-b md:border-b-0 md:border-r border-border bg-muted/30">
                <div className="text-4xl md:text-5xl font-space font-bold text-foreground">
                  {event.date.split('-')[2] || '15'}
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1">
                  {new Date(event.date).toLocaleString('default', { month: 'short' })}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                      {event.type || 'WORKSHOP'}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {event.spots - event.registered} SPOTS LEFT
                    </span>
                  </div>

                  <h3 className="text-2xl font-space font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-xs font-mono text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-primary" />
                      <span>{event.time || '10:00 AM - 01:00 PM'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-primary" />
                      <span>{event.location || event.venue || 'BRACU FabLab Engineering Wing'}</span>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-primary flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Info size={12} /> Click to view full agenda & workshop speakers
                  </div>
                </div>

                {event.status === 'upcoming' && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegister(event);
                      }}
                      className="w-full px-6 py-3.5 text-xs font-space font-bold tracking-widest uppercase bg-foreground text-background hover:bg-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Register Now</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-60 grayscale pointer-events-none">
            {[1, 2].map((i) => (
              <div key={`dummy-${i}`} className="bg-card border border-border p-8 flex flex-col md:flex-row">
                <div className="p-6 md:w-40 border-b md:border-b-0 md:border-r border-border bg-muted/30 flex items-center justify-center font-space font-bold text-4xl">15</div>
                <div className="p-8 flex-1">
                  <span className="text-xs font-mono text-primary">WORKSHOP</span>
                  <h3 className="text-2xl font-space font-bold mt-2 mb-4">Sample Event Title {i}</h3>
                  <button className="w-full py-3 bg-muted text-muted-foreground text-xs font-mono">Register Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Event Details Modal */}
      {detailEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-card border border-border shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="relative bg-muted/40 p-8 border-b border-border flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 text-xs font-mono uppercase tracking-widest bg-primary/10 text-primary border border-primary/30">
                    {detailEvent.type || 'Workshop & Training'}
                  </span>
                  <span className="px-3 py-1 text-xs font-mono border border-border bg-background">
                    {detailEvent.spots - detailEvent.registered} Spots Available
                  </span>
                </div>
                <h2 className="text-3xl font-space font-bold text-foreground">{detailEvent.title}</h2>
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mt-4">
                  <span className="flex items-center gap-2"><Calendar size={16} className="text-primary" /> {detailEvent.date}</span>
                  <span className="flex items-center gap-2"><Clock size={16} className="text-primary" /> {detailEvent.time || '10:00 AM - 01:00 PM'}</span>
                  <span className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> {detailEvent.location || detailEvent.venue || 'BRACU FabLab Engineering Wing'}</span>
                </div>
              </div>

              <button
                onClick={() => setDetailEvent(null)}
                className="p-2.5 bg-background hover:bg-muted text-foreground border border-border shadow-sm transition-colors"
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-2">Workshop Overview</h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {detailEvent.description || 'Hands-on technical workshop organized by BRAC University FabLab.'}
                </p>
              </div>

              {/* Agenda & Highlights */}
              <div className="border-t border-border pt-6">
                <h4 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-4 flex items-center gap-2">
                  <Sparkles size={16} /> Key Workshop Highlights & Prerequisites
                </h4>
                <ul className="space-y-2.5 text-sm text-foreground">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Open to all BRACU students and faculty members with valid university IDs.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Practical hands-on training with physical fabrication equipment.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Certificate of participation awarded upon completion.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-muted/30 border-t border-border flex items-center justify-end gap-3">
              <button
                onClick={() => setDetailEvent(null)}
                className="px-6 py-3 text-sm font-space font-medium border border-border hover:bg-muted transition-colors text-foreground"
              >
                Close
              </button>
              {detailEvent.status === 'upcoming' && (
                <button
                  onClick={() => {
                    handleRegister(detailEvent);
                    setDetailEvent(null);
                  }}
                  className="px-8 py-3 text-sm font-space font-bold tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Register Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

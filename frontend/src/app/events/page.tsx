'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { eventAPI } from '@/lib/api';

interface EventData {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  venue: string;
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
            Join our masterclasses, hackathons, and guest lectures to enhance your fabrication and engineering skills.
          </motion.p>
        </div>
      </section>

      {/* FILTER TABS */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
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
              className="group flex flex-col md:flex-row bg-card border border-border hover:border-foreground/30 transition-colors"
            >
              {/* Date Box */}
              <div className="flex flex-row md:flex-col items-center justify-center p-6 md:w-40 border-b md:border-b-0 md:border-r border-border bg-muted/30">
                <div className="text-4xl md:text-5xl font-space font-bold text-foreground">
                  {new Date(event.date).getDate()}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>

              {/* Content Box */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <span className="px-3 py-1 text-xs font-medium border border-border bg-muted text-foreground">
                      {event.type}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-space font-bold text-foreground mb-6 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-foreground" /> {event.time}
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-foreground" /> {event.venue}
                    </div>
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-foreground" /> {event.registered}/{event.spots} spots filled
                    </div>
                  </div>
                </div>

                {event.status === 'upcoming' && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <button
                      disabled={event.registered >= event.spots}
                      className={`relative overflow-hidden group/btn flex items-center justify-between w-full px-6 py-4 text-sm font-space font-bold tracking-widest uppercase transition-all ${
                        event.registered >= event.spots
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {event.registered < event.spots && <div className="absolute inset-0 -translate-x-full bg-white/20 group-hover/btn:animate-shimmer pointer-events-none" />}
                      <span>
                        {event.registered >= event.spots ? 'Event Full' : 'Register Now'}
                      </span>
                      {event.registered < event.spots && <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          </motion.div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-60 grayscale pointer-events-none mt-6 relative">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-background/90 backdrop-blur-sm border border-border px-8 py-6 flex flex-col items-center">
                <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-xl font-space font-semibold text-foreground">No Events Found</h3>
                <p className="text-sm text-muted-foreground mt-1">Showing placeholders</p>
              </div>
            </div>
            {[1, 2].map((i) => (
              <div
                key={`dummy-${i}`}
                className="group flex flex-col md:flex-row bg-card border border-border"
              >
                {/* Date Box */}
                <div className="flex flex-row md:flex-col items-center justify-center p-6 md:w-40 border-b md:border-b-0 md:border-r border-border bg-muted/30">
                  <div className="text-4xl md:text-5xl font-space font-bold text-muted-foreground">
                    2{i}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">
                    Aug 2026
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mb-4">
                      <span className="px-3 py-1 text-xs font-medium border border-border bg-muted text-muted-foreground">
                        Workshop
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-space font-bold text-muted-foreground mb-6">
                      Sample Event Title {i}
                    </h3>
                    
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <Clock size={16} /> 10:00 AM
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin size={16} /> FabLab Main Area
                      </div>
                      <div className="flex items-center gap-3">
                        <Users size={16} /> 0/20 spots filled
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <button className="w-full px-6 py-4 text-sm font-space font-bold tracking-widest uppercase bg-muted text-muted-foreground">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, Award, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { trainingAPI } from '@/lib/api';

interface CourseData {
  id: string;
  title: string;
  level: string;
  duration: string;
  modules: number;
  enrolled: boolean;
  progress: number;
  certified: boolean;
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function TrainingsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await trainingAPI.listCourses();
        const data = response.data?.results || response.data;
        if (Array.isArray(data)) {
          setCourses(data);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    if (activeTab === 'enrolled') return course.enrolled;
    if (activeTab === 'certified') return course.certified;
    return true;
  });

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
          <Image src="/images/electronics.png" alt="Trainings" fill className="object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
        </motion.div>
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-space font-bold tracking-tighter text-foreground mb-6"
          >
            Training & <br />
            <span className="text-primary">Certification.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-muted-foreground font-light"
          >
            Complete mandatory safety and operation courses to unlock equipment booking access and master new fabrication skills.
          </motion.p>
        </div>
      </section>

      {/* FILTER TABS */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
      >
        <div className="flex border-b border-border">
          {(['all', 'enrolled', 'certified']).map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-sm font-medium capitalize transition-colors border-b-2 -mb-[1px] ${
                activeTab === tab 
                  ? 'border-foreground text-foreground' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab} Courses
            </button>
          ))}
        </div>
      </motion.section>

      {/* COURSES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 border border-dashed border-border mt-6">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-space font-semibold text-foreground mb-2">Loading Courses</h3>
            <p className="text-muted-foreground">Connecting to the FabLab database...</p>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, i) => (
            <motion.div 
              key={course.id} 
              variants={fadeUp}
              className="group bg-card border border-border hover:border-foreground/30 transition-colors flex flex-col justify-between min-h-[350px] p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col h-full">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-muted text-foreground">
                      <PlayCircle size={24} />
                    </div>
                    {course.certified && (
                      <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                        <CheckCircle2 size={12} /> Certified
                      </span>
                    )}
                    {!course.certified && (
                      <span className="px-3 py-1 text-xs font-medium border border-border bg-muted text-foreground uppercase tracking-wider">
                        {course.level}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-space font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1.5"><Clock size={16} /> {course.duration}</span>
                    <span className="flex items-center gap-1.5"><PlayCircle size={16} /> {course.modules} Modules</span>
                  </div>
                </div>
                
                <div className="mt-auto">
                  {course.enrolled ? (
                    <div className="pt-6 border-t border-border">
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Course Progress</span>
                        <span className="font-space font-bold text-foreground">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-muted h-1 mb-6 relative overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 bg-foreground"
                        />
                      </div>
                      <button className="relative overflow-hidden group/btn flex items-center justify-between w-full px-6 py-4 text-sm font-space font-bold tracking-widest uppercase transition-all bg-foreground text-background hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98]">
                        <div className="absolute inset-0 -translate-x-full bg-background/20 group-hover/btn:animate-shimmer pointer-events-none" />
                        <span>{course.progress === 100 ? 'Review Course' : 'Continue Course'}</span>
                        <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  ) : (
                    <div className="pt-6 border-t border-border">
                      <button className="relative overflow-hidden group/btn flex items-center justify-center w-full px-6 py-4 text-sm font-space font-bold tracking-widest uppercase transition-all border border-border text-foreground hover:border-foreground">
                        <div className="absolute inset-0 -translate-x-full bg-foreground/5 group-hover/btn:translate-x-0 transition-transform duration-300 pointer-events-none" />
                        <span className="relative z-10">Enroll Now</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          </motion.div>
        )}

        {!isLoading && filteredCourses.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 grayscale pointer-events-none mt-6 relative">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-background/90 backdrop-blur-sm border border-border px-8 py-6 flex flex-col items-center">
                <PlayCircle className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-xl font-space font-semibold text-foreground">No Courses Found</h3>
                <p className="text-sm text-muted-foreground mt-1">Showing placeholders</p>
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div 
                key={`dummy-${i}`} 
                className="group bg-card border border-border hover:border-foreground/30 transition-colors flex flex-col justify-between min-h-[350px] p-8 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col h-full">
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-muted text-foreground">
                        <PlayCircle size={24} />
                      </div>
                      <span className="px-3 py-1 text-xs font-medium border border-border bg-muted text-muted-foreground uppercase tracking-wider">
                        Beginner
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-space font-bold text-muted-foreground mb-4 group-hover:text-primary transition-colors">
                      Sample Course Title {i}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-1.5"><Clock size={16} /> 2 Hours</span>
                      <span className="flex items-center gap-1.5"><PlayCircle size={16} /> 4 Modules</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="pt-6 border-t border-border">
                      <button className="relative overflow-hidden group/btn flex items-center justify-center w-full px-6 py-4 text-sm font-space font-bold tracking-widest uppercase transition-all border border-border text-muted-foreground">
                        <span className="relative z-10">Enroll Now</span>
                      </button>
                    </div>
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

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Crosshair, Layers, Maximize, Zap, Calendar, BookOpen, FileText } from 'lucide-react';
import { analyticsAPI } from '@/lib/api';

export default function Home() {
  const [stats, setStats] = useState({
    machines: '24',
    projects: '1.2k',
    staff: '15',
    incidents: '0'
  });

  useEffect(() => {
    analyticsAPI.publicStats().then(res => {
      if (res.data) {
        setStats({
          machines: res.data.machines?.toString() || '24',
          projects: res.data.projects?.toString() || '1.2k',
          staff: res.data.staff?.toString() || '15',
          incidents: res.data.incidents?.toString() || '0'
        });
      }
    }).catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[80vh] flex items-center">
        {/* VIDEO BACKGROUND */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/hero2.mp4" type="video/mp4" />
        </video>

        {/* BLACK FILTER */}
        <div className="absolute inset-0 bg-black/70 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-4xl"
          >
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-space font-bold tracking-tighter leading-[1.1] text-white mb-6">
              Transform <br className="hidden md:block" />
              Ideas Into <span className="text-white/70">Reality.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-2xl text-white/80 font-light max-w-2xl mb-10 leading-relaxed">
              BRAC University&apos;s digital fabrication laboratory. Empowering researchers and students with industrial-grade 3D printing, CNC machining, and robotics.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/facilities"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-medium text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 -translate-x-full bg-black/10 group-hover:animate-shimmer" />
                Book Equipment
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white text-white font-medium text-sm transition-colors hover:bg-white/10"
              >
                Explore Projects
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* BENTO GRID SECTION */}
      <section className="py-24 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-1 lg:gap-1 bg-border/20 p-1"
          >

            {/* Bento Item 1 */}
            <motion.div variants={fadeUp} className="lg:col-span-8 bg-foreground p-10 md:p-16 flex flex-col justify-between min-h-[400px]">
              <div>
                <Layers className="text-primary mb-6" size={32} />
                <h2 className="text-3xl md:text-5xl font-space font-bold tracking-tight mb-4">Precision 3D Printing</h2>
                <p className="text-muted-foreground text-lg max-w-md">
                  Access industrial FDM and SLA printers capable of micrometre precision. Perfect for complex mechanical parts and rapid prototyping.
                </p>
              </div>
              <Link href="/facilities" className="group inline-flex items-center gap-2 text-sm font-medium mt-12 hover:text-primary transition-colors w-fit">
                View Printers <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Bento Item 2 */}
            <motion.div variants={fadeUp} className="lg:col-span-4 bg-muted relative overflow-hidden min-h-[400px] group">
              <Image
                src="/images/printer.png"
                alt="3D Printer Nozzle"
                fill
                className="object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700 group-hover:scale-105"
              />
            </motion.div>

            {/* Bento Item 3 */}
            <motion.div variants={fadeUp} className="lg:col-span-4 bg-muted relative overflow-hidden min-h-[400px] group">
              <Image
                src="/images/cnc.png"
                alt="CNC Milling"
                fill
                className="object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700 group-hover:scale-105"
              />
            </motion.div>

            {/* Bento Item 4 */}
            <motion.div variants={fadeUp} className="lg:col-span-8 bg-foreground p-10 md:p-16 flex flex-col justify-between min-h-[400px]">
              <div>
                <Crosshair className="text-primary mb-6" size={32} />
                <h2 className="text-3xl md:text-5xl font-space font-bold tracking-tight mb-4">Advanced CNC Machining</h2>
                <p className="text-muted-foreground text-lg max-w-md">
                  Mill aluminum, wood, and acrylic with our 5-axis routers. Transform raw materials into finished products.
                </p>
              </div>
              <Link href="/facilities" className="group inline-flex items-center gap-2 text-sm font-medium mt-12 hover:text-primary transition-colors w-fit">
                View CNC Machines <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Bento Item 5 */}
            <motion.div variants={fadeUp} className="lg:col-span-8 bg-foreground p-10 md:p-16 flex flex-col justify-between min-h-[400px]">
              <div>
                <Zap className="text-primary mb-6" size={32} />
                <h2 className="text-3xl md:text-5xl font-space font-bold tracking-tight mb-4">Electronics & Prototyping</h2>
                <p className="text-muted-foreground text-lg max-w-md">
                  Fully equipped workstations with oscilloscopes, soldering irons, and a vast inventory of microcontrollers and sensors.
                </p>
              </div>
              <Link href="/facilities" className="group inline-flex items-center gap-2 text-sm font-medium mt-12 hover:text-primary transition-colors w-fit">
                Explore Equipment <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Bento Item 6 */}
            <motion.div variants={fadeUp} className="lg:col-span-4 bg-muted relative overflow-hidden min-h-[400px] group">
              <Image
                src="/images/electronics.png"
                alt="Electronics Lab Workspace"
                fill
                className="object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700 group-hover:scale-105"
              />
            </motion.div>

            {/* Bento Item 7 */}
            <motion.div variants={fadeUp} className="lg:col-span-4 bg-muted relative overflow-hidden min-h-[400px] group">
              <Image
                src="/images/laser.png"
                alt="Laser Cutter"
                fill
                className="object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700 group-hover:scale-105"
              />
            </motion.div>

            {/* Bento Item 8 */}
            <motion.div variants={fadeUp} className="lg:col-span-8 bg-foreground p-10 md:p-16 flex flex-col justify-between min-h-[400px]">
              <div>
                <Maximize className="text-primary mb-6" size={32} />
                <h2 className="text-3xl md:text-5xl font-space font-bold tracking-tight mb-4">Industrial Laser Cutting</h2>
                <p className="text-muted-foreground text-lg max-w-md">
                  Rapidly cut and engrave wood, acrylic, leather, and more with our high-power CO2 laser cutters.
                </p>
              </div>
              <Link href="/facilities" className="group inline-flex items-center gap-2 text-sm font-medium mt-12 hover:text-primary transition-colors w-fit">
                View Laser Cutters <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* OPPORTUNITIES SECTION */}
      <section className="py-32 bg-card border-t border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-space font-bold tracking-tight mb-4">Learn & Grow.</h2>
            <p className="text-xl text-muted-foreground font-light max-w-2xl">
              Expand your skillset through our curated workshops, comprehensive training programs, and extensive library of resources.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeUp}>
              <Link href="/events" className="group p-8 border border-border bg-background hover:border-primary transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full">
                <div className="w-14 h-14 bg-muted text-foreground flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                  <Calendar size={24} />
                </div>
                <h3 className="text-2xl font-space font-bold text-foreground mb-4">Events & Workshops</h3>
                <p className="text-muted-foreground mb-8 flex-1">
                  Join our masterclasses, hackathons, and guest lectures to enhance your fabrication and engineering skills.
                </p>
                <div className="flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                  View Schedule <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link href="/trainings" className="group p-8 border border-border bg-background hover:border-primary transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full">
                <div className="w-14 h-14 bg-muted text-foreground flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-2xl font-space font-bold text-foreground mb-4">Training & Certification</h3>
                <p className="text-muted-foreground mb-8 flex-1">
                  Complete mandatory safety training and learn how to operate advanced machinery independently.
                </p>
                <div className="flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                  Browse Courses <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link href="/resources" className="group p-8 border border-border bg-background hover:border-primary transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full">
                <div className="w-14 h-14 bg-muted text-foreground flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                  <FileText size={24} />
                </div>
                <h3 className="text-2xl font-space font-bold text-foreground mb-4">Documentation</h3>
                <p className="text-muted-foreground mb-8 flex-1">
                  Access machine manuals, design guidelines, safety protocols, and software tutorials.
                </p>
                <div className="flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                  Explore Resources <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* METRICS SECTION */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-y border-border py-16"
          >
            <motion.div variants={fadeUp}>
              <div className="text-5xl md:text-6xl font-space font-bold text-foreground mb-2">{stats.machines}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Active Machines</div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="text-5xl md:text-6xl font-space font-bold text-foreground mb-2">{stats.projects}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Projects Completed</div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="text-5xl md:text-6xl font-space font-bold text-foreground mb-2">{stats.staff}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Expert Staff</div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="text-5xl md:text-6xl font-space font-bold text-foreground mb-2">{stats.incidents}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Safety Incidents</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_100%)] opacity-[0.03] mix-blend-multiply" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-space font-bold tracking-tight mb-6">Ready to start building?</h2>
          <p className="text-xl text-muted-foreground font-light mb-10">
            Join the BRACU FabLab community today. Complete your safety training and book your first machine.
          </p>
          <Link
            href="/register"
            className="group relative overflow-hidden inline-flex items-center justify-center px-10 py-5 bg-primary text-primary-foreground font-space font-bold uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 -translate-x-full bg-white/20 group-hover:animate-shimmer" />
            Create an Account
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

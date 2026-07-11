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
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
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

      {/* 2x2 CAPABILITIES GRID SECTION */}
      <section className="py-28 bg-foreground text-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-space font-bold tracking-tight text-background mb-4">Core Capabilities.</h2>
            <p className="text-xl text-background/75 font-light max-w-2xl">
              State-of-the-art manufacturing equipment and prototyping labs engineered to take your ideas from concept to production.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Card 1: Precision 3D Printing */}
            <motion.div variants={fadeUp} className="group bg-background/5 border border-background/15 overflow-hidden flex flex-col hover:border-primary transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-background/10">
                <Image
                  src="/images/printer.png"
                  alt="Precision 3D Printing"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-between flex-1">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Layers size={24} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-space font-bold tracking-tight text-background mb-3 group-hover:text-primary transition-colors">
                    Precision 3D Printing
                  </h3>
                  <p className="text-background/75 leading-relaxed mb-8">
                    Access industrial FDM and SLA printers capable of micrometre precision. Perfect for complex mechanical parts and rapid prototyping.
                  </p>
                </div>
                <Link href="/facilities" className="inline-flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-background group-hover:text-primary transition-colors w-fit">
                  <span>View Printers</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Card 2: Advanced CNC Machining */}
            <motion.div variants={fadeUp} className="group bg-background/5 border border-background/15 overflow-hidden flex flex-col hover:border-primary transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-background/10">
                <Image
                  src="/images/cnc.png"
                  alt="Advanced CNC Machining"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-between flex-1">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Crosshair size={24} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-space font-bold tracking-tight text-background mb-3 group-hover:text-primary transition-colors">
                    Advanced CNC Machining
                  </h3>
                  <p className="text-background/75 leading-relaxed mb-8">
                    Mill aluminum, wood, and acrylic with our 5-axis routers. Transform raw materials into durable finished products with absolute precision.
                  </p>
                </div>
                <Link href="/facilities" className="inline-flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-background group-hover:text-primary transition-colors w-fit">
                  <span>View CNC Machines</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Card 3: Electronics & Prototyping */}
            <motion.div variants={fadeUp} className="group bg-background/5 border border-background/15 overflow-hidden flex flex-col hover:border-primary transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-background/10">
                <Image
                  src="/images/electronics.png"
                  alt="Electronics & Prototyping"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-between flex-1">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-space font-bold tracking-tight text-background mb-3 group-hover:text-primary transition-colors">
                    Electronics & Prototyping
                  </h3>
                  <p className="text-background/75 leading-relaxed mb-8">
                    Fully equipped workstations featuring oscilloscopes, precision soldering stations, microcontrollers, and embedded sensor suites.
                  </p>
                </div>
                <Link href="/facilities" className="inline-flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-background group-hover:text-primary transition-colors w-fit">
                  <span>Explore Equipment</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Card 4: Industrial Laser Cutting */}
            <motion.div variants={fadeUp} className="group bg-background/5 border border-background/15 overflow-hidden flex flex-col hover:border-primary transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-background/10">
                <Image
                  src="/images/laser.png"
                  alt="Industrial Laser Cutting"
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-between flex-1">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Maximize size={24} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-space font-bold tracking-tight text-background mb-3 group-hover:text-primary transition-colors">
                    Industrial Laser Cutting
                  </h3>
                  <p className="text-background/75 leading-relaxed mb-8">
                    Rapidly cut and engrave wood, acrylic, leather, and composites with our high-power CO2 laser systems for intricate geometric cuts.
                  </p>
                </div>
                <Link href="/facilities" className="inline-flex items-center gap-2 text-sm font-space font-bold uppercase tracking-widest text-background group-hover:text-primary transition-colors w-fit">
                  <span>View Laser Cutters</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
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
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
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

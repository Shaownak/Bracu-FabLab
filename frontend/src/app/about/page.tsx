'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Lightbulb } from 'lucide-react';
import Image from 'next/image';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const teamMembers = [
  { name: 'Dr. Ahmed Rahman', image: '/images/team_ahmed.png', role: 'Faculty Advisor', department: 'Department of CSE' },
  { name: 'Dr. Fatima Noor', image: '/images/team_fatima.png', role: 'Faculty Advisor', department: 'Department of EEE' },
  { name: 'Rashid Karim', image: '', role: 'Lab Manager', department: 'FabLab Operations' },
  { name: 'Nusrat Jahan', image: '', role: 'Technical Lead', department: '3D Printing & CNC' },
  { name: 'Tanvir Hasan', image: '', role: 'Electronics Specialist', department: 'PCB & Circuits' },
  { name: 'Ayesha Siddiqua', image: '', role: 'Design Coordinator', department: 'Laser Cutting & Design' },
];

const industrialPartners = [
  'Walton Group', 'BSRM', 'Grameenphone', 'Intel', 'Energypac', 'Aarong', 'Square Group'
];

const academicPartners = [
  'MIT CBA', 'Fab Foundation', 'BUET', 'Dhaka University', 'IEEE', 'Harvard GSD'
];

export default function AboutPage() {
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
          <Image src="/images/about_hero.png" alt="About FabLab" fill className="object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
        </motion.div>
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-5xl md:text-7xl font-space font-bold tracking-tighter text-foreground mb-6"
          >
            BRAC University <br />
            <span className="text-primary">FabLab.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-lg md:text-xl text-muted-foreground font-light"
          >
            The Fabrication Laboratory at BRAC University is a cutting-edge innovation hub that empowers students, faculty, and researchers to explore digital fabrication, rapid prototyping, and advanced manufacturing technologies. We believe in learning by making.
          </motion.p>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className="relative aspect-[16/9] w-full group overflow-hidden border border-border">
              <Image src="/images/about_gallery_1.png" alt="Student Soldering PCB" fill className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className="relative aspect-[16/9] w-full group overflow-hidden border border-border">
              <Image src="/images/about_gallery_2.png" alt="Student using 3D Printer" fill className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MISSION, VISION, OBJECTIVES */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Target, title: 'Mission', text: 'To democratize access to advanced fabrication technologies and foster a culture of innovation, creativity, and hands-on learning at BRAC University.' },
              { icon: Eye, title: 'Vision', text: 'To become the leading university fabrication laboratory in South Asia, nurturing the next generation of innovators, engineers, and entrepreneurs.' },
              { icon: Lightbulb, title: 'Objectives', text: 'Provide state-of-the-art fabrication tools, deliver hands-on training, support research and development, and create pathways from concept to prototype.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } } }}
                className="bg-card border border-border p-10 flex flex-col hover:border-foreground/30 transition-colors"
              >
                <div className="mb-8 text-foreground">
                  <item.icon size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-space font-bold text-foreground mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-32 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-space font-bold text-foreground tracking-tight">Our People.</h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl font-light">
              Meet the faculty advisors and technical experts dedicated to running the FabLab and supporting your innovation journey.
            </p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } } }}
                className="group bg-card border border-border hover:border-foreground transition-colors flex flex-col overflow-hidden"
              >
                {member.image ? (
                  <div className="relative aspect-square w-full overflow-hidden border-b border-border">
                    <Image src={member.image} alt={member.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="aspect-square w-full bg-muted text-foreground flex items-center justify-center font-space font-bold text-6xl border-b border-border">
                    {member.name.charAt(0)}
                  </div>
                )}
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-space font-bold text-foreground group-hover:text-primary transition-colors">{member.name}</h3>
                  <div className="mt-4 pt-4 border-t border-border flex flex-col gap-1">
                    <p className="text-sm font-medium uppercase tracking-widest text-primary">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.department}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PARTNERS SECTION */}
      <section className="py-32 bg-card border-t border-border overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-space font-bold text-foreground tracking-tight">Our Partners.</h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto font-light">
            Collaborating with leading industrial and academic institutions to foster innovation and practical research.
          </p>
        </motion.div>

        {/* Industrial Partners Slider */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h3 className="text-xl font-space font-bold text-muted-foreground mb-6 uppercase tracking-widest text-center">Industrial</h3>
          <div className="relative flex overflow-x-hidden group w-full">
            <div className="animate-marquee flex whitespace-nowrap group-hover:[animation-play-state:paused] w-max">
              {[...industrialPartners, ...industrialPartners].map((partner, i) => (
                <div key={i} className="flex-none mx-4 w-72 h-32 bg-background border border-border flex items-center justify-center hover:border-primary transition-colors hover:shadow-lg">
                  <span className="font-space font-bold text-2xl text-foreground uppercase tracking-widest text-center px-4 whitespace-pre-wrap">{partner}</span>
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-card to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-card to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Academic Partners Slider */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h3 className="text-xl font-space font-bold text-muted-foreground mb-6 uppercase tracking-widest text-center">Academic</h3>
          <div className="relative flex overflow-x-hidden group w-full">
            <div className="animate-marquee-reverse flex whitespace-nowrap group-hover:[animation-play-state:paused] w-max">
              {[...academicPartners, ...academicPartners].map((partner, i) => (
                <div key={i} className="flex-none mx-4 w-72 h-32 bg-background border border-border flex items-center justify-center hover:border-primary transition-colors hover:shadow-lg">
                  <span className="font-space font-bold text-xl text-foreground text-center px-4 uppercase tracking-widest whitespace-pre-wrap">{partner}</span>
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-card to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-card to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </section>

    </div>
  );
}

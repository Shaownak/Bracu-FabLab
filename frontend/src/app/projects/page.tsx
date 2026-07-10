'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Award, FolderGit2, Loader2, X, Info, ExternalLink, Layers } from 'lucide-react';
import Image from 'next/image';
import { projectAPI } from '@/lib/api';
import { resolveImageUrl } from '@/lib/utils';

interface ProjectData {
  id: string;
  title: string;
  image: string;
  category: string;
  team: string;
  supervisor?: string;
  description?: string;
  tech: string[];
  award?: boolean;
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

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [detailProject, setDetailProject] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, catRes] = await Promise.all([
          projectAPI.list(),
          projectAPI.getCategories().catch(() => ({ data: ['Robotics', 'IoT', 'AI Hardware', 'Biomedical', 'Mechanical', 'Sustainability'] }))
        ]);
        
        const data = projRes.data?.results || projRes.data;
        if (Array.isArray(data)) {
          setProjects(data);
        }
        
        const catData = catRes.data?.results || catRes.data;
        if (Array.isArray(catData)) {
          setCategories(['All', ...catData.map((c: any) => c.name || c)]);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = projects.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.tech.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
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
          <Image src="/images/project_drone.png" alt="Innovation Gallery" fill className="object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
        </motion.div>
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-5xl md:text-7xl font-space font-bold tracking-tighter text-foreground mb-6"
          >
            Innovation <br />
            <span className="text-primary">Gallery.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-lg md:text-xl text-muted-foreground font-light"
          >
            Explore breakthrough projects created by our talented students and faculty researchers using FabLab equipment.
          </motion.p>
        </div>
      </section>

      {/* FILTER & SEARCH */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
          
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-foreground text-background'
                    : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search projects or tech..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent border-b border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" 
            />
          </div>

        </div>
      </motion.section>

      {/* PROJECTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 border border-dashed border-border mt-6">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-space font-semibold text-foreground mb-2">Loading Projects</h3>
            <p className="text-muted-foreground">Connecting to the FabLab database...</p>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <motion.div 
                key={project.id} 
                variants={fadeUp}
                onClick={() => setDetailProject(project)}
                className="group flex flex-col justify-between bg-card structural-border hover:border-primary/50 transition-all min-h-[400px] overflow-hidden cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-muted/40 flex items-center justify-center">
                  <Image src={resolveImageUrl(project.image) || '/images/project_drone.png'} alt="" fill className="object-cover blur-2xl opacity-30 scale-125 pointer-events-none" />
                  <Image src={resolveImageUrl(project.image) || '/images/project_drone.png'} alt={project.title} fill className="object-contain p-3 transition-transform duration-700 group-hover:scale-105 z-10" />
                  {project.award && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 text-xs font-medium border border-amber-500/20 bg-amber-500 text-amber-950 shadow-lg backdrop-blur-sm z-20">
                      <Award size={12} /> Awarded
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 text-xs font-medium border border-border bg-background/80 backdrop-blur-md text-foreground z-20">
                    {project.category}
                  </div>
                  <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-background/90 text-foreground border border-border shadow-sm backdrop-blur-md">
                      <Info size={12} className="text-primary" /> Project Details
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-space font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Users size={14} className="text-primary" /> {project.team} {project.supervisor ? `· ${project.supervisor}` : ''}
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-6 border-t border-border mt-auto">
                    {Array.isArray(project.tech) ? project.tech.map((t) => (
                      <span key={t} className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground">
                        {t}
                      </span>
                    )) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 grayscale pointer-events-none mt-6 relative">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-background/90 backdrop-blur-sm border border-border px-8 py-6 flex flex-col items-center">
                <FolderGit2 className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-xl font-space font-semibold text-foreground">No Projects Found</h3>
                <p className="text-sm text-muted-foreground mt-1">Showing placeholders</p>
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div 
                key={`dummy-${i}`} 
                className="group flex flex-col justify-between bg-card structural-border hover:border-foreground/30 transition-colors min-h-[400px] overflow-hidden"
              >
                <div className="relative h-48 w-full overflow-hidden border-b border-border bg-muted/30">
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 text-xs font-medium border border-border bg-background/80 backdrop-blur-md text-foreground z-10">
                    Category Placeholder
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-space font-bold text-muted-foreground mb-4">
                      Sample Project Title {i}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                      <Users size={14} /> Team Alpha · Supervisor Name
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-6 border-t border-border mt-auto">
                    {['React', 'Arduino', '3D Printing'].map((t) => (
                      <span key={t} className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Project Details Modal */}
      {detailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-card border border-border shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header & Auto-Adjust Photo */}
            <div className="relative w-full aspect-[16/9] bg-muted/40 border-b border-border overflow-hidden flex items-center justify-center">
              <Image
                src={resolveImageUrl(detailProject.image) || '/images/project_drone.png'}
                alt=""
                fill
                className="object-cover blur-3xl opacity-30 scale-125 pointer-events-none"
              />
              <Image
                src={resolveImageUrl(detailProject.image) || '/images/project_drone.png'}
                alt={detailProject.title}
                fill
                className="object-contain p-4 z-10"
              />

              <button
                onClick={() => setDetailProject(null)}
                className="absolute top-4 right-4 z-30 p-2.5 bg-background/80 hover:bg-background text-foreground border border-border shadow-md transition-colors"
                aria-label="Close details"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-mono font-bold bg-background/90 text-primary border border-border shadow-sm backdrop-blur-md uppercase">
                  {detailProject.category}
                </span>
                {detailProject.award && (
                  <span className="px-3 py-1 text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-500 shadow-sm backdrop-blur-md flex items-center gap-1.5">
                    <Award size={12} /> Award Winning
                  </span>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
                  <Users size={14} className="text-primary" /> Team: {detailProject.team} {detailProject.supervisor ? `· Supervisor: ${detailProject.supervisor}` : ''}
                </div>
                <h2 className="text-3xl font-space font-bold text-foreground">{detailProject.title}</h2>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-2">Project Abstract & Details</h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {detailProject.description || 'Breakthrough fabrication project developed using BRAC University FabLab prototyping tools and precision machinery.'}
                </p>
              </div>

              {/* Technologies Used */}
              {detailProject.tech && Array.isArray(detailProject.tech) && detailProject.tech.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-3">Technologies & Hardware Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailProject.tech.map((t: string) => (
                      <span key={t} className="px-3 py-1.5 text-xs font-mono bg-muted/60 text-foreground border border-border">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 bg-muted/30 border-t border-border flex items-center justify-end gap-3">
              <button
                onClick={() => setDetailProject(null)}
                className="px-6 py-3 text-sm font-space font-medium border border-border hover:bg-muted transition-colors text-foreground"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

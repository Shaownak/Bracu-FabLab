'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, FileText, Video, Archive, FileCode, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { resourceAPI } from '@/lib/api';

interface ResourceData {
  id: string;
  title: string;
  category: string;
  type: string;
  size: string;
  downloads: number;
}

const getIconForType = (type: string, category: string) => {
  if (type === 'Video') return Video;
  if (type === 'ZIP') return Archive;
  if (type === 'EXE/DMG') return Download;
  if (category.includes('Safety')) return CheckCircle;
  if (category.includes('Software')) return FileCode;
  return FileText;
};

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

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRes, catRes] = await Promise.all([
          resourceAPI.list(),
          resourceAPI.getCategories().catch(() => ({ data: ['Manuals', 'Safety Guidelines', 'Software', 'Tutorials', 'Design Assets'] }))
        ]);
        const data = resRes.data?.results || resRes.data;
        if (Array.isArray(data)) {
          setResources(data);
        }
        
        const catData = catRes.data?.results || catRes.data;
        if (Array.isArray(catData)) {
          setCategories(['All', ...catData.map((c: any) => c.name || c)]);
        }
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = resources.filter((r) => {
    const matchCat = activeCategory === 'All' || r.category === activeCategory;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
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
          <Image src="/images/laser.png" alt="Resources" fill className="object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
        </motion.div>
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-5xl md:text-7xl font-space font-bold tracking-tighter text-foreground mb-6"
          >
            Knowledge <br />
            <span className="text-primary">Base.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-lg md:text-xl text-muted-foreground font-light"
          >
            Access authoritative manuals, safety protocols, software drivers, and expert tutorials for all FabLab equipment.
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

          <div className="relative w-full md:w-80 flex-shrink-0 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search documents or software..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent border-b border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" 
            />
          </div>

        </div>
      </motion.section>

      {/* RESOURCES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 border border-dashed border-border mt-6">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-space font-semibold text-foreground mb-2">Loading Resources</h3>
            <p className="text-muted-foreground">Connecting to the FabLab database...</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filtered.map((resource) => {
              const IconComp = getIconForType(resource.type, resource.category);
              return (
                <motion.div 
                  key={resource.id} 
                  variants={fadeUp}
                  className="group bg-card border border-border hover:border-foreground/30 transition-colors p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <div className="text-foreground">
                          <IconComp size={28} strokeWidth={1.5} className="group-hover:text-primary transition-colors" />
                        </div>
                        <span className="px-2 py-1 text-xs font-medium border border-border bg-muted text-foreground uppercase tracking-widest group-hover:border-foreground/20 transition-colors">
                          {resource.type}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-space font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">
                        {resource.category}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-border flex items-end justify-between">
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground font-medium">
                        <span>{resource.size}</span>
                        <span>{resource.downloads} DLs</span>
                      </div>
                      
                      <button className="flex items-center justify-center w-10 h-10 border border-border bg-background text-foreground hover:bg-foreground hover:text-background hover:scale-105 active:scale-95 transition-all">
                        {resource.size === 'External' ? <ExternalLink size={16} /> : <Download size={16} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-60 grayscale pointer-events-none mt-6 relative">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-background/90 backdrop-blur-sm border border-border px-8 py-6 flex flex-col items-center">
                <Archive className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-xl font-space font-semibold text-foreground">No Resources Found</h3>
                <p className="text-sm text-muted-foreground mt-1">Showing placeholders</p>
              </div>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={`dummy-${i}`} 
                className="group bg-card border border-border hover:border-foreground/30 transition-colors p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col h-full">
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-foreground">
                        <FileText size={28} strokeWidth={1.5} className="group-hover:text-primary transition-colors" />
                      </div>
                      <span className="px-2 py-1 text-xs font-medium border border-border bg-muted text-muted-foreground uppercase tracking-widest group-hover:border-foreground/20 transition-colors">
                        PDF
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-space font-bold text-muted-foreground mb-3 group-hover:text-primary transition-colors">
                      Sample Resource {i}
                    </h3>
                    
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">
                      Manuals
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-border flex items-end justify-between">
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground font-medium">
                      <span>2.5 MB</span>
                      <span>0 DLs</span>
                    </div>
                    
                    <button className="flex items-center justify-center w-10 h-10 border border-border bg-background text-foreground hover:bg-foreground hover:text-background hover:scale-105 active:scale-95 transition-all">
                      <Download size={16} />
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

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, Printer, Layers, Cog, Bot, CircuitBoard, MapPin, Clock, CheckCircle, Wrench, ArrowRight, Loader2, X, Info, ExternalLink, Sliders } from 'lucide-react';
import Image from 'next/image';
import BookingModal from '@/components/booking/BookingModal';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'next/navigation';
import { equipmentAPI } from '@/lib/api';
import { resolveImageUrl } from '@/lib/utils';

const staticCategories = [
  { id: 'all', name: 'All Equipment', icon: Filter },
  { id: '3D Printer', name: '3D Printers', icon: Printer },
  { id: 'Laser Cutter', name: 'Laser Cutters', icon: Layers },
  { id: 'CNC Machine', name: 'CNC Machines', icon: Cog },
  { id: 'Electronics', name: 'Electronics', icon: CircuitBoard },
  { id: 'Robotics', name: 'Robotics', icon: Bot },
];

const statusConfig: Record<string, { label: string; colorClass: string; icon: React.ElementType }> = {
  available: { label: 'Available', colorClass: 'text-green-600 dark:text-green-400 border-green-600/20 bg-green-600/5', icon: CheckCircle },
  in_use: { label: 'In Use', colorClass: 'text-orange-600 dark:text-orange-400 border-orange-600/20 bg-orange-600/5', icon: Clock },
  maintenance: { label: 'Maintenance', colorClass: 'text-red-600 dark:text-red-400 border-red-600/20 bg-red-600/5', icon: Wrench },
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

export default function FacilitiesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<{id: string, name: string} | null>(null);
  const [detailEquipment, setDetailEquipment] = useState<any | null>(null);
  
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    equipmentAPI.list().then(res => {
      setEquipmentList(res.data.results || res.data || []);
    }).catch(err => {
      console.error("Failed to load equipment", err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const dynamicCategories = [
    { id: 'all', name: 'All Equipment', icon: Filter },
    ...Array.from(new Set(equipmentList.map(e => e.category_name).filter(Boolean))).map(name => {
      const matchedStatic = staticCategories.find(c => c.name === name || c.id === name);
      return {
        id: name as string,
        name: name as string,
        icon: matchedStatic ? matchedStatic.icon : Layers,
      };
    })
  ];

  const handleBook = (item: any) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setSelectedEquipment({ id: item.id, name: item.name });
    setIsModalOpen(true);
  };

  const filtered = equipmentList.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category_name === activeCategory;
    const matchesSearch = (item.name && item.name.toLowerCase().includes(search.toLowerCase())) || 
                          (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
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
          <Image src="/images/facilities_hero.png" alt="Facilities" fill className="object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
        </motion.div>
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-5xl md:text-7xl font-space font-bold tracking-tighter text-foreground mb-6"
          >
            Equipment <br />
            <span className="text-primary">Catalog.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-lg md:text-xl text-muted-foreground font-light"
          >
            Browse our high-end fabrication machinery. Filter by category, check real-time availability, and secure your time slot.
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
          
          {/* Categories */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 hide-scrollbar">
            {dynamicCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-foreground text-background'
                    : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <cat.icon size={16} />
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search by name or specs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border structural-border shadow-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

        </div>
      </motion.section>

      {/* EQUIPMENT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border mt-6">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-space font-semibold text-foreground mb-2">Loading Equipment</h3>
            <p className="text-muted-foreground">Connecting to the FabLab database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => {
              const status = statusConfig[item.status] || statusConfig['available'];
              return (
                <div
                  key={item.id || i}
                  onClick={() => setDetailEquipment(item)}
                  className="group flex flex-col justify-between bg-card p-0 border border-border hover:border-primary/50 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div>
                    {/* Image section with auto-adjust aspect & ambient blur */}
                    <div className="relative w-full aspect-[16/10] bg-muted/40 border-b border-border overflow-hidden flex items-center justify-center">
                      {item.image || item.primary_image?.image ? (
                        <>
                          <Image
                            src={resolveImageUrl(item.image || item.primary_image?.image)}
                            alt=""
                            fill
                            className="object-cover blur-2xl opacity-30 scale-125 pointer-events-none"
                          />
                          <Image
                            src={resolveImageUrl(item.image || item.primary_image?.image)}
                            alt={item.name || 'Equipment'}
                            fill
                            className="object-contain p-3 transition-transform duration-700 group-hover:scale-105 z-10"
                          />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground transition-transform duration-700 group-hover:scale-105">
                          <Layers size={48} className="opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 z-20">
                        <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium border shadow-sm backdrop-blur-md ${status.colorClass}`}>
                          <status.icon size={12} />
                          {status.label}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-background/90 text-foreground border border-border shadow-sm backdrop-blur-md">
                          <Info size={12} className="text-primary" /> Click to view full specs
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-space font-bold text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                        {item.description || 'No detailed description available for this equipment.'}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 mt-auto">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> {item.location || 'FabLab'}</span>
                      <span className="text-primary hover:underline flex items-center gap-1">Details & Specs <ExternalLink size={12} /></span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBook(item);
                      }}
                      disabled={item.status !== 'available'}
                      className={`relative overflow-hidden group/btn flex items-center justify-between w-full px-6 py-4 text-sm font-space font-bold tracking-widest uppercase transition-all ${
                        item.status === 'available'
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      {item.status === 'available' && <div className="absolute inset-0 -translate-x-full bg-white/20 group-hover/btn:animate-shimmer pointer-events-none" />}
                      <span>
                        {item.status === 'available' ? 'Book Machine' : item.status === 'in_use' ? 'Currently In Use' : 'Under Maintenance'}
                      </span>
                      {item.status === 'available' && <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 grayscale pointer-events-none mt-6 relative">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-background/90 backdrop-blur-sm border border-border px-8 py-6 flex flex-col items-center">
                <Layers className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-xl font-space font-semibold text-foreground">No Equipment Found</h3>
                <p className="text-sm text-muted-foreground mt-1">Showing placeholders</p>
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={`dummy-${i}`}
                className="group flex flex-col justify-between bg-card p-0 border border-border hover:border-foreground/30 transition-colors overflow-hidden"
              >
                <div>
                  <div className="relative w-full h-48 bg-muted border-b border-border overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <Layers size={48} className="opacity-20" />
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                      <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium border shadow-sm backdrop-blur-md border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                        Available
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-space font-bold text-muted-foreground mb-3 line-clamp-1">Sample Machine {i}</h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                      Placeholder description for this equipment.
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 mt-auto">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-6">
                    <MapPin size={14} /> FabLab Main
                  </div>
                  
                  <button className="w-full px-6 py-4 text-sm font-space font-bold tracking-widest uppercase bg-muted text-muted-foreground">
                    Book Machine
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Equipment Detail Modal */}
      {detailEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-card border border-border shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header & Auto-Adjust Photo */}
            <div className="relative w-full aspect-[16/9] bg-muted/40 border-b border-border overflow-hidden flex items-center justify-center">
              {detailEquipment.image || detailEquipment.primary_image?.image ? (
                <>
                  <Image
                    src={resolveImageUrl(detailEquipment.image || detailEquipment.primary_image?.image)}
                    alt=""
                    fill
                    className="object-cover blur-3xl opacity-30 scale-125 pointer-events-none"
                  />
                  <Image
                    src={resolveImageUrl(detailEquipment.image || detailEquipment.primary_image?.image)}
                    alt={detailEquipment.name || 'Equipment'}
                    fill
                    className="object-contain p-4 z-10"
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Layers size={64} className="opacity-20 mb-2" />
                  <span className="text-xs font-mono">No Image Uploaded</span>
                </div>
              )}

              <button
                onClick={() => setDetailEquipment(null)}
                className="absolute top-4 right-4 z-30 p-2.5 bg-background/80 hover:bg-background text-foreground border border-border shadow-md transition-colors"
                aria-label="Close details"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-mono font-bold bg-background/90 text-primary border border-border shadow-sm backdrop-blur-md uppercase">
                  {detailEquipment.category_name || 'Equipment'}
                </span>
                <span className={`px-3 py-1 text-xs font-medium border shadow-sm backdrop-blur-md ${
                  detailEquipment.status === 'available' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' : 'border-amber-500/30 bg-amber-500/10 text-amber-500'
                }`}>
                  {detailEquipment.status === 'available' ? 'Available for Booking' : detailEquipment.status === 'in_use' ? 'Currently In Use' : 'Under Maintenance'}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
                  <MapPin size={14} className="text-primary" /> {detailEquipment.location || 'FabLab Main Floor'}
                </div>
                <h2 className="text-3xl font-space font-bold text-foreground">{detailEquipment.name}</h2>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-2">Overview & Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {detailEquipment.description || 'No detailed description provided.'}
                </p>
              </div>

              {/* Technical Specifications */}
              {detailEquipment.specifications && typeof detailEquipment.specifications === 'object' && Object.keys(detailEquipment.specifications).length > 0 && (
                <div className="border-t border-border pt-6">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-4 flex items-center gap-2">
                    <Sliders size={14} /> Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 p-4 border border-border">
                    {Object.entries(detailEquipment.specifications).map(([key, val]) => (
                      <div key={key} className="flex flex-col border-b border-border/50 pb-2 last:border-b-0">
                        <span className="text-xs font-mono text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-medium text-foreground">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Requirements & Rates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-6">
                <div className="p-4 bg-muted/40 border border-border">
                  <span className="text-xs font-mono text-muted-foreground block mb-1">Training Requirement</span>
                  <span className="text-sm font-semibold text-foreground">
                    {detailEquipment.requires_training ? 'Safety Training & Certification Required' : 'Open Access / Standard Safety Rules'}
                  </span>
                </div>
                <div className="p-4 bg-muted/40 border border-border">
                  <span className="text-xs font-mono text-muted-foreground block mb-1">Usage Rate</span>
                  <span className="text-sm font-semibold text-foreground">
                    {detailEquipment.hourly_rate ? `BDT ${detailEquipment.hourly_rate} / hour` : 'Free for BRACU Academic Projects'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 bg-muted/30 border-t border-border flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={() => setDetailEquipment(null)}
                className="w-full sm:w-auto px-6 py-3 text-sm font-space font-medium border border-border hover:bg-muted transition-colors text-foreground"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = detailEquipment;
                  setDetailEquipment(null);
                  handleBook(target);
                }}
                disabled={detailEquipment.status !== 'available'}
                className={`w-full sm:w-auto px-8 py-3 text-sm font-space font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                  detailEquipment.status === 'available'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <span>{detailEquipment.status === 'available' ? 'Book This Machine' : 'Unavailable'}</span>
                {detailEquipment.status === 'available' && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEquipment(null);
        }} 
        equipmentId={selectedEquipment?.id}
        equipmentName={selectedEquipment?.name}
      />
    </div>
  );
}

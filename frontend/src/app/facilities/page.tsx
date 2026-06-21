'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, Printer, Layers, Cog, Bot, CircuitBoard, MapPin, Clock, CheckCircle, Wrench, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import BookingModal from '@/components/booking/BookingModal';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'next/navigation';
import { equipmentAPI } from '@/lib/api';

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
                  className="group flex flex-col justify-between bg-card p-0 border border-border hover:border-foreground/30 transition-colors overflow-hidden"
                >
                  <div>
                    {/* Image section */}
                    <div className="relative w-full h-48 bg-muted border-b border-border overflow-hidden">
                      {item.image || item.primary_image?.image ? (
                        <Image
                          src={item.image || item.primary_image?.image}
                          alt={item.name || 'Equipment'}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground transition-transform duration-700 group-hover:scale-105">
                          <Layers size={48} className="opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 z-10">
                        <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium border shadow-sm backdrop-blur-md ${status.colorClass}`}>
                          <status.icon size={12} />
                          {status.label}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-space font-bold text-foreground mb-3 line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                        {item.description || 'No detailed description available for this equipment.'}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 mt-auto">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-6">
                      <MapPin size={14} /> {item.location || 'FabLab'}
                    </div>
                    
                    <button
                      onClick={() => handleBook(item)}
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

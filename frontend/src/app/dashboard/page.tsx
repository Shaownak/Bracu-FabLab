'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, User, Calendar, FolderGit2, BookOpen, Award, Settings, Bell, Clock, FileText } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { bookingAPI, eventAPI, notificationAPI } from '@/lib/api';
import { formatTime, formatDate } from '@/lib/utils';
import Link from 'next/link';
import AdminManager from '@/components/admin/AdminManager';

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

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, fetchProfile, logout } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    recentBookings: [],
    upcomingEvents: [],
    notificationsCount: 0
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated && !user) {
      fetchProfile();
    }
  }, [isLoading, isAuthenticated, user, router, fetchProfile]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isAuthenticated) {
        try {
          const [bookingsRes, eventsRes, notifsRes] = await Promise.all([
            bookingAPI.list({ limit: '5' }),
            eventAPI.myEvents(),
            notificationAPI.unreadCount()
          ]);
          
          setDashboardData({
            recentBookings: bookingsRes.data.results || bookingsRes.data || [],
            upcomingEvents: eventsRes.data.results || eventsRes.data || [],
            notificationsCount: notifsRes.data.unread_count || 0
          });
        } catch (error) {
          console.error("Failed to load dashboard data", error);
        }
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'projects', label: 'My Projects', icon: FolderGit2 },
    { id: 'events', label: 'My Events', icon: BookOpen },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (user.role === 'admin') {
    tabs.push({ id: 'admin', label: 'Admin Panel', icon: Settings });
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-border mb-10"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-foreground text-background flex items-center justify-center text-3xl font-space font-bold">
              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-space font-bold text-foreground mb-1">
                Welcome back, {user.first_name}.
              </h1>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">
                {user.role} · {user.department || 'FabLab Member'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-3 bg-card border border-border text-foreground hover:bg-muted transition-colors">
              <Bell size={20} />
              {dashboardData.notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-background"></span>
              )}
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 border border-border text-foreground hover:bg-muted font-medium transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3"
          >
            <nav className="space-y-1 sticky top-32">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-foreground text-background' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            
            {activeTab === 'overview' && (
              <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={staggerContainer}
                className="space-y-10"
              >
                
                {/* Quick Actions */}
                <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Link href="/facilities" className="group bg-card p-6 border border-border hover:border-foreground transition-colors flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Calendar className="text-muted-foreground group-hover:text-primary transition-colors mb-4 relative z-10" size={24} />
                    <div className="relative z-10">
                      <h3 className="font-space font-bold text-foreground mb-1 group-hover:translate-x-1 transition-transform">Book Equipment</h3>
                      <p className="text-sm text-muted-foreground group-hover:translate-x-1 transition-transform delay-75">Reserve a machine for your project.</p>
                    </div>
                  </Link>
                  <Link href="/events" className="group bg-card p-6 border border-border hover:border-foreground transition-colors flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <BookOpen className="text-muted-foreground group-hover:text-primary transition-colors mb-4 relative z-10" size={24} />
                    <div className="relative z-10">
                      <h3 className="font-space font-bold text-foreground mb-1 group-hover:translate-x-1 transition-transform">Join an Event</h3>
                      <p className="text-sm text-muted-foreground group-hover:translate-x-1 transition-transform delay-75">Register for upcoming workshops.</p>
                    </div>
                  </Link>
                  <Link href="/projects" className="group bg-card p-6 border border-border hover:border-foreground transition-colors flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <FolderGit2 className="text-muted-foreground group-hover:text-primary transition-colors mb-4 relative z-10" size={24} />
                    <div className="relative z-10">
                      <h3 className="font-space font-bold text-foreground mb-1 group-hover:translate-x-1 transition-transform">Submit Project</h3>
                      <p className="text-sm text-muted-foreground group-hover:translate-x-1 transition-transform delay-75">Showcase your FabLab creation.</p>
                    </div>
                  </Link>
                </motion.div>

                {/* Recent Bookings */}
                <motion.div variants={fadeUp} className="bg-card border border-border p-8 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                    <h2 className="text-xl font-space font-bold text-foreground">Recent Bookings</h2>
                    <button onClick={() => setActiveTab('bookings')} className="text-sm font-medium text-primary hover:underline">View All</button>
                  </div>
                  
                  {dashboardData.recentBookings.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.recentBookings.slice(0, 3).map((booking: any) => (
                        <div key={booking.id} className="flex items-center justify-between p-5 border border-border bg-background hover:border-foreground/30 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="text-muted-foreground pt-1">
                              <Clock size={20} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{booking.equipment_name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatDate(booking.date)} · {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium uppercase tracking-wider border ${
                            booking.status === 'approved' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' :
                            booking.status === 'pending' ? 'border-amber-500/50 text-amber-500 bg-amber-500/10' :
                            'border-red-500/50 text-red-500 bg-red-500/10'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-border">
                      <FileText className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground mb-4">No recent bookings found.</p>
                      <Link href="/facilities" className="inline-flex px-6 py-2 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors">
                        Book a machine
                      </Link>
                    </div>
                  )}
                </motion.div>

              </motion.div>
            )}

            {activeTab === 'admin' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <AdminManager />
              </motion.div>
            )}

            {activeTab !== 'overview' && activeTab !== 'admin' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="bg-card border border-border p-12 text-center min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="text-muted-foreground/30 mb-6 group-hover:text-primary/50 transition-colors duration-500">
                  {tabs.find(t => t.id === activeTab)?.icon({ size: 64, strokeWidth: 1 })}
                </div>
                <h2 className="text-2xl font-space font-bold text-foreground mb-3 capitalize">{activeTab} Interface</h2>
                <p className="text-muted-foreground max-w-md mx-auto relative z-10">
                  This highly specialized dashboard module is currently being finalized. Check back soon for updates.
                </p>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

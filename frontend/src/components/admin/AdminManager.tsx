'use client';

import { useState, useEffect } from 'react';
import { equipmentAPI, projectAPI, eventAPI, resourceAPI, trainingAPI } from '@/lib/api';
import EditModal, { EditField } from './EditModal';
import { Edit, Trash2, Plus, RefreshCw } from 'lucide-react';

type AdminModule = 'equipment' | 'projects' | 'events' | 'resources' | 'trainings';

const MODULES: { id: AdminModule; label: string }[] = [
  { id: 'equipment', label: 'Equipment' },
  { id: 'projects', label: 'Projects' },
  { id: 'events', label: 'Events' },
  { id: 'resources', label: 'Resources' },
  { id: 'trainings', label: 'Trainings' },
];

export default function AdminManager() {
  const [activeModule, setActiveModule] = useState<AdminModule>('equipment');
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalFields, setModalFields] = useState<EditField[]>([]);

  const fetchItems = async (module: AdminModule) => {
    setIsLoading(true);
    try {
      let res;
      let catRes;
      switch (module) {
        case 'equipment': 
          res = await equipmentAPI.list(); 
          catRes = await equipmentAPI.getCategories().catch(() => null);
          break;
        case 'projects': 
          res = await projectAPI.list(); 
          catRes = await projectAPI.getCategories().catch(() => null);
          break;
        case 'events': 
          res = await eventAPI.list(); 
          break;
        case 'resources': 
          res = await resourceAPI.list(); 
          catRes = await resourceAPI.getCategories().catch(() => null);
          break;
        case 'trainings': 
          res = await trainingAPI.listCourses(); 
          break;
      }
      setItems(res?.data?.results || res?.data || []);
      if (catRes) {
        setCategories(catRes.data?.results || catRes.data || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error(`Error fetching ${module}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(activeModule);
  }, [activeModule]);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    // Define dynamic fields based on active module
    let fields: EditField[] = [];
    const catOptions = categories.map(c => ({ label: c.name, value: c.id }));
    
    if (activeModule === 'equipment') {
      fields = [
        { name: 'name', label: 'Equipment Name', type: 'text' },
        { name: 'category', label: 'Category', type: 'select', options: catOptions },
        { name: 'image', label: 'Equipment Image', type: 'file' },
        { name: 'status', label: 'Status', type: 'select', options: [
            { label: 'Available', value: 'available' },
            { label: 'In Use', value: 'in_use' },
            { label: 'Maintenance', value: 'maintenance' },
            { label: 'Out of Order', value: 'out_of_order' },
        ]},
        { name: 'description', label: 'Description', type: 'textarea' },
      ];
    } else if (activeModule === 'projects') {
      fields = [
        { name: 'title', label: 'Project Title', type: 'text' },
        { name: 'category', label: 'Category', type: 'select', options: catOptions },
        { name: 'image', label: 'Project Image', type: 'file' },
        { name: 'status', label: 'Status', type: 'select', options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
            { label: 'Archived', value: 'archived' },
        ]},
        { name: 'description', label: 'Description', type: 'textarea' },
      ];
    } else if (activeModule === 'events') {
      fields = [
        { name: 'title', label: 'Event Title', type: 'text' },
        { name: 'event_type', label: 'Event Type', type: 'select', options: [
            { label: 'Workshop', value: 'workshop' },
            { label: 'Hackathon', value: 'hackathon' },
            { label: 'Competition', value: 'competition' },
            { label: 'Guest Lecture', value: 'lecture' },
            { label: 'Maker Fair', value: 'maker_fair' },
        ]},
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'start_time', label: 'Start Time', type: 'time' },
        { name: 'end_time', label: 'End Time', type: 'time' },
        { name: 'venue', label: 'Venue', type: 'text' },
        { name: 'image', label: 'Event Image', type: 'file' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ];
    } else if (activeModule === 'resources') {
      fields = [
        { name: 'title', label: 'Resource Title', type: 'text' },
        { name: 'category', label: 'Category', type: 'select', options: catOptions },
        { name: 'resource_type', label: 'Resource Type', type: 'select', options: [
            { label: 'Tutorial', value: 'tutorial' },
            { label: 'User Manual', value: 'manual' },
            { label: 'Standard Operating Procedure', value: 'sop' },
            { label: 'Safety Guideline', value: 'safety' },
            { label: 'Other', value: 'other' },
        ]},
        { name: 'file', label: 'Resource File', type: 'file' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ];
    } else if (activeModule === 'trainings') {
      fields = [
        { name: 'title', label: 'Course Title', type: 'text' },
        { name: 'difficulty', label: 'Difficulty', type: 'select', options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
        ]},
        { name: 'thumbnail', label: 'Course Thumbnail', type: 'file' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ];
    }

    setModalFields(fields);
    setIsModalOpen(true);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSave = async (data: any) => {
    try {
      let payload = { ...data };
      if (!payload.slug && payload.title) payload.slug = generateSlug(payload.title);
      if (!payload.slug && payload.name) payload.slug = generateSlug(payload.name);

      const hasFile = Object.values(payload).some(val => val instanceof File);
      let submitData: any = payload;
      
      if (hasFile) {
        submitData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value instanceof File) {
            submitData.append(key, value);
          } else if (value !== null && value !== undefined) {
             submitData.append(key, value as string);
          }
        });
      }

      if (editingItem) {
        const slugOrId = editingItem.slug || editingItem.id;
        if (activeModule === 'equipment') await equipmentAPI.update(slugOrId, submitData);
        else if (activeModule === 'projects') await projectAPI.update(slugOrId, submitData);
        else if (activeModule === 'events') await eventAPI.update(slugOrId, submitData);
        else if (activeModule === 'resources') await resourceAPI.update(slugOrId, submitData);
        else if (activeModule === 'trainings') await trainingAPI.updateCourse(slugOrId, submitData);
      } else {
        if (activeModule === 'equipment') await equipmentAPI.create(submitData);
        else if (activeModule === 'projects') await projectAPI.create(submitData);
        else if (activeModule === 'events') await eventAPI.create(submitData);
        else if (activeModule === 'resources') await resourceAPI.create(submitData);
        else if (activeModule === 'trainings') await trainingAPI.createCourse(submitData);
      }
      await fetchItems(activeModule); // Refresh
    } catch (error: any) {
      console.error('Update failed:', error);
      const apiError = error.response?.data;
      if (apiError) {
        alert('Validation Error: ' + JSON.stringify(apiError));
      } else {
        alert('Failed to save data. Please check console.');
      }
      throw error;
    }
  };

  const handleDelete = async (item: any) => {
    if (!window.confirm(`Are you sure you want to delete ${item.name || item.title}?`)) return;
    
    try {
      const slugOrId = item.slug || item.id;
      if (activeModule === 'equipment') await equipmentAPI.delete(slugOrId);
      else if (activeModule === 'projects') await projectAPI.delete(slugOrId);
      else if (activeModule === 'events') await eventAPI.delete(slugOrId);
      else if (activeModule === 'resources') await resourceAPI.delete(slugOrId);
      else if (activeModule === 'trainings') await trainingAPI.deleteCourse(slugOrId);
      
      await fetchItems(activeModule);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete item.');
    }
  };

  return (
    <div className="bg-card border border-border flex flex-col min-h-[600px]">
      {/* Header & Subtabs */}
      <div className="border-b border-border bg-muted/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-space font-bold text-foreground mb-1">Database Manager</h2>
          <p className="text-sm text-muted-foreground">Edit website resources and content.</p>
        </div>
        <div className="flex gap-2 bg-background p-1 border border-border">
          {MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeModule === mod.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {mod.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-border flex justify-between items-center bg-background">
        <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
          {items.length} Items Found
        </div>
        <div className="flex gap-2">
          <button onClick={() => fetchItems(activeModule)} className="p-2 border border-border hover:bg-muted transition-colors text-foreground">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => handleEdit(null)} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium text-sm hover:bg-foreground/90 transition-colors">
            <Plus size={16} /> New Item
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border text-sm font-medium text-muted-foreground uppercase tracking-widest">
              <th className="p-4">Name / Title</th>
              <th className="p-4">Identifier (Slug/ID)</th>
              <th className="p-4">Status / Type</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Loading {activeModule}...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No records found.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-muted/20 transition-colors bg-background group">
                  <td className="p-4 font-medium text-foreground">
                    {item.name || item.title || 'Untitled'}
                  </td>
                  <td className="p-4 text-muted-foreground font-mono text-sm">
                    {item.slug || item.id || '-'}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium uppercase tracking-wider border border-border bg-muted/50 text-foreground">
                      {item.status || item.difficulty || item.category_name || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-background border border-border hover:border-primary text-foreground hover:text-primary transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 bg-background border border-border hover:border-red-500 text-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={editingItem ? `Edit ${activeModule.charAt(0).toUpperCase() + activeModule.slice(1, -1)}` : `New ${activeModule.charAt(0).toUpperCase() + activeModule.slice(1, -1)}`}
        fields={modalFields}
        initialData={editingItem}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, deleteDoc, Timestamp, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, File, Plus, Trash2, CheckCircle, Clock, Share2, User, Mail, ExternalLink, ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  clientEmail: string;
  progress: number;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  freelancerId: string;
  createdAt: any;
}

interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  url: string;
  uploadedAt: any;
}

const ClientPortal: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [isFreelancer, setIsFreelancer] = useState(true);
  const [newProject, setNewProject] = useState({ name: '', clientEmail: '' });
  const [newFile, setNewFile] = useState({ name: '', url: '' });
  const [viewMode, setViewMode] = useState<'freelancer' | 'client'>('freelancer');

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = viewMode === 'freelancer' 
      ? query(collection(db, 'projects'), where('freelancerId', '==', auth.currentUser.uid))
      : query(collection(db, 'projects'), where('clientEmail', '==', auth.currentUser.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projs);
    });

    return () => unsubscribe();
  }, [viewMode]);

  useEffect(() => {
    if (!selectedProject) return;

    const q = query(collection(db, `projects/${selectedProject.id}/files`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectFile));
      setFiles(fs);
    });

    return () => unsubscribe();
  }, [selectedProject]);

  const handleCreateProject = async () => {
    if (!auth.currentUser || !newProject.name || !newProject.clientEmail) return;
    await addDoc(collection(db, 'projects'), {
      ...newProject,
      progress: 0,
      status: 'Planning',
      freelancerId: auth.currentUser.uid,
      createdAt: Timestamp.now()
    });
    setNewProject({ name: '', clientEmail: '' });
  };

  const handleAddFile = async () => {
    if (!selectedProject || !newFile.name || !newFile.url) return;
    await addDoc(collection(db, `projects/${selectedProject.id}/files`), {
      ...newFile,
      projectId: selectedProject.id,
      uploadedAt: Timestamp.now()
    });
    setNewFile({ name: '', url: '' });
  };

  const updateProgress = async (projectId: string, progress: number) => {
    await updateDoc(doc(db, 'projects', projectId), { progress });
  };

  const updateStatus = async (projectId: string, status: Project['status']) => {
    await updateDoc(doc(db, 'projects', projectId), { status });
  };

  const deleteProject = async (projectId: string) => {
    await deleteDoc(doc(db, 'projects', projectId));
    setSelectedProject(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-center mb-12">
        <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex">
          <button 
            onClick={() => setViewMode('freelancer')}
            className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'freelancer' ? 'bg-brand-accent text-brand-dark' : 'text-gray-400 hover:text-white'}`}
          >
            Mode Freelance
          </button>
          <button 
            onClick={() => setViewMode('client')}
            className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'client' ? 'bg-brand-accent text-brand-dark' : 'text-gray-400 hover:text-white'}`}
          >
            Mode Client
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar: Project List */}
        <div className="lg:col-span-4 space-y-6">
          <section className="glass p-8 rounded-[2.5rem] border border-white/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white flex items-center">
                <Folder className="mr-3 text-brand-accent" size={20} />
                Projets
              </h3>
              {viewMode === 'freelancer' && (
                <button onClick={() => setSelectedProject(null)} className="text-brand-accent hover:scale-110 transition-transform">
                  <Plus size={24} />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {projects.map(project => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`w-full p-5 rounded-2xl border transition-all text-left group ${selectedProject?.id === project.id ? 'bg-brand-accent border-brand-accent text-brand-dark' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-sm uppercase tracking-widest truncate pr-2">{project.name}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${selectedProject?.id === project.id ? 'bg-brand-dark/20' : 'bg-brand-accent/20 text-brand-accent'}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center text-[10px] opacity-60 font-bold">
                    <Mail size={10} className="mr-1" /> {project.clientEmail}
                  </div>
                </button>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-12 text-gray-500 italic text-sm">
                  Aucun projet trouvé.
                </div>
              )}
            </div>
          </section>

          {viewMode === 'freelancer' && !selectedProject && (
            <section className="glass p-8 rounded-[2.5rem] border border-white/5 animate-reveal-up">
              <h3 className="text-lg font-black text-white mb-6">Nouveau Projet</h3>
              <div className="space-y-4">
                <input
                  placeholder="Nom du Projet"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-accent"
                />
                <input
                  placeholder="Email du Client"
                  value={newProject.clientEmail}
                  onChange={(e) => setNewProject({ ...newProject, clientEmail: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-accent"
                />
                <button
                  onClick={handleCreateProject}
                  className="w-full py-4 bg-brand-accent text-brand-dark font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-brand-accent/20 hover:brightness-110 transition-all"
                >
                  Créer le Projet
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Main Content: Project Details */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <section className="glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                  
                  <div className="flex justify-between items-start mb-12 relative z-10">
                    <div>
                      <h2 className="text-4xl font-black text-white mb-2">{selectedProject.name}</h2>
                      <p className="text-gray-400 flex items-center text-sm">
                        <User size={14} className="mr-2" /> Client: {selectedProject.clientEmail}
                      </p>
                    </div>
                    {viewMode === 'freelancer' && (
                      <button onClick={() => deleteProject(selectedProject.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 size={24} />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-12 relative z-10">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Avancement</h4>
                      <div className="flex items-center space-x-6">
                        <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedProject.progress}%` }}
                            className="h-full bg-gradient-to-r from-brand-accent to-brand-purple rounded-full shadow-[0_0_15px_rgba(0,255,240,0.3)]"
                          />
                        </div>
                        <span className="text-2xl font-black text-brand-accent">{selectedProject.progress}%</span>
                      </div>
                      {viewMode === 'freelancer' && (
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={selectedProject.progress}
                          onChange={(e) => updateProgress(selectedProject.id, parseInt(e.target.value))}
                          className="w-full mt-6 accent-brand-accent"
                        />
                      )}
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Statut du Projet</h4>
                      <div className="flex flex-wrap gap-3">
                        {['Planning', 'In Progress', 'Review', 'Completed'].map((status) => (
                          <button
                            key={status}
                            disabled={viewMode === 'client'}
                            onClick={() => updateStatus(selectedProject.id, status as any)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedProject.status === status ? 'bg-brand-accent border-brand-accent text-brand-dark' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                  <section className="glass p-8 rounded-[2.5rem] border border-white/5">
                    <h3 className="text-xl font-black text-white mb-8 flex items-center">
                      <File className="mr-3 text-brand-accent" size={20} />
                      Fichiers Partagés
                    </h3>
                    <div className="space-y-4">
                      {files.map(file => (
                        <div key={file.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 group hover:border-brand-accent/30 transition-all">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent mr-4">
                              <File size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white truncate max-w-[150px]">{file.name}</p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(file.uploadedAt?.toDate()).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 text-brand-accent hover:scale-110 transition-transform">
                            <ExternalLink size={18} />
                          </a>
                        </div>
                      ))}
                      {files.length === 0 && (
                        <div className="text-center py-8 text-gray-500 italic text-sm">
                          Aucun fichier partagé.
                        </div>
                      )}
                    </div>
                  </section>

                  {viewMode === 'freelancer' && (
                    <section className="glass p-8 rounded-[2.5rem] border border-white/5">
                      <h3 className="text-xl font-black text-white mb-8 flex items-center">
                        <Share2 className="mr-3 text-brand-accent" size={20} />
                        Ajouter un Fichier
                      </h3>
                      <div className="space-y-4">
                        <input
                          placeholder="Nom du Fichier"
                          value={newFile.name}
                          onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-accent"
                        />
                        <input
                          placeholder="Lien de téléchargement (URL)"
                          value={newFile.url}
                          onChange={(e) => setNewFile({ ...newFile, url: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-accent"
                        />
                        <button
                          onClick={handleAddFile}
                          className="w-full py-4 bg-brand-accent text-brand-dark font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-brand-accent/20 hover:brightness-110 transition-all"
                        >
                          Partager le Fichier
                        </button>
                      </div>
                    </section>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-20 glass rounded-[3rem] border border-white/5 border-dashed">
                <div className="w-24 h-24 bg-brand-accent/10 rounded-full flex items-center justify-center text-brand-accent mb-8">
                  <ArrowRight size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">Sélectionnez un projet</h3>
                <p className="text-gray-500 max-w-md">
                  Choisissez un projet dans la liste de gauche pour voir l'avancement et accéder aux fichiers partagés.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
